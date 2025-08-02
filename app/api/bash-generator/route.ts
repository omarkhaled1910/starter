import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import path from "path";
import { uploadBMPToSupabase } from "@/app/actions/uploader";

interface RequestBody {
  palette: Record<string, string>; // { 'A': '#FF0000', 'B': '#00FF00' }
  width: number;
  height: number;
  spriteData?: string[]; // Array of strings representing sprite rows
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    console.log("Received body:", body);

    // Validate required fields
    if (!body.palette || !body.width || !body.height) {
      return NextResponse.json(
        { message: "Missing required fields: palette, width, height" },
        { status: 400 }
      );
    }

    // Create a temporary palette file
    const paletteFileName = `palette_${Date.now()}.txt`;
    const paletteFilePath = path.join(process.cwd(), paletteFileName);

    // Convert palette object to file format
    const paletteContent = Object.entries(body.palette)
      .map(([char, hex]) => `${char} ${hex}`)
      .join("\n");

    writeFileSync(paletteFilePath, paletteContent);

    // Create sprite data if not provided (example pattern)
    const spriteData =
      body.spriteData || generateDefaultSprite(body.width, body.height);

    // Output filename
    const outputFileName = `sprite_${Date.now()}.bmp`;
    const outputFilePath = path.join(process.cwd(), outputFileName);

    // Execute the bash script
    const bashScriptPath = path.resolve(process.cwd(), "sprite-to-bmp.sh");
    const newBashPath = "/opt/homebrew/bin/bash"; // Or wherever `brew install bash` installed it

    return new Promise((resolve) => {
      const bashProcess = spawn(newBashPath || "bash", [
        bashScriptPath,
        "-p",
        paletteFilePath,
        "-o",
        outputFilePath,
      ]);

      // Send sprite data to stdin
      bashProcess.stdin.write(spriteData.join("\n"));
      bashProcess.stdin.end();

      let stdout = "";
      let stderr = "";
      let chunks: Buffer[] = [];

      bashProcess.stdout.on("data", (data) => {
        chunks.push(data);
      });

      bashProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      bashProcess.on("close", async (code) => {
        // Clean up temporary palette file
        if (existsSync(paletteFilePath)) {
          unlinkSync(paletteFilePath);
        }

        if (code === 0) {
          console.log("Bash script executed successfully:", stdout);
          const bmpBuffer = Buffer.concat(chunks);

          const url = await uploadBMPToSupabase(bmpBuffer, outputFileName);
          console.log({ url });
          resolve(
            NextResponse.json(
              {
                message: "Bitmap generated successfully",
                outputFile: outputFileName,
                stdout: stdout.trim(),
              },
              { status: 200 }
            )
          );
        } else {
          console.error("Bash script error:", stderr);
          resolve(
            NextResponse.json(
              {
                message: "Error generating bitmap",
                error: stderr,
                code: code,
              },
              { status: 500 }
            )
          );
        }
      });

      bashProcess.on("error", (error) => {
        console.error("Failed to start bash process:", error);

        // Clean up temporary palette file
        if (existsSync(paletteFilePath)) {
          unlinkSync(paletteFilePath);
        }

        resolve(
          NextResponse.json(
            {
              message: "Failed to execute bash script",
              error: error.message,
            },
            { status: 500 }
          )
        );
      });
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "An error occurred: " + error },
      { status: 400 }
    );
  }
}

// Helper function to generate default sprite data
function generateDefaultSprite(width: number, height: number): string[] {
  const sprite: string[] = [];
  const chars = ["A", "B", "C", "D"]; // Use characters that should be in your palette

  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      // Create a simple pattern - you can modify this logic
      const charIndex = (x + y) % chars.length;
      row += chars[charIndex];
    }
    sprite.push(row);
  }

  return sprite;
}
