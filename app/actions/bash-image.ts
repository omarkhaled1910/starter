"use server";
export interface PaletteMap {
  [character: string]: string; // character -> hex color (e.g., 'A' -> '#FF0000')
}

export interface GenerateBitmapRequest {
  palette: PaletteMap;
  width: number;
  height: number;
  spriteData?: string[]; // Optional sprite data, will generate default if not provided
}

export interface GenerateBitmapResponse {
  message: string;
  outputFile?: string;
  stdout?: string;
  error?: string;
  code?: number;
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode: number;
}

// // actions/generateSpriteBitmap.ts
// export class SpriteBitmapError extends Error {
//   public statusCode: number;
//   public apiError?: string;

//   constructor(message: string, statusCode: number, apiError?: string) {
//     super(message);
//     this.name = "SpriteBitmapError";
//     this.statusCode = statusCode;
//     this.apiError = apiError;
//   }
// }

export async function generateSpriteBitmap(
  request: GenerateBitmapRequest
): Promise<GenerateBitmapResponse> {
  try {
    // Validate input
    if (!request.palette || Object.keys(request.palette).length === 0) {
      throw new Error("Palette is required and cannot be empty");
    }

    if (!request.width || request.width <= 0) {
      throw new Error("Width must be a positive number");
    }

    if (!request.height || request.height <= 0) {
      throw new Error("Height must be a positive number");
    }

    // Validate hex colors in palette
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    for (const [char, color] of Object.entries(request.palette)) {
      if (!hexColorRegex.test(color)) {
        throw new Error(
          `Invalid hex color "${color}" for character "${char}". Use format #RRGGBB`
        );
      }
    }

    // Validate sprite data if provided
    if (request.spriteData) {
      if (request.spriteData.length !== request.height) {
        throw new Error(
          `Sprite data length (${request.spriteData.length}) must match height (${request.height})`
        );
      }

      for (let i = 0; i < request.spriteData.length; i++) {
        const row = request.spriteData[i];
        if (row.length !== request.width) {
          throw new Error(
            `Row ${i} length (${row.length}) must match width (${request.width})`
          );
        }

        // Check if all characters in sprite data exist in palette
        for (const char of row) {
          if (!(char in request.palette)) {
            throw new Error(
              `Character "${char}" in sprite data not found in palette`
            );
          }
        }
      }
    }

    // Make the API call
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/bash-generator`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );
    console.log(response);

    const data: GenerateBitmapResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to generate bitmap");
    }

    return data;
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

// Utility function to create a simple palette
export async function createSimplePalette(): Promise<PaletteMap> {
  return new Promise((resolve) => {
    resolve({
      A: "#FF0000", // Red
      B: "#00FF00", // Green
      C: "#0000FF", // Blue
      D: "#FFFF00", // Yellow
      E: "#FF00FF", // Magenta
      F: "#00FFFF", // Cyan
      G: "#FFFFFF", // White
      H: "#000000", // Black
    });
  });
}

// Utility function to generate checkerboard sprite data
export async function generateCheckerboardSprite(
  width: number,
  height: number,
  char1: string = "A",
  char2: string = "B"
): Promise<string[]> {
  const sprite: string[] = [];

  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      // Checkerboard pattern
      const useChar1 = (x + y) % 2 === 0;
      row += useChar1 ? char1 : char2;
    }
    sprite.push(row);
  }

  return new Promise((resolve) => {
    resolve(sprite);
  });
}

// Utility function to generate gradient sprite data
export async function generateGradientSprite(
  width: number,
  height: number,
  characters: string[]
): Promise<string[]> {
  const sprite: string[] = [];

  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      // Create gradient based on position
      const progress = x / (width - 1);
      const charIndex = Math.floor(progress * (characters.length - 1));
      row += characters[charIndex];
    }
    sprite.push(row);
  }

  return new Promise((resolve) => {
    resolve(sprite);
  });
}
