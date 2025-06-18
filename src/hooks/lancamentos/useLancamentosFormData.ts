
import { useState, useCallback } from 'react';
import type { FormData, LancamentoComRelacoes } from '@/types/lancamentosForm';
import { formatNumberToInput } from '@/utils/currency';

const getInitialFormData = (): FormData => ({
  data: new Date().toISOString().split('T')[0],
  tipo: 'receita',
  categoria: '',
  valor: '0,00',
  cliente_id: '',
  fornecedor_id: '',
  observacoes: '',
  recorrente: false,
  meses_recorrencia: null,
});

export const useLancamentosFormData = (editingLancamento: LancamentoComRelacoes | null) => {
  const [formData, setFormData] = useState<FormData>(getInitialFormData);

  const loadFormData = useCallback((lancamento: LancamentoComRelacoes) => {
    console.log('FormData: 📝 Carregando dados do lançamento para edição:', lancamento);
    
    // Garantir que o valor seja formatado corretamente
    const valorFormatado = formatNumberToInput(lancamento.valor);
    console.log('FormData: 💰 Valor original:', lancamento.valor, 'formatado:', valorFormatado);
    
    const loadedData: FormData = {
      data: lancamento.data,
      tipo: lancamento.tipo,
      categoria: lancamento.categoria,
      valor: valorFormatado,
      cliente_id: lancamento.cliente_id || '',
      fornecedor_id: lancamento.fornecedor_id || '',
      observacoes: lancamento.observacoes || '',
      recorrente: lancamento.recorrente || false,
      meses_recorrencia: lancamento.meses_recorrencia || null,
    };
    
    console.log('FormData: ✅ Dados processados para carregamento:', loadedData);
    setFormData(loadedData);
  }, []);

  const resetForm = useCallback(() => {
    console.log('FormData: 🔄 Resetando formulário');
    const initialData = getInitialFormData();
    console.log('FormData: 📋 Dados iniciais:', initialData);
    setFormData(initialData);
  }, []);

  const updateFormField = useCallback((field: keyof FormData, value: string | boolean | number | null) => {
    console.log('FormData: 🔧 Atualizando campo', field, 'com valor:', value);
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      console.log('FormData: 📊 Estado atualizado:', updated);
      return updated;
    });
  }, []);

  return {
    formData,
    setFormData,
    loadFormData,
    resetForm,
    updateFormField,
  };
};
