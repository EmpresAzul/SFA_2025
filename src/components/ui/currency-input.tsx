
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface CurrencyInputProps extends Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange'> {
  value: number | string;
  onChange: (value: number) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
      // Só atualizar o display se não estiver editando
      if (!isEditing) {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (!isNaN(numValue) && numValue > 0) {
          setDisplayValue(numValue.toString().replace('.', ','));
        } else {
          setDisplayValue('');
        }
      }
    }, [value, isEditing]);

    const parseCurrency = (inputValue: string): number => {
      // Remove tudo que não é dígito ou vírgula
      const cleaned = inputValue.replace(/[^\d,]/g, '');
      // Substitui vírgula por ponto
      const withDot = cleaned.replace(',', '.');
      const parsed = parseFloat(withDot);
      return isNaN(parsed) ? 0 : parsed;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      console.log('CurrencyInput: Input digitado:', inputValue);
      
      // Permitir apenas números e vírgula
      const allowedValue = inputValue.replace(/[^\d,]/g, '');
      setDisplayValue(allowedValue);
      
      // Converter para número e chamar onChange
      const numericValue = parseCurrency(allowedValue);
      console.log('CurrencyInput: Valor convertido:', numericValue);
      onChange(numericValue);
    };

    const handleFocus = () => {
      console.log('CurrencyInput: Campo focado');
      setIsEditing(true);
    };

    const handleBlur = () => {
      console.log('CurrencyInput: Campo desfocado');
      setIsEditing(false);
      
      // Formatar para visualização se houver valor
      const numValue = parseCurrency(displayValue);
      if (numValue > 0) {
        setDisplayValue(numValue.toString().replace('.', ','));
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="0,00"
        inputMode="numeric"
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
