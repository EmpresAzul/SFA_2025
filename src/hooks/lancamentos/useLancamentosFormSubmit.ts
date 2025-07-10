import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type {
  FormData,
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
    formData: FormData,
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
          cliente_id: formData.cliente_id || null,
          fornecedor_id: formData.fornecedor_id || null,
          observacoes: formData.observacoes.trim() || null,
          recorrente: formData.recorrente,
          meses_recorrencia: formData.recorrente
            ? formData.meses_recorrencia
            : null,
        };

        await updateLancamento.mutateAsync(updateData);

        toast({
          title: "Sucesso!",
          description: "Lançamento atualizado com sucesso.",
        });
      } else {
        const lancamentoData = {
          data: formData.data,
          tipo: formData.tipo,
          categoria: formData.categoria,
          valor: valorNumerico,
          cliente_id: formData.cliente_id || null,
          fornecedor_id: formData.fornecedor_id || null,
          observacoes: formData.observacoes.trim() || null,
          user_id: user.id,
          status: "ativo",
          recorrente: formData.recorrente,
          meses_recorrencia: formData.recorrente
            ? formData.meses_recorrencia
            : null,
          lancamento_pai_id: null,
        };

        await createLancamento.mutateAsync(lancamentoData);

        const mensagem =
          formData.recorrente && formData.meses_recorrencia
            ? `Lançamento recorrente criado com sucesso! Serão criados ${formData.meses_recorrencia} lançamentos nos próximos meses.`
            : "Lançamento criado com sucesso.";

        toast({
          title: "Sucesso!",
          description: mensagem,
        });
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
