// formatCurrency moved to @/utils/currency.ts for consistency

export const formatCNPJ = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length <= 14) {
    return cleanValue.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  }
  return value;
};

export const formatCPF = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length <= 11) {
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return value;
};

export const formatPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  if (cleanValue.length <= 11) {
    if (cleanValue.length === 11) {
      return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (cleanValue.length === 10) {
      return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
  }
  return value;
};

export const parseCurrency = (value: string): number => {
  const cleanValue = value.replace(/[^\d,]/g, "").replace(",", ".");
  return parseFloat(cleanValue) || 0;
};

export const parseCNPJ = (value: string): string => {
  return value.replace(/\D/g, "");
};

export const parseCPF = (value: string): string => {
  return value.replace(/\D/g, "");
};

export const parsePhone = (value: string): string => {
  return value.replace(/\D/g, "");
};
