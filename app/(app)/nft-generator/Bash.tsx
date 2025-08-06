"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

import {
  generateCheckerboardSprite,
  generateGradientSprite,
  generateSpriteBitmap,
  PaletteMap,
} from "@/app/actions/bash-image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowBigLeft } from "lucide-react";
import FormField from "@/components/form/FormField";
import { useForm, useStore } from "@tanstack/react-form";
import CustomPaletteBuilder from "@/components/custom/CustomPaletteBuilder";

const Bash = () => {
  const router = useRouter();

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [palette, setPalette] = useState<PaletteMap | null>(null);
  const form = useForm({
    defaultValues: {
      patternType: "checkerboard",
      width: 16,
      height: 16,
      char1: "A",
      char2: "B",
      gradientChars: "A,B,C,D,E",
      customSprite: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const {
        patternType,
        width,
        height,
        char1,
        char2,
        gradientChars,
        customSprite,
      } = value;

      startTransition(async () => {
        try {
          // const palette = await createSimplePalette();
          let spriteData: string[] | undefined;

          switch (patternType) {
            case "checkerboard":
              spriteData = await generateCheckerboardSprite(
                width,
                height,
                char1,
                char2
              );
              break;
            case "gradient":
              spriteData = await generateGradientSprite(
                width,
                height,
                gradientChars.split(",").map((c) => c.trim())
              );
              break;
            case "custom":
              spriteData = customSprite.trim().split("\n").filter(Boolean);
              break;
            default:
              spriteData = undefined;
          }

          const response = await generateSpriteBitmap({
            palette: palette || {},
            width,
            height,
            spriteData,
          });
          console.log({ response }, "client");
          if (response.error) {
            throw new Error(response.error);
          }

          setResult(response);
          toast.success("NFT generated successfully!");
        } catch (err) {
          console.log(err, "err");
          const errorMessage =
            err instanceof Error ? err.message : "Failed to generate NFT";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      });
    },
  });

  const widthField = {
    name: "width",
    label: "Width",
    type: "text" as const,
    placeholder: "Enter your width",
    validators: {
      onChange: ({ value }: { value: string }) =>
        !value ? "Name is required" : undefined,
    },
  };

  const heightField = {
    name: "height",
    label: "Height",
    type: "text" as const,
    placeholder: "Enter your height",

    validators: {
      onChange: ({ value }: { value: string }) =>
        !value ? "Height is required" : undefined,
    },
  };

  const char1Field = {
    name: "char1",
    label: "Char 1",
    type: "text" as const,
    placeholder: "Enter your char 1",
  };

  const char2Field = {
    name: "char2",
    label: "Char 2",
    type: "text" as const,
    placeholder: "Enter your char 2",
  };

  const patternTypeField = {
    name: "patternType",
    label: "Pattern Type",
    type: "select" as const,
    placeholder: "Select pattern type",
    options: [
      { label: "Checkerboard", value: "checkerboard" },
      { label: "Gradient", value: "gradient" },
      { label: "Custom", value: "custom" },
      { label: "Default", value: "default" },
    ],
    validators: {
      onChange: ({ value }: { value: string }) =>
        !value ? "Pattern type is required" : undefined,
    },
  };

  const gradientCharsField = {
    name: "gradientChars",
    label: "Gradient Characters",
    type: "text" as const,
    placeholder: "Enter your gradient characters",
  };

  const customSpriteField = {
    name: "customSprite",
    label: "Custom Sprite",
    type: "text" as const,
    placeholder: "Enter your custom sprite",
  };
  const formPatternType = useStore(
    form.store,
    (state) => state.values.patternType
  );

  console.log(formPatternType, "patternType");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <div>
              <div className="grid grid-cols-2 gap-4">
                <FormField fieldConfig={widthField} form={form} />
                <FormField fieldConfig={heightField} form={form} />
              </div>
              <br />

              <div className="mt-2">
                <FormField fieldConfig={patternTypeField} form={form} />
              </div>
              <br />

              {formPatternType === "checkerboard" && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField fieldConfig={char1Field} form={form} />
                  <FormField fieldConfig={char2Field} form={form} />
                </div>
              )}

              {formPatternType === "gradient" && (
                <FormField fieldConfig={gradientCharsField} form={form} />
              )}

              {formPatternType === "custom" && (
                <FormField fieldConfig={customSpriteField} form={form} />
              )}
            </div>
            <CustomPaletteBuilder onSubmit={(e) => setPalette(e)} />

            {/* 
            <div>
              <div className="mt-2">
                <FormField fieldConfig={tagsField} form={form} />
              </div>
            </div> */}

            {/* <div>
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
            </div> */}

            <div className="flex justify-center w-fill">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={!canSubmit}
                  >
                    {isSubmitting || isPending
                      ? "Generating..."
                      : "Generate NFT"}
                  </Button>
                )}
              />
            </div>
          </form>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Result</h2>

          <div className="space-y-4">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {result && result.url && (
              <div>
                <div className="aspect-square border rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={result.url}
                    alt="Generated NFT"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    {result.message || "NFT generated successfully"}
                  </p>
                  <a
                    href={result.outputFile}
                    download="nft.bmp"
                    className="inline-block"
                  >
                    <Button variant="outline" className="w-full">
                      Download BMP
                    </Button>
                  </a>
                </div>
              </div>
            )}

            {!result && !error && (
              <div className="aspect-square flex items-center justify-center bg-muted rounded-md">
                <div className="text-center p-4">
                  <div className="mx-auto bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 dark:bg-gray-700" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Generated NFT will appear here
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-medium mb-2">How it works</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Configure your NFT parameters</li>
                <li>• Patterns are generated on the server</li>
                <li>• BMP files are created using bash scripts</li>
                <li>• Files are uploaded to Supabase storage</li>
                <li>• Generated images are displayed here</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bash;
