
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { FormData, LancamentoComRelacoes, LancamentoFormParams } from '@/types/lancamentosForm';

export const useLancamentosFormSubmit = ({
  createLancamento,
  updateLancamento,
  setLoading,
  setActiveTab,
  setEditingLancamento
}: Omit<LancamentoFormParams, 'editingLancamento'>) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const submitForm = async (
    formData: FormData,
    valorNumerico: number,
    editingLancamento: LancamentoComRelacoes | null,
    resetForm: () => void
  ) => {
    console.log('FormSubmit: Iniciando submissão do formulário');
    console.log('FormSubmit: Dados do formulário:', formData);
    console.log('FormSubmit: Valor numérico calculado:', valorNumerico);
    console.log('FormSubmit: Modo edição:', !!editingLancamento);
    console.log('FormSubmit: ID do lançamento (se editando):', editingLancamento?.id);

    if (!user) {
      console.error('FormSubmit: Usuário não autenticado');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    console.log('FormSubmit: Usuário autenticado:', user.id);
    setLoading(true);

    try {
      if (editingLancamento) {
        console.log('FormSubmit: Atualizando lançamento existente');
        
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
          meses_recorrencia: formData.recorrente ? formData.meses_recorrencia : null
        };
        
        console.log('FormSubmit: Dados para atualização:', updateData);
        
        const result = await updateLancamento.mutateAsync(updateData);
        console.log('FormSubmit: Resultado da atualização:', result);
        
        toast({
          title: "Sucesso!",
          description: "Lançamento atualizado com sucesso.",
        });
      } else {
        console.log('FormSubmit: Criando novo lançamento');
        
        const lancamentoData = {
          data: formData.data,
          tipo: formData.tipo,
          categoria: formData.categoria,
          valor: valorNumerico,
          cliente_id: formData.cliente_id || null,
          fornecedor_id: formData.fornecedor_id || null,
          observacoes: formData.observacoes.trim() || null,
          user_id: user.id,
          status: 'ativo',
          recorrente: formData.recorrente,
          meses_recorrencia: formData.recorrente ? formData.meses_recorrencia : null,
          lancamento_pai_id: null
        };

        console.log('FormSubmit: Dados do novo lançamento:', lancamentoData);
        
        const result = await createLancamento.mutateAsync(lancamentoData);
        console.log('FormSubmit: Resultado da criação:', result);
        
        const mensagem = formData.recorrente && formData.meses_recorrencia 
          ? `Lançamento recorrente criado com sucesso! Serão criados ${formData.meses_recorrencia} lançamentos nos próximos meses.`
          : "Lançamento criado com sucesso.";
        
        toast({
          title: "Sucesso!",
          description: mensagem,
        });
      }

      console.log('FormSubmit: Operação concluída com sucesso, limpando formulário');
      resetForm();
      setEditingLancamento(null);
      setActiveTab('lista');
    } catch (error: any) {
      console.error('FormSubmit: Erro ao salvar lançamento:', error);
      console.error('FormSubmit: Detalhes do erro:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        stack: error?.stack
      });
      
      const errorMessage = error?.message || "Ocorreu um erro ao salvar o lançamento.";
      
      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      console.log('FormSubmit: Finalizando operação, removendo loading');
      setLoading(false);
    }
  };

  return { submitForm };
};
