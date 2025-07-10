import React, { useState, useEffect } from "react";
import { Input } from "./input";
import { formatCurrencyInput, parseStringToNumber } from "@/utils/currency";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = "R$ 0,00",
  className,
  disabled = false,
  id,
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    console.log("CurrencyInput: Valor recebido:", value);
    if (value !== undefined && value !== null) {
      if (typeof value === "string" && value !== "") {
        // Se já está formatado, use como está
        if (value.includes(",") || value.includes(".")) {
          setDisplayValue(value);
        } else {
          // Se é número puro, formate
          const numericValue = parseFloat(value) || 0;
          const formatted = formatCurrencyInput(value);
          setDisplayValue(formatted);
        }
      } else {
        setDisplayValue("");
      }
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    console.log("CurrencyInput: Valor digitado:", inputValue);

    // Aplicar máscara em tempo real usando a função utilitária
    const formattedValue = formatCurrencyInput(inputValue);
    console.log("CurrencyInput: Valor formatado:", formattedValue);

    setDisplayValue(formattedValue);
    onChange(formattedValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);

    // Garantir formato consistente no blur
    if (displayValue && displayValue !== "") {
      const numericValue = parseStringToNumber(displayValue);
      if (!isNaN(numericValue) && numericValue >= 0) {
        const formatted = formatCurrencyInput(displayValue);
        setDisplayValue(formatted);
        onChange(formatted);
      }
    }
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
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm pointer-events-none z-10">
        R$
      </span>
      <Input
        id={id}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`pl-10 ${className || ""}`}
        disabled={disabled}
      />
    </div>
  );
};
