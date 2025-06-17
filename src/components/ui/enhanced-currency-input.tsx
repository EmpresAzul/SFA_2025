
import React, { forwardRef, useEffect } from 'react';
import { Input } from './input';
import { useCurrencyInput } from '@/hooks/useCurrencyInput';
import { cn } from '@/lib/utils';

interface EnhancedCurrencyInputProps {
  value?: string | number;
  onChange?: (numericValue: number, formattedValue: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  allowNegative?: boolean;
  error?: boolean;
  id?: string;
}

export const EnhancedCurrencyInput = forwardRef<HTMLInputElement, EnhancedCurrencyInputProps>(
  ({ 
    value, 
    onChange, 
    placeholder = "R$ 0,00", 
    className, 
    disabled = false,
    allowNegative = false,
    error = false,
    id,
    ...props 
  }, ref) => {
    const {
      value: inputValue,
      numericValue,
      handleInputChange,
      setValue,
      validate
    } = useCurrencyInput({
      initialValue: value || 0,
      allowNegative,
      onValueChange: onChange
    });

    // Sincronizar com valor externo
    useEffect(() => {
      if (value !== undefined && value !== numericValue) {
        setValue(value);
      }
    }, [value, numericValue, setValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleInputChange(e.target.value);
    };

    const handleBlur = () => {
      // Reformat on blur para garantir formato consistente
      setValue(numericValue);
    };

    return (
      <Input
        ref={ref}
        id={id}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn(
          error && "border-red-500 focus:border-red-500",
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

EnhancedCurrencyInput.displayName = "EnhancedCurrencyInput";
