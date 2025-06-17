
/**
 * Utilitários centralizados para manipulação de valores monetários
 * Garantem consistência em todo o sistema com formato brasileiro R$ 1.234.567,00
 */

export interface CurrencyValue {
  display: string;    // Valor formatado para exibição (ex: "R$ 1.234.567,00")
  numeric: number;    // Valor numérico para cálculos e database
  input: string;      // Valor para campos de entrada (ex: "1.234.567,00")
}

/**
 * Converte string de entrada para número
 * Aceita formatos: "1234,56", "1.234,56", "1.234.567,00", "R$ 1.234.567,00"
 */
export const parseStringToNumber = (value: string | number): number => {
  if (typeof value === 'number') return value;
  if (!value || typeof value !== 'string') return 0;
  
  // Remove tudo exceto números, vírgulas e pontos
  let cleanValue = value.replace(/[^\d,.-]/g, '');
  
  if (!cleanValue) return 0;
  
  // Lógica brasileira: último separador é decimal
  // Se tem vírgula, ela é sempre decimal
  // Se tem apenas pontos, o último é decimal se tiver 2 dígitos após
  if (cleanValue.includes(',')) {
    // Remove todos os pontos (milhares) e converte vírgula para ponto
    cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
  } else {
    // Só pontos - verificar se último é decimal
    const parts = cleanValue.split('.');
    if (parts.length > 1 && parts[parts.length - 1].length === 2) {
      // Último ponto é decimal
      parts[parts.length - 2] = parts.slice(0, -1).join('');
      cleanValue = parts[parts.length - 2] + '.' + parts[parts.length - 1];
    } else {
      // Todos os pontos são milhares
      cleanValue = cleanValue.replace(/\./g, '');
    }
  }
  
  const result = parseFloat(cleanValue);
  return isNaN(result) ? 0 : result;
};

/**
 * Converte número para formato de exibição brasileiro R$ 1.234.567,00
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
 * Converte número para formato de entrada brasileiro (sem R$) 1.234.567,00
 */
export const formatNumberToInput = (value: number): string => {
  if (isNaN(value) || value === null || value === undefined) return '0,00';
  
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Cria objeto CurrencyValue a partir de qualquer entrada
 */
export const createCurrencyValue = (input: string | number): CurrencyValue => {
  const numeric = parseStringToNumber(input);
  
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
  const numeric = parseStringToNumber(value);
  
  if (isNaN(numeric)) {
    return { isValid: false, error: 'Valor inválido' };
  }
  
  if (numeric < 0) {
    return { isValid: false, error: 'Valor não pode ser negativo' };
  }
  
  return { isValid: true, numeric };
};

/**
 * Formata valor enquanto usuário digita (máscara em tempo real)
 */
export const formatCurrencyInput = (value: string): string => {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers) return '';
  
  // Converte para número (centavos)
  const amount = parseInt(numbers) / 100;
  
  // Formata no padrão brasileiro
  return formatNumberToInput(amount);
};
