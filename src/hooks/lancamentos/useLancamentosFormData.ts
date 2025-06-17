
import { useState } from 'react';
import type { FormData, LancamentoComRelacoes } from '@/types/lancamentosForm';

export const useLancamentosFormData = (editingLancamento: LancamentoComRelacoes | null) => {
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
    console.log('FormData: Carregando dados para edição:', lancamento);
    
    const newFormData = {
      data: lancamento.data,
      tipo: lancamento.tipo,
      valor: lancamento.valor ? lancamento.valor.toString().replace('.', ',') : '',
      cliente_id: lancamento.cliente_id || '',
      fornecedor_id: lancamento.fornecedor_id || '',
      categoria: lancamento.categoria,
      observacoes: lancamento.observacoes || ''
    };
    
    console.log('FormData: Dados carregados para o form:', newFormData);
    setFormData(newFormData);
  };

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
    
    console.log('FormData: Resetando formulário para:', initialFormData);
    setFormData(initialFormData);
  };

  return {
    formData,
    setFormData,
    loadFormData,
    resetForm
  };
};
