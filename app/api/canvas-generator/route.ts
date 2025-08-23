export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { createCanvas } from "@napi-rs/canvas";
import { uploadBinaryToSupabase } from "@/app/actions/uploader";
import type {
  CanvasRenderingContext2D,
  GlobalCompositeOperation,
} from "@napi-rs/canvas";
import fs from "fs";
import path from "path";
import { writeImage } from "@/lib/serverUtils";
// Optional: If you want to use additional creative packages
// import SimplexNoise from 'simplex-noise';
// import { Delaunay } from 'd3-delaunay';
// import chroma from 'chroma-js';

export interface CreativeImageParams {
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
  noiseLevel: number;
  borderRadius: number;
  rotation: number;
  // New advanced parameters
  seed?: number;
  colorPalette?: string[];
  blendMode?: GlobalCompositeOperation;
  particleSystem?: boolean;
  fractals?: boolean;
  voronoi?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: CreativeImageParams = await req.json();
    console.log(
      "Received creative generation request:",
      body,
      !body.imageType || !body.width || !body.height,
      body.imageType,
      body.width,
      body.height
    );

    // Validate required fields
    if (!body.imageType || !body.width || !body.height) {
      return NextResponse.json(
        { error: "Missing required fields: imageType, width, height" },
        { status: 400 }
      );
    }

    // Validate dimensions
    if (
      body.width > 4096 ||
      body.height > 4096 ||
      body.width < 32 ||
      body.height < 32
    ) {
      return NextResponse.json(
        { error: "Width and height must be between 32 and 4096 pixels" },
        { status: 400 }
      );
    }

    // Create canvas with better quality settings
    const canvas = createCanvas(body.width, body.height);
    const ctx = canvas.getContext("2d");

    // Set quality settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Apply background
    applyBackground(ctx, body);

    // Generate seed for reproducible randomness
    const seed = body.seed || Math.floor(Math.random() * 1000000);
    const random = createSeededRandom(seed);

    // Generate image based on type
    switch (body.imageType) {
      case "abstract":
        generateAdvancedAbstractArt(ctx, body, random);
        break;
      case "geometric":
        generateAdvancedGeometric(ctx, body, random);
        break;
      case "gradient":
        generateAdvancedGradient(ctx, body, random);
        break;
      case "text":
        generateAdvancedTextArt(ctx, body, random);
        break;
      case "noise":
        generateAdvancedNoiseArt(ctx, body, random);
        break;
      case "mandala":
        generateAdvancedMandala(ctx, body, random);
        break;
      case "fractal":
        generateFractalArt(ctx, body, random);
        break;
      case "particle":
        generateParticleSystem(ctx, body, random);
        break;
      default:
        generateAdvancedAbstractArt(ctx, body, random);
    }

    // Apply post-processing effects
    applyPostProcessing(ctx, body);

    // Add text overlay if provided
    if (body.text && body.imageType !== "text") {
      addAdvancedTextOverlay(ctx, body);
    }

    // Apply border radius if specified
    if (body.borderRadius > 0) {
      applyBorderRadius(ctx, body);
    }

    // Convert canvas to buffer
    const buffer = canvas.toBuffer("image/jpeg", 100);

    // Generate unique filename
    const fileName = `creative_nft_${body.imageType}_${Date.now()}.png`;

    // Optionally write image to local server disk
    // fs.writeFileSync(filePath, buffer);
    writeImage(fileName, buffer);
    // Upload to Supabase
    const url = await uploadBinaryToSupabase(buffer, fileName);

