import type { LancamentoFormParams } from "@/types/lancamentosForm";
import { useLancamentosFormData } from "@/hooks/lancamentos/useLancamentosFormData";
import { useLancamentosFormValidation } from "@/hooks/lancamentos/useLancamentosFormValidation";
import { useLancamentosFormSubmit } from "@/hooks/lancamentos/useLancamentosFormSubmit";

export const useLancamentosForm = ({
  createLancamento,
  updateLancamento,
  editingLancamento,
  setLoading,
  setActiveTab,
  setEditingLancamento,
}: LancamentoFormParams) => {
  const { formData, setFormData, loadFormData, resetForm } =
    useLancamentosFormData(editingLancamento);
  const { validateForm } = useLancamentosFormValidation();
  const { submitForm } = useLancamentosFormSubmit({
    createLancamento,
    updateLancamento,
    setLoading,
    setActiveTab,
    setEditingLancamento,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm(formData);
    if (!validation.isValid || !validation.valorNumerico) {
      return;
    }

    await submitForm(
      formData,
      validation.valorNumerico,
      editingLancamento,
      resetForm,
    );
  };

  const handleCancel = () => {
    resetForm();
    setEditingLancamento(null);
    setActiveTab("lista");
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
