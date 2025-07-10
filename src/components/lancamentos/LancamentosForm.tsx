
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LancamentosFormFields from "./form/LancamentosFormFields";
import LancamentosFormActions from "./form/LancamentosFormActions";
import type { LancamentoFormData, LancamentoComRelacoes } from "@/types/lancamentosForm";
import type { Cadastro } from "@/hooks/useCadastros";

interface LancamentosFormProps {
  formData: LancamentoFormData;
  setFormData: (data: LancamentoFormData) => void;
  editingLancamento: LancamentoComRelacoes | null;
  loading: boolean;
  clientes: Cadastro[];
  fornecedores: Cadastro[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const LancamentosForm: React.FC<LancamentosFormProps> = ({
  formData,
  setFormData,
  editingLancamento,
  loading,
  clientes,
  fornecedores,
  onSubmit,
  onCancel,
}) => {
  console.log("LancamentosForm: Dados atuais do formulário:", formData);
  console.log("LancamentosForm: Editando lançamento:", editingLancamento);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          {editingLancamento ? "Editar Lançamento" : "Novo Lançamento"}
        </CardTitle>
        <p className="text-sm text-gray-600">
          As categorias selecionadas alimentarão automaticamente a estrutura do
          DRE e Fluxo de Caixa
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <LancamentosFormFields
            formData={formData}
            setFormData={setFormData}
            clientes={clientes || []}
            fornecedores={fornecedores || []}
          />

          <LancamentosFormActions
            loading={loading}
            editingLancamento={editingLancamento}
            onCancel={onCancel}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default LancamentosForm;
