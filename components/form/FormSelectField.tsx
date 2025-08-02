import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FormSelectFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  id?: string;
  name?: string;
  error?: boolean;
}

export const FormSelectField = ({
  value,
  onValueChange,
  onBlur,
  placeholder,
  options,
  id,
  name,
  error,
}: FormSelectFieldProps) => {
  return (
    <Select name={name} value={value} onValueChange={onValueChange}>
      <SelectTrigger
        id={id}
        className={cn("w-full", error && "border-destructive")}
        onBlur={onBlur}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
