"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface SelectableCardOption {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectableCardProps {
  options: SelectableCardOption[];
  selectedValue?: string;
  onChange: (value: string) => void;
  className?: string;
  cardClassName?: string;
  multiple?: boolean;
  selectedValues?: string[];
  onMultipleChange?: (values: string[]) => void;
  layout?: "grid" | "list";
  columns?: 1 | 2 | 3 | 4;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  options,
  selectedValue,
  onChange,
  className,
  cardClassName,
  multiple = false,
  selectedValues = [],
  onMultipleChange,
  layout = "grid",
  columns = 2,
}) => {
  const handleSelect = (optionId: string) => {
    if (multiple && onMultipleChange) {
      const isSelected = selectedValues.includes(optionId);
      if (isSelected) {
        onMultipleChange(selectedValues.filter((id) => id !== optionId));
      } else {
        onMultipleChange([...selectedValues, optionId]);
      }
    } else {
      onChange(optionId);
    }
  };

  const isSelected = (optionId: string) => {
    if (multiple) {
      return selectedValues.includes(optionId);
    }
    return selectedValue === optionId;
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn(
        layout === "grid"
          ? `grid gap-4 ${gridCols[columns]}`
          : "flex flex-col gap-3",
        className
      )}
    >
      {options.map((option) => {
        const selected = isSelected(option.id);
        const disabled = option.disabled;

        return (
          <div
            key={option.id}
            onClick={() => !disabled && handleSelect(option.id)}
            className={cn(
              "relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              selected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-background hover:border-muted-foreground/30",
              disabled && "cursor-not-allowed opacity-50",
              cardClassName
            )}
            tabIndex={disabled ? -1 : 0}
            role="button"
            aria-pressed={selected}
            aria-disabled={disabled}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !disabled) {
                e.preventDefault();
                handleSelect(option.id);
              }
            }}
          >
            {/* Selection Indicator */}
            {selected && (
              <div className="absolute right-3 top-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              {/* Image or Icon */}
              <div className="flex-shrink-0">
                {option.imageUrl ? (
                  <img
                    src={option.imageUrl}
                    alt={option.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : option.icon ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    {option.icon}
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-medium text-sm leading-snug",
                    selected ? "text-foreground" : "text-foreground",
                    disabled && "text-muted-foreground"
                  )}
                >
                  {option.name}
                </h3>
                <p
                  className={cn(
                    "mt-1 text-xs leading-relaxed",
                    selected
                      ? "text-muted-foreground"
                      : "text-muted-foreground",
                    disabled && "text-muted-foreground/70"
                  )}
                >
                  {option.description}
                </p>
              </div>
            </div>

            {/* Hover overlay */}
            <div
              className={cn(
                "absolute inset-0 rounded-lg transition-colors duration-200",
                selected ? "bg-primary/5" : "bg-transparent hover:bg-muted/30",
                disabled && "bg-transparent"
              )}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SelectableCard;
