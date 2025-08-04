import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export type PaletteMap = Record<string, string>;

interface CustomPaletteBuilderProps {
  onSubmit: (palette: PaletteMap) => void;
}

const generateRandomPalette = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const CustomPaletteBuilder: React.FC<CustomPaletteBuilderProps> = ({
  onSubmit,
}) => {
  const [colors, setColors] = useState<PaletteMap>(() => {
    const initial: PaletteMap = {};
    LABELS.forEach((label) => (initial[label] = generateRandomPalette()));
    return initial;
  });

  const handleColorChange = (label: string, value: string) => {
    setColors((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleRollDice = () => {
    const newColors: PaletteMap = {};
    LABELS.forEach((label) => (newColors[label] = generateRandomPalette()));
    setColors(newColors);
  };
  useEffect(() => {
    const corrected: PaletteMap = {};

    for (const [label, hex] of Object.entries(colors)) {
      let hexValue = hex.replace("#", "");

      // If too short, pad with zeroes; if too long, trim
      if (hexValue.length < 6) {
        hexValue = hexValue.padEnd(6, "0");
      } else if (hexValue.length > 6) {
        hexValue = hexValue.slice(0, 6);
      }

      corrected[label] = `#${hexValue.toLowerCase()}`;
    }

    onSubmit(corrected);
  }, [colors]);

  return (
    <Card className="w-full max-w-2xl mx-auto p-4">
      <CardHeader>
        <CardTitle>Pick Your Palette</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-center">
            <Button
              onClick={handleRollDice}
              variant="outline"
              className="flex items-center gap-2"
              type="button"
            >
              🎲 Roll Dice
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {LABELS.map((label) => (
              <div key={label} className="flex flex-col items-center space-y-2">
                <label className="text-sm font-medium">{label}</label>
                <Input
                  type="color"
                  value={colors[label]}
                  onChange={(e) => handleColorChange(label, e.target.value)}
                  className="w-16 h-10 p-0 border"
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {colors[label]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomPaletteBuilder;
