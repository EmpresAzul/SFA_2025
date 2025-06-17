
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

      console.log('FormSubmit: Dados do lançamento a serem salvos:', lancamentoData);

      if (editingLancamento) {
        console.log('FormSubmit: Atualizando lançamento existente ID:', editingLancamento.id);
        
        // Incluir ID para atualização e remover campos que não devem ser atualizados
        const updateData = {
          id: editingLancamento.id,
          data: lancamentoData.data,
          tipo: lancamentoData.tipo,
          categoria: lancamentoData.categoria,
          valor: lancamentoData.valor,
          cliente_id: lancamentoData.cliente_id,
          fornecedor_id: lancamentoData.fornecedor_id,
          observacoes: lancamentoData.observacoes,
          recorrente: lancamentoData.recorrente,
          meses_recorrencia: lancamentoData.meses_recorrencia
        };
        
        console.log('FormSubmit: Dados para atualização (sem user_id e status):', updateData);
        
        const result = await updateLancamento.mutateAsync(updateData);
        console.log('FormSubmit: Resultado da atualização:', result);
        
        toast({
          title: "Sucesso!",
          description: "Lançamento atualizado com sucesso.",
        });
      } else {
        console.log('FormSubmit: Criando novo lançamento');
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

      resetForm();
      setEditingLancamento(null);
      setActiveTab('lista');
    } catch (error: any) {
      console.error('FormSubmit: Erro ao salvar lançamento:', error);
      console.error('FormSubmit: Detalhes do erro:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar o lançamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { submitForm };
};
