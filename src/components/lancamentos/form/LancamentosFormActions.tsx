import React from "react";
import { Button } from "@/components/ui/button";
import type { LancamentoComRelacoes } from "@/types/lancamentosForm";

interface LancamentosFormActionsProps {
  loading: boolean;
  editingLancamento: LancamentoComRelacoes | null;
  onCancel: () => void;
}

const LancamentosFormActions: React.FC<LancamentosFormActionsProps> = ({
  loading,
  editingLancamento,
  onCancel,
}) => {
  return (
    <div className="flex gap-2">
      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
      >
        {loading
          ? "Salvando..."
          : editingLancamento
            ? "Atualizar Lançamento"
            : "Cadastrar Lançamento"}
      </Button>
      {editingLancamento && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      )}
    </div>
  );
};

export default LancamentosFormActions;
