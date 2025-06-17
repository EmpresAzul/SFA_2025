
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Lancamento } from '@/hooks/useLancamentos';

type LancamentoComRelacoes = Lancamento & {
  cliente?: { nome: string } | null;
  fornecedor?: { nome: string } | null;
};

interface FormData {
  data: string;
  tipo: 'receita' | 'despesa';
  valor: string;
  cliente_id: string;
  fornecedor_id: string;
  categoria: string;
  observacoes: string;
}

export const useLancamentosForm = (
  createLancamento: any,
  updateLancamento: any,
  editingLancamento: LancamentoComRelacoes | null,
  setLoading: (loading: boolean) => void,
  setActiveTab: (tab: string) => void,
  setEditingLancamento: (lancamento: LancamentoComRelacoes | null) => void
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    data: new Date().toISOString().split('T')[0],
    tipo: 'receita' as 'receita' | 'despesa',
    valor: '',
    cliente_id: '',
    fornecedor_id: '',
    categoria: '',
    observacoes: ''
  });

  // Função para carregar dados do lançamento para edição
  const loadFormData = (lancamento: LancamentoComRelacoes) => {
    console.log('useLancamentosForm: Carregando dados para edição:', lancamento);
    
    const newFormData = {
      data: lancamento.data,
      tipo: lancamento.tipo,
      valor: lancamento.valor.toString(), // Garantir que seja string
      cliente_id: lancamento.cliente_id || '',
      fornecedor_id: lancamento.fornecedor_id || '',
      categoria: lancamento.categoria,
      observacoes: lancamento.observacoes || ''
    };
    
    console.log('useLancamentosForm: Dados carregados:', newFormData);
    setFormData(newFormData);
  };

  // Effect para carregar dados quando há um lançamento sendo editado
  useEffect(() => {
    if (editingLancamento) {
      console.log('useLancamentosForm: useEffect - Carregando dados para edição:', editingLancamento);
      loadFormData(editingLancamento);
    } else {
      console.log('useLancamentosForm: useEffect - Nenhum lançamento sendo editado');
    }
  }, [editingLancamento]);

  const resetForm = () => {
    const initialFormData = {
      data: new Date().toISOString().split('T')[0],
      tipo: 'receita' as 'receita' | 'despesa',
      valor: '',
      cliente_id: '',
      fornecedor_id: '',
      categoria: '',
      observacoes: ''
    };
    
    console.log('useLancamentosForm: Resetando formulário para:', initialFormData);
    setFormData(initialFormData);
    setEditingLancamento(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('useLancamentosForm: Submetendo formulário com dados:', formData);
    
    if (!formData.tipo) {
      toast({
        title: "Erro",
        description: "Por favor, selecione o tipo de lançamento.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.categoria) {
      toast({
        title: "Erro",
        description: "Por favor, selecione a categoria.",
        variant: "destructive",
      });
      return;
    }

    const valorNumerico = parseFloat(formData.valor);
    console.log('useLancamentosForm: Valor original:', formData.valor, 'Valor numérico:', valorNumerico);

    if (!formData.valor || valorNumerico <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, informe um valor válido.",
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
        cliente_id: formData.cliente_id || undefined,
        fornecedor_id: formData.fornecedor_id || undefined,
        observacoes: formData.observacoes.trim() || undefined,
        user_id: user!.id,
        status: 'ativo'
      };

      console.log('useLancamentosForm: Dados do lançamento a serem salvos:', lancamentoData);

      if (editingLancamento) {
        console.log('useLancamentosForm: Atualizando lançamento existente:', editingLancamento.id);
        await updateLancamento.mutateAsync({ id: editingLancamento.id, ...lancamentoData });
        toast({
          title: "Sucesso!",
          description: "Lançamento atualizado com sucesso.",
        });
      } else {
        console.log('useLancamentosForm: Criando novo lançamento');
        await createLancamento.mutateAsync(lancamentoData);
        toast({
          title: "Sucesso!",
          description: "Lançamento criado com sucesso.",
        });
      }

      resetForm();
      setActiveTab('lista');
    } catch (error: any) {
      console.error('useLancamentosForm: Erro ao salvar lançamento:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o lançamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('useLancamentosForm: Cancelando edição/criação');
    resetForm();
    setActiveTab('lista');
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    handleCancel,
    resetForm,
    loadFormData,
  };
};
