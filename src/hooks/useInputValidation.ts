
import { useState, useCallback } from 'react';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const useInputValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validação de CPF
  const validateCPF = useCallback((cpf: string): ValidationResult => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    if (cleanCPF.length !== 11) {
      return { isValid: false, message: 'CPF deve ter 11 dígitos' };
    }

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
      return { isValid: false, message: 'CPF inválido' };
    }

    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 === 10 || digit1 === 11) digit1 = 0;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 === 10 || digit2 === 11) digit2 = 0;

    if (parseInt(cleanCPF.charAt(9)) !== digit1 || parseInt(cleanCPF.charAt(10)) !== digit2) {
      return { isValid: false, message: 'CPF inválido' };
    }

    return { isValid: true };
  }, []);

  // Validação de CNPJ
  const validateCNPJ = useCallback((cnpj: string): ValidationResult => {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    
    if (cleanCNPJ.length !== 14) {
      return { isValid: false, message: 'CNPJ deve ter 14 dígitos' };
    }

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
      return { isValid: false, message: 'CNPJ inválido' };
    }

    // Validação dos dígitos verificadores
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let sum1 = 0;
    for (let i = 0; i < 12; i++) {
      sum1 += parseInt(cleanCNPJ.charAt(i)) * weights1[i];
    }
    let digit1 = sum1 % 11 < 2 ? 0 : 11 - (sum1 % 11);

    let sum2 = 0;
    for (let i = 0; i < 13; i++) {
      sum2 += parseInt(cleanCNPJ.charAt(i)) * weights2[i];
    }
    let digit2 = sum2 % 11 < 2 ? 0 : 11 - (sum2 % 11);

    if (parseInt(cleanCNPJ.charAt(12)) !== digit1 || parseInt(cleanCNPJ.charAt(13)) !== digit2) {
      return { isValid: false, message: 'CNPJ inválido' };
    }

    return { isValid: true };
  }, []);

  // Validação de email
  const validateEmail = useCallback((email: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Email inválido' };
    }
    return { isValid: true };
  }, []);

  // Validação de telefone
  const validatePhone = useCallback((phone: string): ValidationResult => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return { isValid: false, message: 'Telefone deve ter 10 ou 11 dígitos' };
    }
    return { isValid: true };
  }, []);

  // Sanitização de texto
  const sanitizeText = useCallback((text: string): string => {
    // Remover caracteres potencialmente perigosos
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }, []);

  // Validação de senha forte
  const validatePassword = useCallback((password: string): ValidationResult => {
    if (password.length < 8) {
      return { isValid: false, message: 'Senha deve ter pelo menos 8 caracteres' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Senha deve conter pelo menos uma letra minúscula' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Senha deve conter pelo menos uma letra maiúscula' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Senha deve conter pelo menos um número' };
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return { isValid: false, message: 'Senha deve conter pelo menos um caractere especial' };
    }
    return { isValid: true };
  }, []);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateCPF,
    validateCNPJ,
    validateEmail,
    validatePhone,
    validatePassword,
    sanitizeText,
    setFieldError,
    clearFieldError,
    clearAllErrors,
  };
};
