import React from "react";
import { Input } from "@/components/ui/input";
import { formatPhone, parsePhone } from "@/utils/formatters";

interface PhoneInputProps
  extends Omit<React.ComponentProps<typeof Input>, "onChange"> {
  onChange: (value: string) => void;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhone(e.target.value);
      const cleaned = parsePhone(formatted);

      if (cleaned.length <= 11) {
        onChange(cleaned);
        e.target.value = formatted;
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        onChange={handleChange}
        placeholder="(00) 00000-0000"
        maxLength={15}
      />
    );
  },
);

PhoneInput.displayName = "PhoneInput";
