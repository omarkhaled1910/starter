import React, {
  useState,
  ReactElement,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { WizardProps, WizardStepProps } from "./types";
import { WizardProvider } from "./WizardContext";

export const Wizard = <T, S extends string>({
  stepMapping,
  initialData = {},
  trackSteps = false,
  onStepChange,
  sharedHeader,
  ...props
}: WizardProps<T, S>): ReactElement => {
  const [data, setData] = useState<Partial<T>>(initialData);
  const steps = Object.keys(stepMapping) as S[];
  const [step, setStep] = useState<S>(steps[0]);

  const CurrentStepComponent: React.FC<WizardStepProps<T, S>> | undefined =
    stepMapping[step];

  const nextStep = useCallback((): void => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex + 1 < steps.length) {
      const nextStepId = steps[currentIndex + 1];
      setStep(nextStepId);

      if (onStepChange) {
        onStepChange(nextStepId, data, currentIndex + 1);
      }
    }
  }, [step, steps, data, onStepChange]);

  const prevStep = useCallback((): void => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex - 1 >= 0) {
      const prevStepId = steps[currentIndex - 1];
      setStep(prevStepId);

      if (onStepChange) {
        onStepChange(prevStepId, data, currentIndex - 1);
      }
    }
  }, [step, steps, data, onStepChange]);

  const toStep = useCallback(
    (stepId: S): void => {
      if (steps.includes(stepId)) {
        setStep(stepId);

        if (onStepChange) {
          onStepChange(stepId, data, steps.indexOf(stepId));
        }
      }
    },
    [steps, data, onStepChange]
  );

  const updateData = useCallback((newData: Partial<T>): void => {
    setData((prev) => ({
      ...prev,
      ...newData,
    }));
  }, []);

  const resetData = useCallback(
    (newData?: Partial<T>): void => {
      const resetToData = newData || initialData;
      setData(resetToData);
      setStep(steps[0]);

      if (onStepChange) {
        onStepChange(steps[0], resetToData, 0);
      }
    },
    [initialData, steps, onStepChange]
  );

  const contextValue = useMemo(
    () => ({
      data,
      step,
      nextStep,
      prevStep,
      toStep,
      updateData,
      resetData,
      stepIndex: steps.indexOf(step),
      trackSteps,
    }),
    [
      data,
      nextStep,
      prevStep,
      step,
      steps,
      toStep,
      updateData,
      resetData,
      trackSteps,
    ]
  );

  if (!CurrentStepComponent) {
    return <div>Step not found</div>;
  }

  return (
    <WizardProvider value={contextValue}>
      {sharedHeader && sharedHeader(steps.indexOf(step), steps.length)}
      <CurrentStepComponent
        data={data}
        updateData={updateData}
        nextStep={nextStep}
        prevStep={prevStep}
        toStep={toStep}
        step={step}
        resetData={resetData}
        stepIndex={steps.indexOf(step)}
        totalSteps={steps.length}
        trackSteps={trackSteps}
      />
    </WizardProvider>
  );
};

export * from "./types";
