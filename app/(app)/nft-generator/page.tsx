"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createSimplePalette,
  generateCheckerboardSprite,
  generateGradientSprite,
  generateSpriteBitmap,
} from "@/app/actions/bash-image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowBigLeft } from "lucide-react";

export default function NFTGenerator() {
  const router = useRouter();
  const [width, setWidth] = useState(16);
  const [height, setHeight] = useState(16);
  const [patternType, setPatternType] = useState("checkerboard");
  const [char1, setChar1] = useState("A");
  const [char2, setChar2] = useState("B");
  const [gradientChars, setGradientChars] = useState("A,B,C,D,E");
  const [customSprite, setCustomSprite] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = async () => {
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const palette = await createSimplePalette();
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
          palette,
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
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowBigLeft />
          </Button>
          <h1 className="text-2xl font-bold">NFT Generator</h1>
        </div>
        <div className="flex gap-2"></div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min={1}
                  max={128}
                />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min={1}
                  max={128}
                />
              </div>
            </div>

            <div>
              <Label>Pattern Type</Label>
              <Select value={patternType} onValueChange={setPatternType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkerboard">Checkerboard</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="default">
                    Default (Server-generated)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {patternType === "checkerboard" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="char1">Character 1</Label>
                  <Input
                    id="char1"
                    value={char1}
                    onChange={(e) => setChar1(e.target.value)}
                    maxLength={1}
                  />
                </div>
                <div>
                  <Label htmlFor="char2">Character 2</Label>
                  <Input
                    id="char2"
                    value={char2}
                    onChange={(e) => setChar2(e.target.value)}
                    maxLength={1}
                  />
                </div>
              </div>
            )}

            {patternType === "gradient" && (
              <div>
                <Label htmlFor="gradientChars">Gradient Characters</Label>
                <Input
                  id="gradientChars"
                  value={gradientChars}
                  onChange={(e) => setGradientChars(e.target.value)}
                  placeholder="Comma separated (e.g., A,B,C,D,E)"
                />
              </div>
            )}

            {patternType === "custom" && (
              <div>
                <Label htmlFor="customSprite">Sprite Data</Label>
                <Textarea
                  id="customSprite"
                  value={customSprite}
                  onChange={(e) => setCustomSprite(e.target.value)}
                  rows={5}
                  placeholder={`Enter sprite data (one row per line)\nExample for 2x2:\nAB\nBA`}
                />
              </div>
            )}

            <Button
              className="w-full mt-4"
              onClick={handleGenerate}
              disabled={isPending}
            >
              {isPending ? "Generating..." : "Generate NFT"}
            </Button>
          </div>
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
}