    // if (!url) {
    //   throw new Error("Failed to upload image");
    // }
    console.log("fileName", {
      message: "Creative NFT generated successfully",
      url: url || "",
      fileName,
      parameters: body,
      seed,
      metadata: {
        type: body.imageType,
        dimensions: `${body.width}x${body.height}`,
        complexity: body.complexity,
        generatedAt: new Date().toISOString(),
      },
    });
    return NextResponse.json({
      message: "Creative NFT generated successfully",
      url: url || "",
      fileName,
      parameters: body,
      seed,
      metadata: {
        type: body.imageType,
        dimensions: `${body.width}x${body.height}`,
        complexity: body.complexity,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Creative generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate creative NFT: " + (error as Error).message },
      { status: 500 }
    );
  }
}

// Seeded random number generator for reproducible results
function createSeededRandom(seed: number) {
  let currentSeed = seed;
  return function () {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
}

// Enhanced background application
function applyBackground(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams
) {
  const { width, height, backgroundColor, gradientStart, gradientEnd } = params;

  if (params.imageType === "gradient" || params.pattern === "gradient-bg") {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, gradientStart || backgroundColor);
    gradient.addColorStop(1, gradientEnd || backgroundColor);
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = backgroundColor;
  }

  ctx.fillRect(0, 0, width, height);
}

// Advanced Abstract Art with improved algorithms
function generateAdvancedAbstractArt(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  const { width, height, shapes, complexity, colorPalette } = params;

  // Use color palette if provided, otherwise generate colors
  const colors = colorPalette || generateColorPalette(params, 8);

  // Create flowing abstract shapes
  for (let i = 0; i < shapes; i++) {
    const color = colors[Math.floor(random() * colors.length)];
    ctx.fillStyle = color + "80"; // Add transparency
    ctx.strokeStyle = color;
    ctx.lineWidth = 1 + random() * 3;

    // Create organic blob shapes
    const centerX = random() * width;
    const centerY = random() * height;
    const size = 30 + random() * (80 + complexity * 20);

    drawOrganicBlob(ctx, centerX, centerY, size, random, complexity);
  }

  // Add some connecting lines for flow
  if (complexity > 5) {
    addFlowLines(ctx, params, random, colors);
  }
}

// Advanced Geometric with sacred geometry patterns
function generateAdvancedGeometric(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  const { width, height, pattern, complexity, foregroundColor } = params;

  ctx.strokeStyle = foregroundColor;
  ctx.lineWidth = 2;

  switch (pattern) {
    case "sacred":
      generateSacredGeometry(ctx, params, random);
      break;
    case "islamic":
      generateIslamicPattern(ctx, params, random);
      break;
    case "tessellation":
      generateTessellation(ctx, params, random);
      break;
    default:
      generateGeometricGrid(ctx, params, random);
  }
}

// Fractal Art Generator
function generateFractalArt(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  const { width, height, complexity } = params;

  // Julia Set inspired pattern
  const iterations = 50 + complexity * 10;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const cx = -0.7 + random() * 0.2;
  const cy = 0.27 + random() * 0.1;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const zx = (x - width / 2) / (width / 4);
      const zy = (y - height / 2) / (height / 4);

      let iter = 0;
      let zx2 = zx,
        zy2 = zy;

      while (iter < iterations && zx2 * zx2 + zy2 * zy2 < 4) {
        const tmp = zx2 * zx2 - zy2 * zy2 + cx;
        zy2 = 2 * zx2 * zy2 + cy;
        zx2 = tmp;
        iter++;
      }

      const pixelIndex = (y * width + x) * 4;
      if (iter === iterations) {
        data[pixelIndex] = 0; // R
        data[pixelIndex + 1] = 0; // G
        data[pixelIndex + 2] = 0; // B
      } else {
        const hue = (iter / iterations) * 360;
        const [r, g, b] = hslToRgb(hue, 80, 50);
        data[pixelIndex] = r; // R
        data[pixelIndex + 1] = g; // G
        data[pixelIndex + 2] = b; // B
      }
      data[pixelIndex + 3] = 255; // A
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// Particle System Generator
function generateParticleSystem(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  const { width, height, shapes, complexity } = params;
  const particles = shapes * 5;

  // Generate particle field
  for (let i = 0; i < particles; i++) {
    const x = random() * width;
    const y = random() * height;
    const size = 1 + random() * 4;
    const alpha = 0.1 + random() * 0.5;

    const hue = (i / particles) * 360 + random() * 60;
    ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    // Connect nearby particles
    if (complexity > 3) {
      connectNearbyParticles(ctx, x, y, particles, random, width, height, i);
    }
  }
}

// Advanced Noise Art with Perlin-like noise
function generateAdvancedNoiseArt(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  const { width, height, noiseLevel } = params;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Generate noise field
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const noise = generatePerlinNoise(x / 100, y / 100, random) * noiseLevel;
      const pixelIndex = (y * width + x) * 4;

      const value = Math.floor((noise + 1) * 127.5); // Normalize to 0-255

      data[pixelIndex] = value; // R
      data[pixelIndex + 1] = value; // G
      data[pixelIndex + 2] = value; // B
      data[pixelIndex + 3] = 255; // A
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Add color overlay
  ctx.globalCompositeOperation = "multiply";
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, params.gradientStart);
  gradient.addColorStop(1, params.gradientEnd);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";
}

// Enhanced Mandala with more intricate patterns
function generateAdvancedMandala(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  const { width, height, complexity } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 20;

  ctx.save();
  ctx.translate(centerX, centerY);

  // Generate multiple layers with different patterns
  const layers = 4 + complexity;

  for (let layer = 0; layer < layers; layer++) {
    const radius = (maxRadius * (layers - layer)) / layers;
    const elements = 6 + layer * 3;
    const layerHue = (layer * 60) % 360;

    ctx.strokeStyle = `hsl(${layerHue}, 70%, 50%)`;
    ctx.fillStyle = `hsla(${layerHue}, 70%, 60%, 0.2)`;
    ctx.lineWidth = 2 - layer * 0.2;

    for (let i = 0; i < elements; i++) {
      const angle = (i * 2 * Math.PI) / elements;

      ctx.save();
      ctx.rotate(angle);

      // Different pattern for each layer
      switch (layer % 3) {
        case 0:
          drawMandalaFlower(ctx, radius, layer);
          break;
        case 1:
          drawMandalaGeometric(ctx, radius, layer);
          break;
        case 2:
          drawMandalaSpiral(ctx, radius, layer, random);
          break;
      }

      ctx.restore();
    }
  }

  ctx.restore();
}

// Enhanced Gradient with multiple techniques
function generateAdvancedGradient(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  const { width, height, gradientStart, gradientEnd, pattern } = params;

  switch (pattern) {
    case "conic":
      generateConicGradient(ctx, params);
      break;
    case "multi-stop":
      generateMultiStopGradient(ctx, params, random);
      break;
    case "mesh":
      generateMeshGradient(ctx, params, random);
      break;
    default:
      generateRadialGradient(ctx, params);
  }
}

// Enhanced Text Art with effects
function generateAdvancedTextArt(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  const { width, height, text, fontSize, textColor } = params;

  if (!text) return;

  // Apply text effects
  ctx.save();

  // Text outline
  ctx.strokeStyle = textColor;
  ctx.fillStyle = "transparent";
  ctx.lineWidth = 2;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Multiple text layers for depth
  const layers = 3;
  for (let i = 0; i < layers; i++) {
    ctx.save();
    ctx.translate(width / 2 + i, height / 2 + i);
    ctx.globalAlpha = 0.3 - i * 0.1;
    ctx.strokeText(text, 0, 0);
    ctx.restore();
  }

  // Main text
  ctx.fillStyle = textColor;
  ctx.globalAlpha = 1;
  ctx.fillText(text, width / 2, height / 2);

  ctx.restore();
}

// Utility Functions

function generateColorPalette(
  params: CreativeImageParams,
  count: number
): string[] {
  const colors = [];
  const baseHue = Math.random() * 360;

  for (let i = 0; i < count; i++) {
    const hue = (baseHue + i * 45) % 360;
    const saturation = 60 + Math.random() * 30;
    const lightness = 40 + Math.random() * 40;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
}

function drawOrganicBlob(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  random: () => number,
  complexity: number
) {
  const points = 6 + complexity;
  ctx.beginPath();

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const radius = size * (0.7 + random() * 0.6);
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      const cpx = x + Math.cos(angle - Math.PI / points) * radius * 0.5;
      const cpy = y + Math.sin(angle - Math.PI / points) * radius * 0.5;
      ctx.quadraticCurveTo(cpx, cpy, px, py);
    }
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function addFlowLines(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number,
  colors: string[]
) {
  const { width, height, complexity } = params;
  const lines = complexity * 2;

  for (let i = 0; i < lines; i++) {
    ctx.strokeStyle = colors[Math.floor(random() * colors.length)] + "40";
    ctx.lineWidth = 1 + random() * 2;

    ctx.beginPath();
    const startX = random() * width;
    const startY = random() * height;
    ctx.moveTo(startX, startY);

    const points = 3 + Math.floor(random() * 5);
    for (let j = 1; j <= points; j++) {
      const x = random() * width;
      const y = random() * height;
      const cpx = random() * width;
      const cpy = random() * height;
      ctx.quadraticCurveTo(cpx, cpy, x, y);
    }

    ctx.stroke();
  }
}

// Simplified Perlin noise implementation
function generatePerlinNoise(
  x: number,
  y: number,
  random: () => number
): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;

  const g1 = random() * 2 - 1;
  const g2 = random() * 2 - 1;
  const g3 = random() * 2 - 1;
  const g4 = random() * 2 - 1;

  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  const n1 = g1 * xf + g1 * yf;
  const n2 = g2 * (xf - 1) + g2 * yf;
  const n3 = g3 * xf + g3 * (yf - 1);
  const n4 = g4 * (xf - 1) + g4 * (yf - 1);

  const u = fade(xf);
  const v = fade(yf);

  const nx1 = lerp(n1, n2, u);
  const nx2 = lerp(n3, n4, u);

  return lerp(nx1, nx2, v);
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (1 / 6 <= h && h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (2 / 6 <= h && h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (3 / 6 <= h && h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (4 / 6 <= h && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else if (5 / 6 <= h && h < 1) {
    r = c;
    g = 0;
    b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

// Placeholder implementations for advanced patterns
function generateSacredGeometry(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  // Flower of Life pattern implementation
  const { width, height } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 8;

  // Draw overlapping circles
  const positions = [
    [0, 0],
    [radius, 0],
    [-radius, 0],
    [radius / 2, radius * 0.866],
    [-radius / 2, radius * 0.866],
    [radius / 2, -radius * 0.866],
    [-radius / 2, -radius * 0.866],
  ];

  positions.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(centerX + x, centerY + y, radius, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function generateIslamicPattern(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  // Islamic geometric pattern placeholder
  generateGeometricGrid(ctx, params, random);
}

function generateTessellation(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  // Tessellation pattern placeholder
  generateGeometricGrid(ctx, params, random);
}

function generateGeometricGrid(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  const { width, height, complexity } = params;
  const spacing = Math.max(20, 60 - complexity * 5);

  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      const size = spacing * 0.4;
      const sides = 3 + Math.floor(random() * 5);

      ctx.save();
      ctx.translate(x + spacing / 2, y + spacing / 2);
      ctx.rotate(random() * Math.PI * 2);

      drawRegularPolygon(ctx, 0, 0, size, sides);
      ctx.stroke();

      ctx.restore();
    }
  }
}

function drawRegularPolygon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  sides: number
) {
  const angle = (2 * Math.PI) / sides;

  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const px = x + radius * Math.cos(i * angle - Math.PI / 2);
    const py = y + radius * Math.sin(i * angle - Math.PI / 2);

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
}

// More placeholder implementations
function connectNearbyParticles(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  particles: number,
  random: () => number,
  width: number,
  height: number,
  index: number
) {
  // Connect to nearby particles
}

function generateConicGradient(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams
) {
  // Conic gradient implementation
}

function generateMultiStopGradient(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  // Multi-stop gradient implementation
}

function generateMeshGradient(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams,
  random: () => number
) {
  // Mesh gradient implementation
}

function generateRadialGradient(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams
) {
  // Radial gradient implementation
}

function drawMandalaFlower(
  ctx: CanvasRenderingContext2D,
  radius: number,
  layer: number
) {
  // Mandala flower pattern
}

function drawMandalaGeometric(
  ctx: CanvasRenderingContext2D,
  radius: number,
  layer: number
) {
  // Mandala geometric pattern
}

function drawMandalaSpiral(
  ctx: CanvasRenderingContext2D,
  radius: number,
  layer: number,
  random: () => number
) {
  // Mandala spiral pattern
}

function applyPostProcessing(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams
) {
  //   Post-processing effects
  if (params.blendMode) {
    ctx.globalCompositeOperation = params.blendMode as GlobalCompositeOperation;
  }
}

function addAdvancedTextOverlay(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams
) {
  // Advanced text overlay
  if (!params.text) return;

  ctx.fillStyle = params.textColor;
  ctx.font = `${params.fontSize}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(params.text, params.width / 2, params.height / 2);
}

function applyBorderRadius(
  ctx: CanvasRenderingContext2D,
  params: CreativeImageParams
) {
  // Apply border radius by masking
  const { width, height, borderRadius } = params;
  if (!Number(borderRadius)) return;
  console.log("borderRadius", borderRadius, typeof borderRadius);
  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, Number(borderRadius));
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}
