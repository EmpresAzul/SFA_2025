
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
    console.log("🚀 submitForm: Iniciando submit");
    console.log("📋 submitForm: FormData:", formData);
    console.log("💰 submitForm: Valor numérico:", valorNumerico);
    console.log("✏️ submitForm: Editando?", !!editingLancamento);
    
    if (!user) {
      console.error("❌ submitForm: Usuário não autenticado");
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    console.log("👤 submitForm: User ID:", user.id);
    setLoading(true);

    try {
      if (editingLancamento) {
        console.log("✏️ submitForm: Modo EDIÇÃO");
        // Dados para atualização - apenas campos editáveis
        const updateData = {
          id: editingLancamento.id,
          data: formData.data,
          data_vencimento: formData.tipo === 'despesa' ? (formData.data_vencimento || formData.data) : null,
          data_recebimento: formData.tipo === 'receita' ? (formData.data_recebimento || formData.data) : null,
          tipo: formData.tipo,
          categoria: formData.categoria,
          valor: valorNumerico,
          descricao: formData.observacoes?.trim() || `${formData.tipo} - ${formData.categoria}`,
          cliente_id: formData.cliente_id || null,
          fornecedor_id: formData.fornecedor_id || null,
          observacoes: formData.observacoes?.trim() || null,
        };

        console.log("📤 submitForm: Enviando update:", updateData);
        await updateLancamento.mutateAsync(updateData);

        console.log("✅ submitForm: Update concluído com sucesso");
        toast({
          title: "✅ Lançamento Atualizado!",
          description: `${formData.tipo === 'receita' ? 'Receita' : 'Despesa'} de ${formData.categoria} foi atualizada com sucesso.`,
          duration: 4000,
        });
      } else {
        console.log("➕ submitForm: Modo CRIAÇÃO");
        const lancamentoData = {
          data: formData.data,
          data_vencimento: formData.tipo === 'despesa' ? (formData.data_vencimento || formData.data) : null,
          data_recebimento: formData.tipo === 'receita' ? (formData.data_recebimento || formData.data) : null,
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

        console.log("📦 submitForm: Dados do lançamento preparados:", lancamentoData);
        
        // Se for recorrente, usar função especial
        if (formData.recorrente && formData.meses_recorrencia && formData.meses_recorrencia > 0) {
          console.log("🔄 submitForm: Criando lançamentos recorrentes");
          await criarLancamentosRecorrentes(lancamentoData, formData.meses_recorrencia);
          console.log("✅ submitForm: Lançamentos recorrentes criados");
          toast({
            title: "✅ Lançamentos Recorrentes Criados!",
            description: `${formData.meses_recorrencia} lançamentos mensais foram criados com sucesso.`,
            duration: 5000,
          });
        } else {
          console.log("📤 submitForm: Enviando lançamento único");
          await createLancamento.mutateAsync(lancamentoData);
          console.log("✅ submitForm: Lançamento único criado");
          
          toast({
            title: "✅ Lançamento Salvo!",
            description: `${formData.tipo === 'receita' ? 'Receita' : 'Despesa'} de ${formData.categoria} no valor de R$ ${valorNumerico.toFixed(2).replace('.', ',')} foi registrada.`,
            duration: 4000,
          });
        }
      }

      console.log("🔄 submitForm: Resetando formulário");
      resetForm();
      setEditingLancamento(null);
      console.log("🔄 submitForm: Redirecionando para lista");
      setActiveTab("lista");
      console.log("✅ submitForm: Submit concluído com sucesso!");
    } catch (error: unknown) {
      console.error('❌ submitForm: ERRO ao salvar lançamento:', error);
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
