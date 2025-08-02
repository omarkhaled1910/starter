import {
  createSimplePalette,
  generateCheckerboardSprite,
  generateGradientSprite,
} from "@/app/actions/bash-image";
import { generateSpriteBitmap } from "@/app/actions/bash-image";

export default async function exampleUsage() {
  const palette1 = await createSimplePalette();
  const spriteData1 = await generateCheckerboardSprite(16, 16, "A", "B");
  console.log(palette1, spriteData1);
  try {
    // Example 1: Simple checkerboard
    const palette1 = await createSimplePalette();
    const spriteData1 = await generateCheckerboardSprite(16, 16, "A", "B");

    const result1 = await generateSpriteBitmap({
      palette: palette1,
      width: 16,
      height: 16,
      spriteData: spriteData1,
    });

    console.log("Checkerboard result:", result1);

    // Example 2: Gradient
    const palette2 = await {
      A: "#000000", // Black
      B: "#404040", // Dark gray
      C: "#808080", // Gray
      D: "#C0C0C0", // Light gray
      E: "#FFFFFF", // White
    };

    const spriteData2 = await generateGradientSprite(20, 10, [
      "A",
      "B",
      "C",
      "D",
      "E",
    ]);

    const result2 = await generateSpriteBitmap({
      palette: palette2,
      width: 20,
      height: 10,
      spriteData: spriteData2,
    });

    console.log("Gradient result:", result2);

    // Example 3: Let the server generate default sprite
    const result3 = await generateSpriteBitmap({
      palette: await createSimplePalette(),
      width: 8,
      height: 8,
      // No spriteData - server will generate default
    });

    console.log("Default sprite result:", result3);

    return <div>Hello</div>;
  } catch (error) {
    console.error(error);
  }
}
