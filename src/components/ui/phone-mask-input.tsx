import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneMaskInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const PhoneMaskInput = React.forwardRef<HTMLInputElement, PhoneMaskInputProps>(
  ({ value = "", onChange, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");

    // Formatar telefone: (xx) xxxxx-xxxx
    const formatPhone = (numbers: string) => {
      // Remover qualquer formatação existente
      const cleaned = numbers.replace(/\D/g, '');
      
      // Aplicar máscara baseada no comprimento
      if (cleaned.length === 0) return "";
      if (cleaned.length <= 2) return `(${cleaned}`;
      if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    };

    // Remover formatação para obter apenas números
    const getNumbers = (text: string) => text.replace(/\D/g, '');

    // Atualizar o display quando o valor externo muda
    useEffect(() => {
      if (value !== undefined) {
        const numbers = getNumbers(value);
        const formatted = formatPhone(numbers);
        setDisplayValue(formatted);
      }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const numbers = getNumbers(inputValue);
      
      // Limitar a 11 dígitos
      const limitedNumbers = numbers.slice(0, 11);
      const formatted = formatPhone(limitedNumbers);
      
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
        placeholder="(11) 99999-9999"
        className={cn(className)}
        maxLength={15} // Máximo para telefone formatado
      />
    );
  }
);

PhoneMaskInput.displayName = "PhoneMaskInput";