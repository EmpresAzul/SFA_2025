
import { useToast } from '@/hooks/use-toast';
import { parseStringToNumber } from '@/utils/currency';
import type { FormData } from '@/types/lancamentosForm';

export const useLancamentosFormValidation = () => {
  const { toast } = useToast();

  const validateForm = (formData: FormData) => {
    console.log('Validando formulário:', formData);

    // Validar campos obrigatórios
    if (!formData.data) {
      toast({
        title: "Erro de validação",
        description: "Data é obrigatória.",
        variant: "destructive",
      });
      return { isValid: false, valorNumerico: null };
    }

    if (!formData.tipo) {
      toast({
        title: "Erro de validação",
        description: "Tipo é obrigatório.",
        variant: "destructive",
      });
      return { isValid: false, valorNumerico: null };
    }

    if (!formData.categoria.trim()) {
      toast({
        title: "Erro de validação",
        description: "Categoria é obrigatória.",
        variant: "destructive",
      });
      return { isValid: false, valorNumerico: null };
    }

    // Validar valor
    const valorNumerico = parseStringToNumber(formData.valor);
    if (valorNumerico <= 0) {
      toast({
        title: "Erro de validação",
        description: "Valor deve ser maior que zero.",
        variant: "destructive",
      });
      return { isValid: false, valorNumerico: null };
    }

    // Validar campos de recorrência
    if (formData.recorrente) {
      if (!formData.meses_recorrencia || formData.meses_recorrencia <= 0) {
        toast({
          title: "Erro de validação",
          description: "Para lançamentos recorrentes, é necessário informar a quantidade de meses.",
          variant: "destructive",
        });
        return { isValid: false, valorNumerico: null };
      }

      if (formData.meses_recorrencia > 60) {
        toast({
          title: "Erro de validação",
          description: "O período máximo para lançamentos recorrentes é de 60 meses.",
          variant: "destructive",
        });
        return { isValid: false, valorNumerico: null };
      }
    }

    console.log('Formulário válido. Valor numérico:', valorNumerico);
    return { isValid: true, valorNumerico };
  };

  return { validateForm };
};
