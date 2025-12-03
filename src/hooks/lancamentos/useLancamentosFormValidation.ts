
import { useToast } from "@/hooks/use-toast";
import { parseStringToNumber } from "@/utils/currency";
import type { LancamentoFormData } from "@/types/lancamentosForm";

export const useLancamentosFormValidation = () => {
  const { toast } = useToast();

  const validateForm = (formData: LancamentoFormData) => {
    console.log("🔍 Validação: Iniciando validação do formulário");
    console.log("📋 Validação: Dados do formulário:", formData);
    
    // Validar campos obrigatórios
    if (!formData.data) {
      console.error("❌ Validação: Data não preenchida");
      toast({
        title: "Erro de validação",
        description: "Data é obrigatória.",
        variant: "destructive",
      });
      return { isValid: false, valorNumerico: null };
    }

    if (!formData.tipo) {
      console.error("❌ Validação: Tipo não selecionado");
      toast({
        title: "Erro de validação",
        description: "Tipo é obrigatório.",
        variant: "destructive",
      });
      return { isValid: false, valorNumerico: null };
    }

    if (!formData.categoria.trim()) {
      console.error("❌ Validação: Categoria não selecionada");
      toast({
        title: "Erro de validação",
        description: "Categoria é obrigatória.",
        variant: "destructive",
      });
      return { isValid: false, valorNumerico: null };
    }

    // Validar valor
    const valorNumerico = parseStringToNumber(formData.valor);
    console.log("💰 Validação: Valor numérico parseado:", valorNumerico);
    
    if (valorNumerico <= 0) {
      console.error("❌ Validação: Valor inválido ou zero");
      toast({
        title: "Erro de validação",
        description: "Valor deve ser maior que zero.",
        variant: "destructive",
      });
      return { isValid: false, valorNumerico: null };
    }

    // Validar campos de recorrência
    if (formData.recorrente) {
      console.log("🔄 Validação: Lançamento recorrente detectado");
      if (!formData.meses_recorrencia || formData.meses_recorrencia <= 0) {
        console.error("❌ Validação: Meses de recorrência não informado");
        toast({
          title: "Erro de validação",
          description:
            "Para lançamentos recorrentes, é necessário informar a quantidade de meses.",
          variant: "destructive",
        });
        return { isValid: false, valorNumerico: null };
      }

      if (formData.meses_recorrencia > 60) {
        console.error("❌ Validação: Meses de recorrência excede o máximo");
        toast({
          title: "Erro de validação",
          description:
            "O período máximo para lançamentos recorrentes é de 60 meses.",
          variant: "destructive",
        });
        return { isValid: false, valorNumerico: null };
      }
    }

    console.log("✅ Validação: Formulário válido!");
    return { isValid: true, valorNumerico };
  };

  return { validateForm };
};
