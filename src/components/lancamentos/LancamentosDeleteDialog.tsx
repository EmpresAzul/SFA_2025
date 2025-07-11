import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import type { Lancamento } from "@/hooks/useLancamentos";

interface LancamentosDeleteDialogProps {
  lancamento: Lancamento;
  onDelete: (id: string) => void;
}

const LancamentosDeleteDialog: React.FC<LancamentosDeleteDialogProps> = ({
  lancamento,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-lg font-bold text-red-600">
            <Trash2 className="h-5 w-5" />
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700">
            Tem certeza que deseja excluir este lançamento?
            <br />
            <br />
            <strong>Tipo:</strong> {lancamento.tipo === 'receita' ? 'Receita' : 'Despesa'}
            <br />
            <strong>Valor:</strong> {formatCurrency(lancamento.valor)}
            <br />
            <strong>Data:</strong> {formatDate(lancamento.data)}
            <br />
            <strong>Categoria:</strong> {lancamento.categoria}
            <br />
            <br />
            <span className="text-red-600 font-medium">
              ⚠️ Esta ação não pode ser desfeita!
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-300 hover:bg-gray-50">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(lancamento.id)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Sim, Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LancamentosDeleteDialog;