
import { useToast } from '@/hooks/use-toast';
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

    // Converter valor para número
    const valorNumerico = parseFloat(formData.valor.replace(',', '.'));
    console.log('Validation: Valor original:', formData.valor, 'Valor numérico:', valorNumerico);

    if (!formData.valor || valorNumerico <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, informe um valor válido.",
        variant: "destructive",
      });
      return { isValid: false };
    }

    return { isValid: true, valorNumerico };
  };

  return { validateForm };
};
