"use client";
import React from "react";
import {
  RegistrationSteps,
  TRegistrationDefaultValues,
  registrationDefaultValues,
} from "./constants";

import { Wizard, WizardStepProps } from "@/components/custom/Wizard";
import {
  RegistrationForm,
  CreatePasswordForm,
  PhoneOTPVerification,
} from "./components";
import { StepProgress } from "@/components/custom/Steps";

const Registration = ({}) => {
  const stepMapping: Record<
    RegistrationSteps,
    React.FC<WizardStepProps<TRegistrationDefaultValues, RegistrationSteps>>
  > = {
    // TODO: MOVE ALL TO THE TOP
    [RegistrationSteps.REGISTRATION_FORM]: RegistrationForm,
    [RegistrationSteps.CREATE_PASS]: CreatePasswordForm,
    [RegistrationSteps.OTP]: PhoneOTPVerification,
  };
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="flex justify-center mb-8">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="h-10 w-auto"
        />
      </div>{" "}
      <Wizard<TRegistrationDefaultValues, RegistrationSteps>
        stepMapping={stepMapping}
        initialData={registrationDefaultValues}
        trackSteps={true}
        sharedHeader={(stepIndex, stepCount) => (
          <StepProgress stepIndex={stepIndex} stepCount={stepCount} />
        )}
      />
    </div>
  );
};
export default Registration;
