import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CpfCnpjInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const CpfCnpjInput = React.forwardRef<HTMLInputElement, CpfCnpjInputProps>(
  ({ value = "", onChange, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");

    // Detectar se é CPF ou CNPJ baseado no comprimento
    const isCnpj = (numbers: string) => numbers.length > 11;

    // Formatar CPF: 000.000.000-00
    const formatCpf = (numbers: string) => {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    };

    // Formatar CNPJ: 00.000.000/0000-00
    const formatCnpj = (numbers: string) => {
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2');
    };

    // Remover formatação para obter apenas números
    const getNumbers = (text: string) => text.replace(/\D/g, '');

    // Aplicar formatação baseada no comprimento
    const applyMask = (numbers: string) => {
      if (numbers.length === 0) return "";
      
      if (isCnpj(numbers)) {
        // Limitar a 14 dígitos para CNPJ
        const limitedNumbers = numbers.slice(0, 14);
        return formatCnpj(limitedNumbers);
      } else {
        // Limitar a 11 dígitos para CPF
        const limitedNumbers = numbers.slice(0, 11);
        return formatCpf(limitedNumbers);
      }
    };

    // Atualizar o display quando o valor externo muda
    useEffect(() => {
      if (value !== undefined) {
        const numbers = getNumbers(value);
        const formatted = applyMask(numbers);
        setDisplayValue(formatted);
      }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const numbers = getNumbers(inputValue);
      const formatted = applyMask(numbers);
      
      setDisplayValue(formatted);
      
      // Chamar onChange com o valor formatado
      if (onChange) {
        onChange(formatted);
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleInputChange}
        placeholder="CPF ou CNPJ"
        className={cn(className)}
        maxLength={18} // Máximo para CNPJ formatado
      />
    );
  }
);

CpfCnpjInput.displayName = "CpfCnpjInput";