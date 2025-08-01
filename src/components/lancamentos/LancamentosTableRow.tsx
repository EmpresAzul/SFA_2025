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
    <TableRow className="hover:bg-gray-50 h-10">
      <TableCell className="py-1">
        <div className="flex items-center gap-1">
          {getTipoIcon(lancamento.tipo)}
          <Badge className={`text-xs px-1.5 py-0.5 ${
            lancamento.tipo === 'receita' 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}>
            {lancamento.tipo === 'receita' ? 'R' : 'D'}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="py-1 text-xs max-w-[200px] truncate">
        {lancamento.observacoes || 'Sem observações'}
      </TableCell>
      <TableCell className="py-1">
        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
          {lancamento.categoria?.substring(0, 20) || 'Sem categoria'}
        </Badge>
      </TableCell>
      <TableCell className={`py-1 text-right text-xs ${
        lancamento.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
      }`}>
        {formatCurrency(lancamento.valor)}
      </TableCell>
      <TableCell className="text-gray-600 py-1 text-xs">
        {formatDate(lancamento.data)}
      </TableCell>
      <TableCell className="py-1">
        <div className="flex items-center justify-end gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(lancamento)}
            className="h-6 w-6 p-0 hover:bg-blue-100"
          >
            <Eye className="h-3 w-3 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(lancamento)}
            className="h-6 w-6 p-0 hover:bg-green-100"
          >
            <Edit className="h-3 w-3 text-green-600" />
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