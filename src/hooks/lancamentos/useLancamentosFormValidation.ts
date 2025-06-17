
import { useToast } from '@/hooks/use-toast';
import { validateCurrencyValue, parseStringToNumber } from '@/utils/currency';
import type { FormData } from '@/types/lancamentosForm';

export const useLancamentosFormValidation = () => {
  const { toast } = useToast();

  const validateForm = (formData: FormData): { isValid: boolean; valorNumerico?: number } => {
    if (!formData.tipo) {
      toast({
        title: "Erro",
        description: "Por favor, selecione o tipo de lançamento.",
        variant: "destructive",
      });
      return { isValid: false };
    }

    if (!formData.categoria) {
      toast({
        title: "Erro",
        description: "Por favor, selecione a categoria.",
        variant: "destructive",
      });
      return { isValid: false };
    }

    if (!formData.data) {
      toast({
        title: "Erro",
        description: "Por favor, informe a data.",
        variant: "destructive",
      });
      return { isValid: false };
    }

    // Converter string ou número para número para validação
    const valorNumerico = typeof formData.valor === 'string' 
      ? parseStringToNumber(formData.valor) 
      : formData.valor;
    
    const valorValidation = validateCurrencyValue(valorNumerico);
    
    console.log('Validation: Validação de valor:', valorValidation);

    if (!valorValidation.isValid || !valorValidation.numeric || valorValidation.numeric <= 0) {
      toast({
        title: "Erro",
        description: valorValidation.error || "Por favor, informe um valor válido maior que zero.",
        variant: "destructive",
      });
      return { isValid: false };
    }

    return { isValid: true, valorNumerico: valorValidation.numeric };
  };

  return { validateForm };
};
