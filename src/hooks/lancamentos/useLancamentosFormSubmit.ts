
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
        
        // Dados SIMPLIFICADOS para atualização
        const updateData: any = {
          id: editingLancamento.id,
          data: formData.data,
          tipo: formData.tipo,
          categoria: formData.categoria,
          valor: valorNumerico,
        };

        // Campos opcionais
        if (formData.observacoes?.trim()) {
          updateData.observacoes = formData.observacoes.trim();
          updateData.descricao = formData.observacoes.trim();
        }
        if (formData.cliente_id) updateData.cliente_id = formData.cliente_id;
        if (formData.fornecedor_id) updateData.fornecedor_id = formData.fornecedor_id;

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
        
        // Dados SIMPLIFICADOS - apenas campos essenciais
        const lancamentoData: any = {
          data: formData.data,
          tipo: formData.tipo,
          categoria: formData.categoria,
          valor: valorNumerico,
          user_id: user.id,
          status: "confirmado",
        };

        // Adicionar campos opcionais apenas se preenchidos
        if (formData.observacoes?.trim()) {
          lancamentoData.observacoes = formData.observacoes.trim();
          lancamentoData.descricao = formData.observacoes.trim();
        }
        if (formData.cliente_id) lancamentoData.cliente_id = formData.cliente_id;
        if (formData.fornecedor_id) lancamentoData.fornecedor_id = formData.fornecedor_id;

        console.log("📦 submitForm: Dados do lançamento preparados:", lancamentoData);
        console.log("📤 submitForm: Enviando lançamento único");
        
        await createLancamento.mutateAsync(lancamentoData);
        console.log("✅ submitForm: Lançamento único criado");
        
        toast({
          title: "✅ Lançamento Salvo!",
          description: `${formData.tipo === 'receita' ? 'Receita' : 'Despesa'} de ${formData.categoria} no valor de R$ ${valorNumerico.toFixed(2).replace('.', ',')} foi registrada.`,
          duration: 4000,
        });
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
