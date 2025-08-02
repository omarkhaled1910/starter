"use client";
import Link from "next/link";
import React from "react";
import { ArrowBigLeft, Eye, Trash } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import FormField from "@/components/form/FormField";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { deletePet, getPetById, updatePetPost } from "@/app/actions/pets";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FileUploader from "@/components/custom/FileUploader";

const EditPetPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["pet", id],
    queryFn: () => getPetById(id),
  });
  const queryClient = useQueryClient();

  console.log(data, "data");
  const form = useForm({
    defaultValues: {
      name: data?.name,
      status: data?.status,
      photoUrls: data?.photoUrls || [],
      tags:
        data?.tags?.map((tag) => {
          return { label: tag.name, value: tag.id };
        }) || [],
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const res = await updatePetPost(id, {
        name: value.name || "",
        status: value.status || "sold",
        petid: Number(id),
        photoUrls: value.photoUrls,
      });
      console.log(res, "res");
      if (res) {
        toast.success("Pet updated successfully");
        queryClient.invalidateQueries({ queryKey: ["pet", id] });
        queryClient.invalidateQueries({
          queryKey: ["pets", data?.status],
          exact: true,
        });
        router.push(`/pet/${id}`);

        return;
      }
      toast.error("Failed to update pet BACKEND TRY AGAIN!");
    },
  });

  const nameField = {
    name: "name",
    label: "Name",
    type: "text" as const,
    placeholder: "Enter your name",
    validators: {
      onChange: ({ value }: { value: string }) =>
        !value ? "Name is required" : undefined,
    },
  };

  const statusField = {
    name: "status",
    label: "Status",
    type: "select" as const,
    placeholder: "Select status",
    options: [
      { label: "Available", value: "available" },
      { label: "Pending", value: "pending" },
      { label: "Sold", value: "sold" },
    ],
    validators: {
      onChange: ({ value }: { value: string }) =>
        !value ? "Status is required" : undefined,
    },
  };
  const tagsField = {
    name: "tags",
    label: "Tags",
    type: "multi" as const,
    placeholder: "Select tags",
    options: [
      { label: "Tag 1", value: "tag1" },
      { label: "Tag 2", value: "tag2" },
      { label: "Tag 3", value: "tag3" },
      { label: "Tag 4", value: "tag4" },
      { label: "Tag 5", value: "tag5" },
      { label: "Tag 6", value: "tag6" },
      { label: "Tag 7", value: "tag7" },
      { label: "Tag 8", value: "tag8" },
      { label: "Tag 9", value: "tag9" },
      { label: "Tag 10", value: "tag10" },
    ],
    validators: {
      onChange: ({ value }: { value: any[] }) =>
        !value || value.length === 0
          ? "At least one tag is required"
          : undefined,
    },
  };

  return (
    <div>
      <header className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <div onClick={() => router.back()}>
            <ArrowBigLeft className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold">Pet Details Form {id}</h1>
        </div>
        <div className="flex gap-2">
          <Link className="w-full h-full" href={`/pet/${id}`}>
            <Button variant="outline">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => {
              deletePet(id).then((res) => {
                if (res?.success && res?.message) {
                  toast.success(res.message);
                  queryClient.invalidateQueries({
                    queryKey: ["pets", data?.status],
                    exact: true,
                  });
                  router.push("/pet-dashboard");
                }
              });
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </header>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {isLoading && <div>Loading...</div>}
        {error && !isLoading && !data && (
          <div>
            Error loading pet {error.message}{" "}
            <Button
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["pet", id] });
              }}
            >
              Retry
            </Button>
          </div>
        )}
        {data && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <div>
              <div className="mt-2">
                <FormField fieldConfig={nameField} form={form} />
              </div>
            </div>

            <div>
              <div className="mt-2">
                <FormField fieldConfig={statusField} form={form} />
              </div>
            </div>

            <div>
              <div className="mt-2">
                <FormField fieldConfig={tagsField} form={form} />
              </div>
            </div>

            <div>
              <div className="mt-2">
                <FileUploader
                  onUploadFinalize={(successes: string[]) => {
                    console.log("uploaded", successes);
                    form.setFieldValue(
                      "photoUrls",
                      successes.map((success) => `supa-${success}`)
                    );
                  }}
                />
              </div>
            </div>

            <div className="flex justify-center w-fill">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </Button>
                )}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPetPage;
