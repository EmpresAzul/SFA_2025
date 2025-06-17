
import React, { forwardRef, useEffect, useState } from 'react';
import { Input } from './input';
import { formatNumberToInput, parseStringToNumber } from '@/utils/currency';
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
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Sincronizar com valor externo
    useEffect(() => {
      if (value !== undefined) {
        const numericValue = typeof value === 'number' ? value : parseStringToNumber(String(value));
        const formattedValue = formatNumberToInput(numericValue);
        setInputValue(formattedValue);
      } else {
        setInputValue('');
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      
      // Permitir apenas números, vírgulas, pontos e sinal negativo
      const cleanValue = rawValue.replace(/[^0-9,.-]/g, '');
      
      const numericValue = parseStringToNumber(cleanValue);
      
      if (!allowNegative && numericValue < 0) {
        return;
      }
      
      setInputValue(cleanValue);
      
      // Formatar valor para salvar
      const formattedForSave = formatNumberToInput(numericValue);
      onChange?.(numericValue, formattedForSave);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
      // Reformat on blur para garantir formato consistente
      const numericValue = parseStringToNumber(inputValue);
      const formattedValue = formatNumberToInput(numericValue);
      setInputValue(formattedValue);
      onChange?.(numericValue, formattedValue);
    };

    return (
      <Input
        ref={ref}
        id={id}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
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
