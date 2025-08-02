import React from "react";
import FieldInfo from "./FieldInfo";
import { Input } from "../ui/input";
import { FormSelectField } from "./FormSelectField";
import { FormMultiSelect } from "./FormMultiSelect";

type FieldValidator = {
  onChange?: (params: { value: any }) => string | undefined;
  onChangeAsync?: (params: { value: any }) => Promise<string | undefined>;
  onChangeAsyncDebounceMs?: number;
};

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "select" | "multi";
  placeholder?: string;
  options?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  validators: FieldValidator;
};

type FormFieldProps = {
  fieldConfig: FieldConfig;
  form: any;
};

const FormField = ({ fieldConfig, form }: FormFieldProps) => {
  const {
    name,
    label,
    type = "text",
    placeholder,
    options,
    validators,
  } = fieldConfig;

  return (
    <form.Field
      name={name}
      validators={validators}
      children={(field: any) => (
        <div className="grid gap-2">
          <label htmlFor={field.name}>{label}:</label>

          {type === "multi" && Array.isArray(options) ? (
            <FormMultiSelect
              defaultValue={field.state.value || []}
              onValueChange={field.handleChange}
              placeholder={placeholder}
              options={options}
              className="w-full"
            />
          ) : type === "select" && options ? (
            <FormSelectField
              value={field.state.value}
              onValueChange={field.handleChange}
              onBlur={field.handleBlur}
              placeholder={placeholder}
              options={options}
              id={field.name}
              name={field.name}
              error={field.state.meta.errors.length > 0}
            />
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type={type}
              placeholder={placeholder}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.length > 0}
            />
          )}

          <FieldInfo field={field} />
        </div>
      )}
    />
  );
};

export default FormField;