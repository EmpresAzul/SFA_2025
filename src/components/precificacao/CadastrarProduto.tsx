import React from "react";
import ProdutoFormContainer from "./forms/ProdutoFormContainer";

interface Precificacao {
  id: string;
  [key: string]: any;
}

interface CadastrarProdutoProps {
  editingItem?: Precificacao | null;
  onCancelEdit?: () => void;
  onSaveSuccess?: () => void;
}

const CadastrarProduto: React.FC<CadastrarProdutoProps> = ({
  editingItem,
  onCancelEdit,
  onSaveSuccess,
}) => {
  return (
    <ProdutoFormContainer
      editingItem={editingItem}
      onCancelEdit={onCancelEdit}
      onSaveSuccess={onSaveSuccess}
    />
  );
};

export default CadastrarProduto;
