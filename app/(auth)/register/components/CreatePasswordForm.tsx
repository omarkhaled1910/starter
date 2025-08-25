"use client";
import React from "react";
import { useForm } from "@tanstack/react-form";
import FormField from "@/components/form/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WizardStepProps } from "@/components/custom/Wizard/types";
import { TRegistrationDefaultValues, RegistrationSteps } from "../constants";

const CreatePasswordForm: React.FC<
  WizardStepProps<TRegistrationDefaultValues, RegistrationSteps>
> = ({ data, updateData, nextStep, prevStep }) => {
  const form = useForm({
    defaultValues: {
      password: data.password || "",
      confirmPassword: data.confirmPassword || "",
    },
    onSubmit: async ({ value }) => {
      updateData(value);
      nextStep();
    },
  });

  const passwordField = {
    name: "password",
    label: "Password",
    type: "password" as const,
    placeholder: "Enter your password",
    validators: {
      onChange: ({ value }: { value: string }) =>
        !value
          ? "Password is required"
          : value.length < 8
          ? "Password must be at least 8 characters"
          : !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)
          ? "Password must contain at least one uppercase letter, one lowercase letter, and one number"
          : undefined,
    },
  };

  const confirmPasswordField = {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password" as const,
    placeholder: "Confirm your password",
    validators: {
      onChange: ({ value, fieldApi }: { value: string; fieldApi: any }) => {
        const password = fieldApi.form.getFieldValue("password");
        return !value
          ? "Please confirm your password"
          : value !== password
          ? "Passwords do not match"
          : undefined;
      },
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="h-10 w-auto"
          />
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-card-foreground">
              Create a secure password
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Your password should be at least 8 characters long and include
              uppercase, lowercase, and numbers.
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
                <FormField fieldConfig={passwordField} form={form} />
              </div>

              <div>
                <FormField fieldConfig={confirmPasswordField} form={form} />
              </div>

              <div className="flex gap-4 w-full">
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
                      {isSubmitting ? "Processing..." : "Continue"}
                    </Button>
                  )}
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePasswordForm;
