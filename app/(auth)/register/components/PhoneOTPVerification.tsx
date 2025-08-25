"use client";
import React from "react";
import { useForm } from "@tanstack/react-form";
import FormField from "@/components/form/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WizardStepProps } from "@/components/custom/Wizard/types";
import { TRegistrationDefaultValues, RegistrationSteps } from "../constants";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

const PhoneOTPVerification: React.FC<
  WizardStepProps<TRegistrationDefaultValues, RegistrationSteps>
> = ({ data, updateData, prevStep }) => {
  const form = useForm({
    defaultValues: {
      otp: data.otp || "",
    },
    onSubmit: async ({ value }) => {
      updateData(value);
      // Here you would typically submit the complete registration data
      // For now, we'll just show a success message
      toast.success("Registration completed successfully!");
    },
  });

  const otpField = {
    name: "otp",
    label: "Verification Code2",
    type: "otp" as const,
    placeholder: "Enter 6-digit code",
    validators: {
      onChange: ({ value }: { value: string }) =>
        !value
          ? "Verification code is required"
          : !/^\d{6}$/.test(value)
          ? "Please enter a valid 6-digit code"
          : undefined,
    },
    className: "flex items-center flex-col justify-center w-full",
  };

  const handleResendOTP = () => {
    // Here you would implement the resend OTP logic
    toast.success(`Verification code sent to ${data.phoneNumber}`);
  };
  const t = useTranslations("HomePage");

  return (
    <Card className="border-border bg-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-card-foreground">
          {t("title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          We've sent a 6-digit verification code to{" "}
          <span className="font-medium text-card-foreground">
            {data.phoneNumber}
          </span>
        </p>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div>
            <FormField fieldConfig={otpField} form={form} />
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendOTP}
              className="text-primary hover:text-primary/80"
            >
              Resend verification code
            </Button>
          </div>

          <div className="flex gap-4 w-full flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="w-full"
            >
              Back
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  type="submit"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "Verifying..." : "Complete Registration"}
                </Button>
              )}
            />
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            By completing registration, you agree to our{" "}
            <a href="#" className="text-primary hover:text-primary/80">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:text-primary/80">
              Privacy Policy
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneOTPVerification;
