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

const Registration = ({}) => {
  const stepMapping: Record<
    RegistrationSteps,
    React.FC<WizardStepProps<TRegistrationDefaultValues, RegistrationSteps>>
  > = {
    // TODO: MOVE ALL TO THE TOP
    [RegistrationSteps.OTP]: PhoneOTPVerification,
    [RegistrationSteps.REGISTRATION_FORM]: RegistrationForm,
    [RegistrationSteps.CREATE_PASS]: CreatePasswordForm,
  };
  return (
    <>
      <Wizard<TRegistrationDefaultValues, RegistrationSteps>
        stepMapping={stepMapping}
        initialData={registrationDefaultValues}
        trackSteps={true}
      />
    </>
  );
};
export default Registration;
