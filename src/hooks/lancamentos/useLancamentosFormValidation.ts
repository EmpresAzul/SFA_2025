
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

    if (!formData.data) {
      toast({
        title: "Erro",
        description: "Por favor, informe a data.",
        variant: "destructive",
      });
      return { isValid: false };
    }

    // Converter valor para número, tratando vírgulas e pontos
    let valorNumerico = 0;
    if (formData.valor) {
      // Remove espaços e trata vírgula como separador decimal
      const valorLimpo = formData.valor.toString().trim().replace(',', '.');
      valorNumerico = parseFloat(valorLimpo);
    }
    
    console.log('Validation: Valor original:', formData.valor, 'Valor numérico:', valorNumerico);

    if (!formData.valor || isNaN(valorNumerico) || valorNumerico <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, informe um valor válido maior que zero.",
        variant: "destructive",
      });
      return { isValid: false };
    }

    return { isValid: true, valorNumerico };
  };

  return { validateForm };
};
