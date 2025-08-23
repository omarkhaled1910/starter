"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WizardStep {
  id: string;
  title: string;
  content: React.ReactNode;
  isValid?: boolean;
}

export interface WizardProps {
  steps: WizardStep[];
  onComplete?: () => void;
  onStepChange?: (stepIndex: number) => void;
  className?: string;
  showStepNumbers?: boolean;
  allowSkip?: boolean;
  nextButtonText?: string;
  prevButtonText?: string;
  finishButtonText?: string;
}

export const Wizard: React.FC<WizardProps> = ({
  steps,
  onComplete,
  onStepChange,
  className,
  showStepNumbers = true,
  allowSkip = false,
  nextButtonText = "Next",
  prevButtonText = "Previous",
  finishButtonText = "Finish",
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
      onStepChange?.(stepIndex);
    }
  };

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const goPrevious = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const isCurrentStepValid = () => {
    const step = steps[currentStep];
    return step.isValid !== false;
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Step Progress Indicator */}
      <div className="flex items-center justify-center mb-8 px-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                  index < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : index === currentStep
                    ? "bg-primary border-primary text-primary-foreground shadow-lg"
                    : "bg-background border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : showStepNumbers ? (
                  <span className="text-sm font-medium">{index + 1}</span>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-xs font-medium transition-colors duration-200",
                    index <= currentStep
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors duration-200",
                  index < currentStep ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-center">
            {steps[currentStep]?.title}
          </h3>
          <div className="min-h-[200px]">{steps[currentStep]?.content}</div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center p-4 border-t border-border bg-muted/30">
        <Button
          variant="outline"
          onClick={goPrevious}
          disabled={isFirstStep}
          className="min-w-[100px]"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {prevButtonText}
        </Button>

        <div className="flex gap-2">
          {allowSkip && !isLastStep && (
            <Button
              variant="ghost"
              onClick={goNext}
              className="text-muted-foreground"
            >
              Skip
            </Button>
          )}
          <Button
            onClick={goNext}
            disabled={!isCurrentStepValid()}
            className="min-w-[100px]"
          >
            {isLastStep ? finishButtonText : nextButtonText}
            {!isLastStep && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
