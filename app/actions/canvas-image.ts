import { apiFetch } from "@/apiFetch";
import path from "path";
import fs from "fs";

export interface GenerateCanvasImageRequest {
  imageType:
    | "abstract"
    | "geometric"
    | "gradient"
    | "text"
    | "noise"
    | "mandala"
    | "fractal"
    | "particle";
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
}

export interface GenerateCanvasImageResponse {
  message: string;
  url: string;
  fileName: string;
  parameters: {
    imageType: string;
    width: number;
    height: number;
    complexity: string | number; // adjust based on your actual use
    [key: string]: any; // allows additional parameters if needed
  };
  seed: string | number;
  metadata: {
    type: string;
    dimensions: string; // e.g., "800x600"
    complexity: string | number;
    generatedAt: string; // ISO timestamp
  };
}

export async function generateCanvasImage(
  request: GenerateCanvasImageRequest
): Promise<GenerateCanvasImageResponse> {
  try {
    const response = await apiFetch<GenerateCanvasImageResponse>(
      `/api/canvas-generator`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: request,
      }
    );
    console.log(response, "acton response ");

    return response as GenerateCanvasImageResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to the server");
    }

    throw new Error(
      `Unexpected error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
