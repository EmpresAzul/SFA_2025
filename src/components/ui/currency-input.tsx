
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrency, parseCurrency } from '@/utils/formatters';

interface CurrencyInputProps extends Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange'> {
  value: number | string;
  onChange: (value: number) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (!isNaN(numValue) && numValue !== 0) {
        setDisplayValue(formatCurrency(numValue));
      } else {
        setDisplayValue('');
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      setDisplayValue(inputValue);
      
      const numericValue = parseCurrency(inputValue);
      onChange(numericValue);
    };

    const handleBlur = () => {
      const numValue = parseCurrency(displayValue);
      if (numValue > 0) {
        setDisplayValue(formatCurrency(numValue));
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="R$ 0,00"
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
