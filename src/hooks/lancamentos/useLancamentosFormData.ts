
import React, { useState, useCallback } from "react";
import type { LancamentoFormData, LancamentoComRelacoes } from "@/types/lancamentosForm";
import { formatNumberToInput } from "@/utils/currency";

const getInitialFormData = (): LancamentoFormData => ({
  descricao: "",
  data: new Date().toISOString().split("T")[0],
  data_vencimento: new Date().toISOString().split("T")[0],
  data_recebimento: new Date().toISOString().split("T")[0],
  tipo: "receita",
  categoria: "",
  valor: "0,00",
  cliente_id: "",
  fornecedor_id: "",
  observacoes: "",
  recorrente: false,
  meses_recorrencia: null,
});

export const useLancamentosFormData = (
  editingLancamento: LancamentoComRelacoes | null,
) => {
  const [formData, setFormData] = useState<LancamentoFormData>(() => {
    if (editingLancamento) {
      const valorFormatado = formatNumberToInput(editingLancamento.valor);
      return {
        descricao: editingLancamento.descricao || "",
        data: editingLancamento.data,
        data_vencimento: (editingLancamento as any).data_vencimento || editingLancamento.data,
        data_recebimento: (editingLancamento as any).data_recebimento || editingLancamento.data,
        tipo: editingLancamento.tipo,
        categoria: editingLancamento.categoria,
        valor: valorFormatado,
        cliente_id: editingLancamento.cliente_id || "",
        fornecedor_id: editingLancamento.fornecedor_id || "",
        observacoes: editingLancamento.observacoes || "",
        recorrente: editingLancamento.recorrente || false,
        meses_recorrencia: editingLancamento.meses_recorrencia || null,
      };
    }
    return getInitialFormData();
  });

  const loadFormData = useCallback((lancamento: LancamentoComRelacoes) => {
    // Garantir que o valor seja formatado corretamente
    const valorFormatado = formatNumberToInput(lancamento.valor);

    const loadedData: LancamentoFormData = {
      descricao: lancamento.descricao || "",
      data: lancamento.data,
      data_vencimento: (lancamento as any).data_vencimento || lancamento.data,
      data_recebimento: (lancamento as any).data_recebimento || lancamento.data,
      tipo: lancamento.tipo,
      categoria: lancamento.categoria,
      valor: valorFormatado,
      cliente_id: lancamento.cliente_id || "",
      fornecedor_id: lancamento.fornecedor_id || "",
      observacoes: lancamento.observacoes || "",
      recorrente: lancamento.recorrente || false,
      meses_recorrencia: lancamento.meses_recorrencia || null,
    };

    setFormData(loadedData);
  }, []);

  const resetForm = useCallback(() => {
    const initialData = getInitialFormData();
    setFormData(initialData);
  }, []);

  const updateFormField = useCallback(
    (field: keyof LancamentoFormData, value: string | boolean | number | null) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  // Efeito para carregar dados quando editingLancamento mudar
  React.useEffect(() => {
    if (editingLancamento) {
      loadFormData(editingLancamento);
    } else {
      resetForm();
    }
  }, [editingLancamento, loadFormData, resetForm]);

  return {
    formData,
    setFormData,
    loadFormData,
    resetForm,
    updateFormField,
  };
};
