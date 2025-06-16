
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

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

    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount);
    };

    const parseCurrency = (value: string): number => {
      // Remove todos os caracteres que não são dígitos
      const numbers = value.replace(/\D/g, '');
      
      if (!numbers) return 0;
      
      // Converte para centavos e depois para reais
      return parseInt(numbers) / 100;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Permite apenas dígitos, vírgulas e pontos
      const cleanValue = inputValue.replace(/[^\d,.-]/g, '');
      
      // Se está digitando, mantém o valor sem formatação
      setDisplayValue(cleanValue);
      
      // Converte para número
      const numericValue = parseCurrency(cleanValue);
      onChange(numericValue);
    };

    const handleBlur = () => {
      const numValue = parseCurrency(displayValue);
      if (numValue > 0) {
        setDisplayValue(formatCurrency(numValue));
      } else {
        setDisplayValue('');
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Remove formatação para facilitar edição
      const numValue = parseCurrency(displayValue);
      if (numValue > 0) {
        setDisplayValue((numValue * 100).toString());
      }
      e.target.select();
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="R$ 0,00"
        inputMode="numeric"
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
