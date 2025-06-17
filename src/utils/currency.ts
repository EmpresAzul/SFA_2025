
/**
 * Utilitários centralizados para manipulação de valores monetários
 * Garantem consistência em todo o sistema
 */

export interface CurrencyValue {
  display: string;    // Valor formatado para exibição (ex: "R$ 1.234,56")
  numeric: number;    // Valor numérico para cálculos e database
  input: string;      // Valor para campos de entrada (ex: "1234,56")
}

/**
 * Converte string de entrada para número
 * Aceita formatos: "1234,56", "1.234,56", "R$ 1.234,56"
 */
export const parseStringToNumber = (value: string): number => {
  if (!value || typeof value !== 'string') return 0;
  
  // Remove tudo exceto números, vírgulas e pontos
  let cleanValue = value.replace(/[^\d,.-]/g, '');
  
  // Se tem vírgula e ponto, assume que vírgula é decimal
  if (cleanValue.includes(',') && cleanValue.includes('.')) {
    // Remove pontos (milhares) e converte vírgula para ponto
    cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
  } else if (cleanValue.includes(',')) {
    // Só vírgula - converte para ponto
    cleanValue = cleanValue.replace(',', '.');
  }
  
  const result = parseFloat(cleanValue);
  return isNaN(result) ? 0 : result;
};

/**
 * Converte número para formato de exibição brasileiro
 */
export const formatNumberToDisplay = (value: number): string => {
  if (isNaN(value) || value === null || value === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Converte número para formato de entrada (sem R$)
 */
export const formatNumberToInput = (value: number): string => {
  if (isNaN(value) || value === null || value === undefined) return '';
  
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Cria objeto CurrencyValue a partir de qualquer entrada
 */
export const createCurrencyValue = (input: string | number): CurrencyValue => {
  let numeric: number;
  
  if (typeof input === 'number') {
    numeric = input;
  } else {
    numeric = parseStringToNumber(input);
  }
  
  return {
    display: formatNumberToDisplay(numeric),
    numeric: numeric,
    input: formatNumberToInput(numeric)
  };
};

/**
 * Valida se um valor monetário é válido
 */
export const validateCurrencyValue = (value: string | number): { isValid: boolean; error?: string; numeric?: number } => {
  const numeric = typeof value === 'number' ? value : parseStringToNumber(value);
  
  if (isNaN(numeric)) {
    return { isValid: false, error: 'Valor inválido' };
  }
  
  if (numeric < 0) {
    return { isValid: false, error: 'Valor não pode ser negativo' };
  }
  
  return { isValid: true, numeric };
};
