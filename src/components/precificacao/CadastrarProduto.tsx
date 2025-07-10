import React from "react";
import ProdutoFormContainer from "./forms/ProdutoFormContainer";
import type { Database } from "@/integrations/supabase/types";

type Precificacao = Database["public"]["Tables"]["precificacao"]["Row"];

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
