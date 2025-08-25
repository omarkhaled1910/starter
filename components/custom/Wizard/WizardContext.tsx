import React, { createContext, useContext } from "react";
interface WizardContextType<T, S extends string> {
  data: Partial<T>;
  step: S;
  nextStep: () => void;
  prevStep: () => void;
  toStep: (stepId: S) => void;
  resetData: (data?: Partial<T>) => void;
  updateData: (newData: Partial<T>) => void;
  stepIndex: number;
}
const WizardContext = createContext<WizardContextType<any, any> | undefined>(
  undefined
);
export const useWizardContext = <T, S extends string>(): WizardContextType<
  T,
  S
> => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizardContext must be used within a Wizard component");
  }
  return context;
};
export const WizardProvider = <T, S extends string>({
  value,
  children,
  ...props
}: {
  value?: WizardContextType<T, S>;
  children: React.ReactNode;
}) => {
  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
};
