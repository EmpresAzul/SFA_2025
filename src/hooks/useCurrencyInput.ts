
import { useState, useCallback } from 'react';
import { createCurrencyValue, parseStringToNumber, validateCurrencyValue } from '@/utils/currency';

interface UseCurrencyInputOptions {
  initialValue?: string | number;
  allowNegative?: boolean;
  onValueChange?: (numeric: number, formatted: string) => void;
}

export const useCurrencyInput = (options: UseCurrencyInputOptions = {}) => {
  const { initialValue = 0, allowNegative = false, onValueChange } = options;
  
  const [currencyValue, setCurrencyValue] = useState(() => 
    createCurrencyValue(initialValue)
  );

  const updateValue = useCallback((newValue: string | number) => {
    const currency = createCurrencyValue(newValue);
    
    if (!allowNegative && currency.numeric < 0) {
      return;
    }
    
    setCurrencyValue(currency);
    onValueChange?.(currency.numeric, currency.input);
  }, [allowNegative, onValueChange]);

  const handleInputChange = useCallback((inputValue: string) => {
    updateValue(inputValue);
  }, [updateValue]);

  const setValue = useCallback((value: string | number) => {
    updateValue(value);
  }, [updateValue]);

  const validate = useCallback(() => {
    return validateCurrencyValue(currencyValue.numeric);
  }, [currencyValue.numeric]);

  return {
    value: currencyValue.input,
    displayValue: currencyValue.display,
    numericValue: currencyValue.numeric,
    handleInputChange,
    setValue,
    validate,
    isValid: currencyValue.numeric >= 0
  };
};
