import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import LancamentosDeleteDialog from "./LancamentosDeleteDialog";
import type { Lancamento } from "@/hooks/useLancamentos";

interface LancamentosTableRowProps {
  lancamento: Lancamento;
  onView: (item: Lancamento) => void;
  onEdit: (item: Lancamento) => void;
  onDelete: (id: string) => void;
}

const LancamentosTableRow: React.FC<LancamentosTableRowProps> = ({
  lancamento,
  onView,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === 'receita' ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === 'receita' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        Receita
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
        Despesa
      </Badge>
    );
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <div className="flex items-center gap-2">
          {getTipoIcon(lancamento.tipo)}
          {getTipoBadge(lancamento.tipo)}
        </div>
      </TableCell>
      <TableCell className="font-medium">
        {lancamento.observacoes || 'Sem observações'}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {lancamento.categoria || 'Sem categoria'}
        </Badge>
      </TableCell>
      <TableCell className={`font-semibold ${
        lancamento.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
      }`}>
        {formatCurrency(lancamento.valor)}
      </TableCell>
      <TableCell className="text-gray-600">
        {formatDate(lancamento.data)}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(lancamento)}
            className="h-8 w-8 p-0 hover:bg-blue-100"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(lancamento)}
            className="h-8 w-8 p-0 hover:bg-green-100"
          >
            <Edit className="h-4 w-4 text-green-600" />
          </Button>
          
          <LancamentosDeleteDialog 
            lancamento={lancamento}
            onDelete={onDelete}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default LancamentosTableRow;