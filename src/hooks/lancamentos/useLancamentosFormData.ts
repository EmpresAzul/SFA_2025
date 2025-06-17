
import { useState, useCallback } from 'react';
import type { FormData, LancamentoComRelacoes } from '@/types/lancamentosForm';
import { formatNumberToInput, parseStringToNumber } from '@/utils/currency';

const getInitialFormData = (): FormData => ({
  data: new Date().toISOString().split('T')[0],
  tipo: 'receita',
  categoria: '',
  valor: '0,00',
  cliente_id: '',
  fornecedor_id: '',
  observacoes: '',
});

export const useLancamentosFormData = (editingLancamento: LancamentoComRelacoes | null) => {
  const [formData, setFormData] = useState<FormData>(getInitialFormData);

  const loadFormData = useCallback((lancamento: LancamentoComRelacoes) => {
    console.log('FormData: Carregando dados do lançamento:', lancamento);
    
    // Garantir que o valor seja formatado corretamente
    const valorFormatado = formatNumberToInput(lancamento.valor);
    
    const loadedData: FormData = {
      data: lancamento.data,
      tipo: lancamento.tipo,
      categoria: lancamento.categoria,
      valor: valorFormatado,
      cliente_id: lancamento.cliente_id || '',
      fornecedor_id: lancamento.fornecedor_id || '',
      observacoes: lancamento.observacoes || '',
    };
    
    console.log('FormData: Dados processados para carregamento:', loadedData);
    console.log('FormData: Valor formatado:', valorFormatado);
    setFormData(loadedData);
  }, []);

  const resetForm = useCallback(() => {
    console.log('FormData: Resetando formulário');
    setFormData(getInitialFormData());
  }, []);

  const updateFormField = useCallback((field: keyof FormData, value: string) => {
    console.log('FormData: Atualizando campo', field, 'com valor:', value);
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      console.log('FormData: Estado atualizado:', updated);
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
