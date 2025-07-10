import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClienteForm } from "./forms/ClienteForm";
import { FornecedorForm } from "./forms/FornecedorForm";
import { FuncionarioForm } from "./forms/FuncionarioForm";
import { EnderecoForm } from "./forms/EnderecoForm";
import { CadastroData } from "./CadastroEditModal";

interface CadastroFormProps {
  tipo: "Cliente" | "Fornecedor" | "Funcionário";
  formData: CadastroData;
  setFormData: (data: CadastroData) => void;
  editingCadastro: CadastroData | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const CadastroForm: React.FC<CadastroFormProps> = ({
  tipo,
  formData,
  setFormData,
  editingCadastro,
  loading,
  onSubmit,
  onCancel,
}) => {
  const renderFormFields = () => {
    switch (tipo) {
      case "Cliente":
        return <ClienteForm formData={formData} setFormData={setFormData} />;
      case "Fornecedor":
        return <FornecedorForm formData={formData} setFormData={setFormData} />;
      case "Funcionário":
        return (
          <FuncionarioForm formData={formData} setFormData={setFormData} />
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingCadastro ? `Editar ${tipo}` : `Novo ${tipo}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderFormFields()}
          </div>

          <EnderecoForm formData={formData} setFormData={setFormData} />

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) =>
                setFormData({ ...formData, observacoes: e.target.value })
              }
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
            >
              {loading
                ? "Salvando..."
                : editingCadastro
                  ? "Atualizar"
                  : "Salvar"}
            </Button>
            {editingCadastro && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
