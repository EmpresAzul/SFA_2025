
import React, { useState, useEffect } from 'react';
import { Input } from './input';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = "R$ 0,00",
  className,
  disabled = false,
}) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value) {
      // Se o valor já contém vírgula, usar como está
      if (value.includes(',')) {
        setDisplayValue(value);
      } else {
        // Se é um número com ponto, converter para vírgula
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          setDisplayValue(formatCurrency(numericValue));
        } else {
          setDisplayValue(value);
        }
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Remove tudo que não for número, vírgula ou ponto
    inputValue = inputValue.replace(/[^\d,.-]/g, '');

    // Permite apenas uma vírgula ou ponto
    const commaCount = (inputValue.match(/,/g) || []).length;
    const dotCount = (inputValue.match(/\./g) || []).length;
    
    if (commaCount > 1) {
      inputValue = inputValue.replace(/,(?=.*,)/, '');
    }
    if (dotCount > 1) {
      inputValue = inputValue.replace(/\.(?=.*\.)/, '');
    }

    // Limita casas decimais após vírgula
    if (inputValue.includes(',')) {
      const parts = inputValue.split(',');
      if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
        inputValue = parts.join(',');
      }
    }

    setDisplayValue(inputValue);
    onChange(inputValue);
  };

  const handleBlur = () => {
    if (displayValue && displayValue !== '') {
      // Converte vírgula para ponto para validação
      const valueForValidation = displayValue.replace(',', '.');
      const numericValue = parseFloat(valueForValidation);
      
      if (!isNaN(numericValue) && numericValue > 0) {
        const formatted = formatCurrency(numericValue);
        setDisplayValue(formatted);
        onChange(formatted);
      }
    }
  };

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  );
};
