"use client";
import React from "react";
import { useForm } from "@tanstack/react-form";
import FormField from "@/components/form/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WizardStepProps } from "@/components/custom/Wizard/types";
import { TRegistrationDefaultValues, RegistrationSteps } from "../constants";

const RegistrationForm: React.FC<
  WizardStepProps<TRegistrationDefaultValues, RegistrationSteps>
> = ({ data, updateData, nextStep }) => {
  const form = useForm({
    defaultValues: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phoneNumber: data.phoneNumber || "",
    },
    onSubmit: async ({ value }) => {
      updateData(value);
      nextStep();
    },
  });

  const firstNameField = {
    name: "firstName",
    label: "First Name",
    type: "text" as const,
    placeholder: "Enter your first name",
    validators: {
      onChange: ({ value }: { value: string }) =>
        !value
          ? "First name is required"
          : value.length < 2
          ? "First name must be at least 2 characters"
          : undefined,
    },
  };

  const lastNameField = {
    name: "lastName",
    label: "Last Name",
    type: "text" as const,
    placeholder: "Enter your last name",
    validators: {
      onChange: ({ value }: { value: string }) =>
        !value
          ? "Last name is required"
          : value.length < 2
          ? "Last name must be at least 2 characters"
          : undefined,
    },
  };

  const emailField = {
    name: "email",
    label: "Email Address",
    type: "email" as const,
    placeholder: "Enter your email",
    validators: {
      onChange: ({ value }: { value: string }) =>
        !value
          ? "Email is required"
          : !value.includes("@")
          ? "Please enter a valid email address"
          : undefined,
    },
  };

  const phoneField = {
    name: "phoneNumber",
    label: "Phone Number",
    type: "text" as const,
    placeholder: "Enter your phone number",
    validators: {
      onChange: ({ value }: { value: string }) =>
        !value
          ? "Phone number is required"
          : value.length < 10
          ? "Please enter a valid phone number"
          : undefined,
    },
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-card-foreground">
          Create your account
        </CardTitle>
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
          <div className="grid grid-cols-2 gap-4">
            <FormField fieldConfig={firstNameField} form={form} />
            <FormField fieldConfig={lastNameField} form={form} />
          </div>

          {/* <div>
            <FormField fieldConfig={emailField} form={form} />
          </div>

          <div>
            <FormField fieldConfig={phoneField} form={form} />
          </div> */}

          <div className="flex justify-center w-full">
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
  );
};

export default RegistrationForm;
