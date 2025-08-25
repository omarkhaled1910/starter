export interface WizardProps<T, S extends string> {
  stepMapping: Record<S, React.FC<WizardStepProps<T, S>>>;
  initialData?: Partial<T>;
  onStepChange?: (stepId: S, data: Partial<T>, stepIndex: number) => void;
  trackSteps?: boolean;
  sharedHeader?: (stepIndex: number, stepCount: number) => React.ReactNode;
}

export interface WizardStepProps<T, S extends string> {
  data: Partial<T>;
  updateData: (newData: Partial<T>) => void;
  resetData: (data: Partial<T>) => void;
  nextStep: () => void;
  prevStep: () => void;
  toStep: (stepId: S) => void;
  step: S;
  stepIndex: number;
  totalSteps: number;
  trackSteps?: boolean;
}
