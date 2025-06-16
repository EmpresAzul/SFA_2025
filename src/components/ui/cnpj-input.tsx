
import React from 'react';
import { Input } from '@/components/ui/input';
import { formatCNPJ, parseCNPJ } from '@/utils/formatters';

interface CNPJInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange'> {
  onChange: (value: string) => void;
}

export const CNPJInput = React.forwardRef<HTMLInputElement, CNPJInputProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCNPJ(e.target.value);
      const cleaned = parseCNPJ(formatted);
      
      if (cleaned.length <= 14) {
        onChange(cleaned);
        e.target.value = formatted;
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        onChange={handleChange}
        placeholder="00.000.000/0000-00"
        maxLength={18}
      />
    );
  }
);

CNPJInput.displayName = "CNPJInput";
