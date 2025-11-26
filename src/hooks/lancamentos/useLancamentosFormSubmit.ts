
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { criarLancamentosRecorrentes } from "./lancamentosUtils";
import type {
  LancamentoFormData,
  LancamentoComRelacoes,
  LancamentoFormParams,
} from "@/types/lancamentosForm";

export const useLancamentosFormSubmit = ({
  createLancamento,
  updateLancamento,
  setLoading,
  setActiveTab,
  setEditingLancamento,
}: Omit<LancamentoFormParams, "editingLancamento">) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const submitForm = async (
    formData: LancamentoFormData,
    valorNumerico: number,
    editingLancamento: LancamentoComRelacoes | null,
    resetForm: () => void,
  ) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (editingLancamento) {
        // Dados para atualização - apenas campos editáveis
        const updateData = {
          id: editingLancamento.id,
          data: formData.data,
          tipo: formData.tipo,
          categoria: formData.categoria,
          valor: valorNumerico,
          descricao: formData.observacoes?.trim() || `${formData.tipo} - ${formData.categoria}`,
          cliente_id: formData.cliente_id || null,
          fornecedor_id: formData.fornecedor_id || null,
          observacoes: formData.observacoes?.trim() || null,
        };

        await updateLancamento.mutateAsync(updateData);

        toast({
          title: "✅ Lançamento Atualizado!",
          description: `${formData.tipo === 'receita' ? 'Receita' : 'Despesa'} de ${formData.categoria} foi atualizada com sucesso.`,
          duration: 4000,
        });
      } else {
        const lancamentoData = {
          data: formData.data,
          tipo: formData.tipo,
          categoria: formData.categoria,
          valor: valorNumerico,
          descricao: formData.observacoes?.trim() || `${formData.tipo} - ${formData.categoria}`,
          cliente_id: formData.cliente_id || null,
          fornecedor_id: formData.fornecedor_id || null,
          observacoes: formData.observacoes?.trim() || null,
          user_id: user.id,
          status: "confirmado",
          recorrente: formData.recorrente || false,
          meses_recorrencia: formData.meses_recorrencia || null,
        };

        // Se for recorrente, usar função especial
        if (formData.recorrente && formData.meses_recorrencia && formData.meses_recorrencia > 0) {
          await criarLancamentosRecorrentes(lancamentoData, formData.meses_recorrencia);
          toast({
            title: "✅ Lançamentos Recorrentes Criados!",
            description: `${formData.meses_recorrencia} lançamentos mensais foram criados com sucesso.`,
            duration: 5000,
          });
        } else {
          await createLancamento.mutateAsync(lancamentoData);
          
          toast({
            title: "✅ Lançamento Salvo!",
            description: `${formData.tipo === 'receita' ? 'Receita' : 'Despesa'} de ${formData.categoria} no valor de R$ ${valorNumerico.toFixed(2).replace('.', ',')} foi registrada.`,
            duration: 4000,
          });
        }
      }

      resetForm();
      setEditingLancamento(null);
      setActiveTab("lista");
    } catch (error: unknown) {
      console.error('Erro ao salvar lançamento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao salvar lançamento';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { submitForm };
};
