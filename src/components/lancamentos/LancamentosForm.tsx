import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Plus, AlertTriangle } from "lucide-react";
import type { Lancamento } from "@/hooks/useLancamentos";
import type { Cadastro } from "@/hooks/useCadastros";
import { useLancamentosForm } from "@/hooks/useLancamentosForm";
import LancamentosFormFields from "./form/LancamentosFormFields";

interface LancamentosFormProps {
  editingLancamento: Lancamento | null;
  onCancelEdit: () => void;
  onSaveSuccess: () => void;
  clientes: Cadastro[];
  fornecedores: Cadastro[];
  createLancamento: any;
  updateLancamento: any;
}

// Interfaces removidas - usando tipos do useLancamentosForm

const LancamentosForm: React.FC<LancamentosFormProps> = ({
  editingLancamento,
  onCancelEdit,
  onSaveSuccess,
  clientes,
  fornecedores,
  createLancamento,
  updateLancamento,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const {
    formData,
    setFormData,
    handleSubmit,
    handleCancel,
  } = useLancamentosForm({
    createLancamento,
    updateLancamento,
    editingLancamento,
    setLoading: setIsSubmitting,
    setActiveTab: () => onSaveSuccess(),
    setEditingLancamento: () => onCancelEdit(),
  });

  // Lógica do formulário agora é gerenciada pelo hook useLancamentosForm



  // Fallback para erro
  if (hasError) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erro ao carregar formulário
          </h3>
          <p className="text-gray-500 text-center mb-6">
            Ocorreu um erro ao carregar os dados do formulário.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          {editingLancamento ? "Editar Lançamento" : "Novo Lançamento"}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Preencha os dados do lançamento financeiro. Os campos marcados com * são obrigatórios.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <LancamentosFormFields
            formData={formData}
            setFormData={setFormData}
            clientes={clientes}
            fornecedores={fornecedores}
          />

          {/* Ações */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  {editingLancamento ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingLancamento ? "Atualizar" : "Criar"} Lançamento
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LancamentosForm;
