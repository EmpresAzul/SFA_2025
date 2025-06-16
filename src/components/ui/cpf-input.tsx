
import React from 'react';
import { Input } from '@/components/ui/input';
import { formatCPF, parseCPF } from '@/utils/formatters';

interface CPFInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange'> {
  onChange: (value: string) => void;
}

export const CPFInput = React.forwardRef<HTMLInputElement, CPFInputProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCPF(e.target.value);
      const cleaned = parseCPF(formatted);
      
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
        placeholder="000.000.000-00"
        maxLength={14}
      />
    );
  }
);

CPFInput.displayName = "CPFInput";
