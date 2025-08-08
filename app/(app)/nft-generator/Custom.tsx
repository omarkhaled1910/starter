import { Button } from "@/components/ui/button";
import FileUploader from "@/components/custom/FileUploader";
import FormField from "@/components/form/FormField";
import { useForm } from "@tanstack/react-form";
import React from "react";

const Custom = () => {
  const form = useForm({
    defaultValues: {
      shape: "cube",
      color: "#1e90ff",
      size: 1,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  const licencses = ["image", "text", "gradient"];

  const licencesField = {
    name: "licences",
    label: "Licences",
    type: "select" as const,
    placeholder: "Select a shape",
    options: licencses.map((s) => ({
      label: s.charAt(0).toUpperCase() + s.slice(1),
      value: s,
    })),
  };

  const nameField = {
    name: "name",
    label: "Name",
    type: "text" as const,
    placeholder: "Enter a name",
  };
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">
            Custom Art Configuration
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField fieldConfig={licencesField} form={form} />

              <FormField fieldConfig={nameField} form={form} />
            </div>

            <div className="flex justify-center w-full">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? "Updating..." : "Update Custom Art"}
                  </Button>
                )}
              />
            </div>
          </form>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Custom Art Preview</h2>

          <div className="">
            <FileUploader
              onUploadFinalize={(successes: string[]) => {
                console.log("uploaded", successes);
              }}
            />
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">How it works</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Adjust the parameters to customize your custom art</li>
              <li>• Real-time preview updates as you change settings</li>
              <li>• Use your mouse to rotate the view</li>
              <li>• Scroll to zoom in/out</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom;
