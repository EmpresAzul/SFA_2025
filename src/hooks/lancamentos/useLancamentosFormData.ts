import { useState, useCallback } from "react";
import type { FormData, LancamentoComRelacoes } from "@/types/lancamentosForm";
import { formatNumberToInput } from "@/utils/currency";

const getInitialFormData = (): FormData => ({
  data: new Date().toISOString().split("T")[0],
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
  const [formData, setFormData] = useState<FormData>(getInitialFormData);

  const loadFormData = useCallback((lancamento: LancamentoComRelacoes) => {
    // Garantir que o valor seja formatado corretamente
    const valorFormatado = formatNumberToInput(lancamento.valor);

    const loadedData: FormData = {
      data: lancamento.data,
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
    (field: keyof FormData, value: string | boolean | number | null) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  return {
    formData,
    setFormData,
    loadFormData,
    resetForm,
    updateFormField,
  };
};
