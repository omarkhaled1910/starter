"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowBigLeft } from "lucide-react";
import FormField from "@/components/form/FormField";
import { useForm, useStore } from "@tanstack/react-form";
import {
  generateCanvasImage,
  GenerateCanvasImageResponse,
} from "@/app/actions/canvas-image";
import MintButton from "./MintButton";

interface CreativeImageParams {
  imageType: string;
  width: number;
  height: number;
  backgroundColor: string;
  foregroundColor: string;
  shapes: number;
  complexity: number;
  pattern: string;
  text: string;
  fontSize: number;
  textColor: string;
  gradientStart: string;
  gradientEnd: string;
  noiseLevel: number;
  borderRadius: number;
  rotation: number;
}

const Creative = () => {
  const router = useRouter();
  const [result, setResult] = useState<GenerateCanvasImageResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      imageType: "abstract",
      width: 512,
      height: 512,
      backgroundColor: "#1a1a2e",
      foregroundColor: "#16213e",
      shapes: 10,
      complexity: 5,
      pattern: "geometric",
      text: "",
      fontSize: 32,
      textColor: "#ffffff",
      gradientStart: "#667eea",
      gradientEnd: "#764ba2",
      noiseLevel: 0.1,
      borderRadius: 10,
      rotation: 0,
    },
    onSubmit: async ({ value }) => {
      console.log(value);

      startTransition(async () => {
        try {
          // const response = await fetch("/api/generate-creative", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify(value),
          // });
          const data = await generateCanvasImage({
            shapes: value.shapes,
            complexity: value.complexity,
            pattern: value.pattern,
            text: value.text,
            fontSize: value.fontSize,
            textColor: value.textColor,
            gradientStart: value.gradientStart,
            gradientEnd: value.gradientEnd,
            imageType: value.imageType as any,
            width: value.width,
            height: value.height,
            backgroundColor: value.backgroundColor,
            foregroundColor: value.foregroundColor,
            noiseLevel: value.noiseLevel,
            borderRadius: value.borderRadius,
            rotation: value.rotation,
          });

          console.log(data, "client");
          if (data) {
            setResult(data);
            toast.success("Creative NFT generated successfully!");
          } else {
            toast.error("Failed to generate NFT");
          }
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

  // Form field configurations
  const imageTypeField = {
    name: "imageType",
    label: "Image Type",
    type: "select" as const,
    placeholder: "Select image type",
    options: [
      { label: "Abstract Art", value: "abstract" },
      { label: "Geometric Patterns", value: "geometric" },
      { label: "Gradient Art", value: "gradient" },
      { label: "Text Art", value: "text" },
      { label: "Noise Art", value: "noise" },
      { label: "Mandala", value: "mandala" },
    ],
    validators: {
      onChange: ({ value }: { value: string }) =>
        !value ? "Image type is required" : undefined,
    },
  };

  const widthField = {
    name: "width",
    label: "Width",
    type: "number" as const,
    placeholder: "Enter width (px)",
    validators: {
      onChange: ({ value }: { value: number }) =>
        !value || value < 100 || value > 2048
          ? "Width must be between 100-2048px"
          : undefined,
    },
  };

  const heightField = {
    name: "height",
    label: "Height",
    type: "number" as const,
    placeholder: "Enter height (px)",
    validators: {
      onChange: ({ value }: { value: number }) =>
        !value || value < 100 || value > 2048
          ? "Height must be between 100-2048px"
          : undefined,
    },
  };

  const backgroundColorField = {
    name: "backgroundColor",
    label: "Background Color",
    type: "color" as const,
    placeholder: "#1a1a2e",
  };

  const foregroundColorField = {
    name: "foregroundColor",
    label: "Foreground Color",
    type: "color" as const,
    placeholder: "#16213e",
  };

  const shapesField = {
    name: "shapes",
    label: "Number of Shapes",
    type: "number" as const,
    placeholder: "Enter number of shapes",
  };

  const complexityField = {
    name: "complexity",
    label: "Complexity Level (1-10)",
    type: "number" as const,
    placeholder: "Enter complexity level",
  };

  const patternField = {
    name: "pattern",
    label: "Pattern Style",
    type: "select" as const,
    placeholder: "Select pattern",
    options: [
      { label: "Geometric", value: "geometric" },
      { label: "Organic", value: "organic" },
      { label: "Linear", value: "linear" },
      { label: "Radial", value: "radial" },
      { label: "Grid", value: "grid" },
    ],
  };

  const textField = {
    name: "text",
    label: "Text (optional)",
    type: "text" as const,
    placeholder: "Enter text to include",
  };

  const fontSizeField = {
    name: "fontSize",
    label: "Font Size",
    type: "number" as const,
    placeholder: "Enter font size",
  };

  const textColorField = {
    name: "textColor",
    label: "Text Color",
    type: "color" as const,
    placeholder: "#ffffff",
  };

  const gradientStartField = {
    name: "gradientStart",
    label: "Gradient Start",
    type: "color" as const,
    placeholder: "#667eea",
  };

  const gradientEndField = {
    name: "gradientEnd",
    label: "Gradient End",
    type: "color" as const,
    placeholder: "#764ba2",
  };

  const noiseLevelField = {
    name: "noiseLevel",
    label: "Noise Level (0-1)",
    type: "number" as const,
    placeholder: "Enter noise level",
    step: 0.1,
    min: 0,
    max: 1,
  };

  const borderRadiusField = {
    name: "borderRadius",
    label: "Border Radius",
    type: "number" as const,
    placeholder: "Enter border radius",
  };

  const rotationField = {
    name: "rotation",
    label: "Rotation (degrees)",
    type: "number" as const,
    placeholder: "Enter rotation angle",
  };

  const formImageType = useStore(form.store, (state) => state.values.imageType);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <MintButton url={result?.url || ""} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">
            Creative NFT Configuration
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {/* Basic Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Settings</h3>

              <FormField fieldConfig={imageTypeField} form={form} />

              <div className="grid grid-cols-2 gap-4">
                <FormField fieldConfig={widthField} form={form} />
                <FormField fieldConfig={heightField} form={form} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField fieldConfig={backgroundColorField} form={form} />
                <FormField fieldConfig={foregroundColorField} form={form} />
              </div>
            </div>

            {/* Pattern Settings */}
            {(formImageType === "abstract" ||
              formImageType === "geometric") && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pattern Settings</h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField fieldConfig={shapesField} form={form} />
                  <FormField fieldConfig={complexityField} form={form} />
                </div>

                <FormField fieldConfig={patternField} form={form} />
                <FormField fieldConfig={rotationField} form={form} />
              </div>
            )}

            {/* Gradient Settings */}
            {formImageType === "gradient" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Gradient Settings</h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField fieldConfig={gradientStartField} form={form} />
                  <FormField fieldConfig={gradientEndField} form={form} />
                </div>
              </div>
            )}

            {/* Text Settings */}
            {formImageType === "text" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Text Settings</h3>

                <FormField fieldConfig={textField} form={form} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField fieldConfig={fontSizeField} form={form} />
                  {/* <FormField fieldConfig={textColorField} form={form} /> */}
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Advanced Settings</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField fieldConfig={noiseLevelField} form={form} />
                <FormField fieldConfig={borderRadiusField} form={form} />
              </div>
            </div>

            {/* Text for all types */}
            {formImageType !== "text" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Optional Text Overlay</h3>
                <FormField fieldConfig={textField} form={form} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField fieldConfig={fontSizeField} form={form} />
                  <FormField fieldConfig={textColorField} form={form} />
                </div>
              </div>
            )}

            <div className="flex justify-center w-full">
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
                      : "Generate Creative NFT"}
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
                    alt="Generated Creative NFT"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    {result.message || "Creative NFT generated successfully"}
                  </p>
                  <a
                    href={result.url}
                    download="creative-nft.png"
                    className="inline-block"
                  >
                    <Button variant="outline" className="w-full">
                      Download PNG
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
                    Generated creative NFT will appear here
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-medium mb-2">How it works</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Configure your creative NFT parameters</li>
                <li>• Images are generated using Canvas API</li>
                <li>• Multiple artistic styles available</li>
                <li>• Real-time generation on the server</li>
                <li>• High-quality PNG output</li>
                <li>• Instant download and preview</li>
              </ul>
            </div>

            {/* Live Preview Hint */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 Tip: Experiment with different combinations for unique
                results!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Creative;
