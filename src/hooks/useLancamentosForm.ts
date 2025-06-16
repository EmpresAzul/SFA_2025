
import { useState } from 'react';
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

  const resetForm = () => {
    setFormData({
      data: new Date().toISOString().split('T')[0],
      tipo: 'receita',
      valor: '',
      cliente_id: '',
      fornecedor_id: '',
      categoria: '',
      observacoes: ''
    });
    setEditingLancamento(null);
  };

  const loadFormData = (lancamento: LancamentoComRelacoes) => {
    setFormData({
      data: lancamento.data,
      tipo: lancamento.tipo,
      valor: lancamento.valor.toString(),
      cliente_id: lancamento.cliente_id || '',
      fornecedor_id: lancamento.fornecedor_id || '',
      categoria: lancamento.categoria,
      observacoes: lancamento.observacoes || ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
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
        valor: parseFloat(formData.valor),
        cliente_id: formData.cliente_id || undefined,
        fornecedor_id: formData.fornecedor_id || undefined,
        observacoes: formData.observacoes.trim() || undefined,
        user_id: user!.id,
        status: 'ativo'
      };

      console.log('Dados do lançamento a serem salvos:', lancamentoData);

      if (editingLancamento) {
        await updateLancamento.mutateAsync({ id: editingLancamento.id, ...lancamentoData });
      } else {
        await createLancamento.mutateAsync(lancamentoData);
      }

      resetForm();
      setActiveTab('lista');
    } catch (error: any) {
      console.error('Erro ao salvar lançamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
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
