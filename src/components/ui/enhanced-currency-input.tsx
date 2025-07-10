import React, { forwardRef, useEffect, useState } from "react";
import { Input } from "./input";
import {
  formatNumberToInput,
  parseStringToNumber,
  formatCurrencyInput,
} from "@/utils/currency";
import { cn } from "@/lib/utils";

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

export const EnhancedCurrencyInput = forwardRef<
  HTMLInputElement,
  EnhancedCurrencyInputProps
>(
  (
    {
      value,
      onChange,
      placeholder = "0,00",
      className,
      disabled = false,
      allowNegative = false,
      error = false,
      id,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    // Sincronizar com valor externo
    useEffect(() => {
      if (value !== undefined) {
        const numericValue = parseStringToNumber(value);
        const formattedValue = formatNumberToInput(numericValue);
        setInputValue(formattedValue);
      } else {
        setInputValue("");
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      // Aplicar máscara em tempo real
      const formattedValue = formatCurrencyInput(rawValue);
      const numericValue = parseStringToNumber(formattedValue);

      if (!allowNegative && numericValue < 0) {
        return;
      }

      setInputValue(formattedValue);
      onChange?.(numericValue, formattedValue);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
      // Garantir formato consistente no blur
      const numericValue = parseStringToNumber(inputValue);
      const formattedValue = formatNumberToInput(numericValue);
      setInputValue(formattedValue);
      onChange?.(numericValue, formattedValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Permitir teclas de navegação e controle
      const allowedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "Home",
        "End",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
      ];

      // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) {
        return;
      }

      // Permitir teclas de controle
      if (allowedKeys.includes(e.key)) {
        return;
      }

      // Permitir apenas números
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    };

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
          R$
        </span>
        <Input
          ref={ref}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "pl-10", // Espaço para o R$
            error && "border-red-500 focus:border-red-500",
            className,
          )}
          disabled={disabled}
          {...props}
        />
      </div>
    );
  },
);

EnhancedCurrencyInput.displayName = "EnhancedCurrencyInput";
