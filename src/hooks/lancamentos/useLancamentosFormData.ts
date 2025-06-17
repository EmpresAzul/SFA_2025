
import { useState, useCallback } from 'react';
import type { FormData, LancamentoComRelacoes } from '@/types/lancamentosForm';
import { parseStringToNumber, formatNumberToInput } from '@/utils/currency';

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
    
    const loadedData: FormData = {
      data: lancamento.data,
      tipo: lancamento.tipo,
      categoria: lancamento.categoria,
      valor: typeof lancamento.valor === 'number' 
        ? formatNumberToInput(lancamento.valor) 
        : String(lancamento.valor),
      cliente_id: lancamento.cliente_id || '',
      fornecedor_id: lancamento.fornecedor_id || '',
      observacoes: lancamento.observacoes || '',
    };
    
    console.log('FormData: Dados processados para carregamento:', loadedData);
    setFormData(loadedData);
  }, []);

  const resetForm = useCallback(() => {
    console.log('FormData: Resetando formulário');
    setFormData(getInitialFormData());
  }, []);

  return {
    formData,
    setFormData,
    loadFormData,
    resetForm,
  };
};
