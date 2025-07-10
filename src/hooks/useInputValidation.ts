import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message?: string;
}

interface ValidationResult {
  isValid: boolean;
  message: string;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

export const useInputValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((name: string, value: string): ValidationResult => {
    const rule = rules[name];
    if (!rule) return { isValid: true, message: '' };

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      return {
        isValid: false,
        message: rule.message || `${name} é obrigatório`
      };
    }

    // Skip other validations if value is empty and not required
    if (!value || value.trim() === '') {
      return { isValid: true, message: '' };
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return {
        isValid: false,
        message: rule.message || `${name} deve ter pelo menos ${rule.minLength} caracteres`
      };
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return {
        isValid: false,
        message: rule.message || `${name} deve ter no máximo ${rule.maxLength} caracteres`
      };
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return {
        isValid: false,
        message: rule.message || `${name} formato inválido`
      };
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      return {
        isValid: false,
        message: rule.message || `${name} valor inválido`
      };
    }

    return { isValid: true, message: '' };
  }, [rules]);

  const validateForm = useCallback((formData: Record<string, string>): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(rules).forEach((fieldName) => {
      const value = formData[fieldName] || '';
      const result = validateField(fieldName, value);
      
      if (!result.isValid) {
        newErrors[fieldName] = result.message;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const validateSingleField = useCallback((name: string, value: string): boolean => {
    const result = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: result.message
    }));
    return result.isValid;
  }, [validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateForm,
    validateSingleField,
    clearErrors,
    clearFieldError,
    validateField
  };
};

// Specialized validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;
  
  // Check for repeated digits
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validate first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validate second digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

export const validateCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  if (cleanCNPJ.length !== 14) return false;
  
  // Check for repeated digits
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
  
  // Validate first digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(cleanCNPJ.charAt(12))) return false;
  
  // Validate second digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(cleanCNPJ.charAt(13))) return false;
  
  return true;
};

export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

export const validateCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
};
