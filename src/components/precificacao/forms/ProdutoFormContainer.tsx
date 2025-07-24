import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Save, ArrowLeft } from "lucide-react";
import ProdutoFormFields from "./ProdutoFormFields";
import CustosManager from "./CustosManager";
import TaxasAdicionaisManager from "./TaxasAdicionaisManager";
import ProdutoCalculationsResults from "./ProdutoCalculationsResults";
import { useProdutoForm } from "@/hooks/useProdutoForm";


interface Precificacao {
  id: string;
  [key: string]: any;
}

interface ProdutoFormContainerProps {
  editingItem?: Precificacao | null;
  onCancelEdit?: () => void;
  onSaveSuccess?: () => void;
}

const ProdutoFormContainer: React.FC<ProdutoFormContainerProps> = ({
  editingItem,
  onCancelEdit,
  onSaveSuccess,
}) => {
  const {
    produtoData,
    custos,
    setCustos,
    taxasAdicionais,
    setTaxasAdicionais,
    loading,
    custoTotal,
    totalTaxasPercentual,
    precoFinal,
    lucroValor,
    valorTaxas,
    handleUpdateProduto,
    handleSubmit,
    handleCancel,
  } = useProdutoForm(editingItem, onCancelEdit, onSaveSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {editingItem && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancelar Edição
          </Button>
          <div>
            <h3 className="font-semibold text-blue-800">
              Editando: {editingItem.nome}
            </h3>
            <p className="text-sm text-blue-600">
              Modifique os campos e clique em "Salvar Alterações"
            </p>
          </div>
        </div>
      )}

      <ProdutoFormFields
        produtoData={produtoData}
        onUpdateProduto={handleUpdateProduto}
      />

      <CustosManager custos={custos} onUpdateCustos={setCustos} />

      <TaxasAdicionaisManager
        taxasAdicionais={taxasAdicionais}
        onUpdateTaxas={setTaxasAdicionais}
      />

      <ProdutoCalculationsResults
        custoTotal={custoTotal}
        margemLucro={produtoData.margemLucro}
        totalTaxasPercentual={totalTaxasPercentual}
        precoFinal={precoFinal}
        lucroValor={lucroValor}
        valorTaxas={valorTaxas}
      />

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
        >
          {editingItem ? (
            <Save className="w-4 h-4 mr-2" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {loading
            ? "Salvando..."
            : editingItem
              ? "Salvar Alterações"
              : "Cadastrar Produto"}
        </Button>

        {editingItem && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProdutoFormContainer;
