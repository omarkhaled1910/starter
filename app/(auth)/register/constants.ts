export enum RegistrationSteps {
  REGISTRATION_FORM = "REGISTRATION_FORM",
  CREATE_PASS = "CREATE_PASS",
  OTP = "OTP",
}

export type TRegistrationDefaultValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  otp: string;
};

export const registrationDefaultValues: TRegistrationDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  otp: "",
};
