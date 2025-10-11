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
    <TableRow className="hover:bg-gray-50/80 active:bg-gray-100 transition-colors h-auto sm:h-14">
      {/* Tipo - Mobile compact */}
      <TableCell className="py-2 px-2 sm:px-3 md:px-4">
        <div className="flex items-center gap-1 sm:gap-2">
          {getTipoIcon(lancamento.tipo)}
          <Badge className={`text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 ${
            lancamento.tipo === 'receita' 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}>
            {lancamento.tipo === 'receita' ? 'R' : 'D'}
          </Badge>
        </div>
      </TableCell>

      {/* Descrição - Mobile responsive */}
      <TableCell className="py-2 px-2 sm:px-3 md:px-4 text-xs sm:text-sm">
        <div className="flex flex-col gap-0.5 max-w-[130px] sm:max-w-[200px]">
          <span className="truncate font-medium text-gray-900">
            {lancamento.observacoes || 'Sem observações'}
          </span>
          <span className="sm:hidden text-[10px] text-gray-500 truncate">
            {lancamento.categoria?.substring(0, 15) || 'Sem categoria'}
          </span>
          <span className="md:hidden text-[10px] text-gray-500">
            {formatDate(lancamento.data)}
          </span>
        </div>
      </TableCell>

      {/* Categoria - Hidden on mobile */}
      <TableCell className="py-2 px-2 sm:px-3 md:px-4 hidden sm:table-cell">
        <Badge variant="outline" className="text-xs px-1.5 py-0.5 truncate max-w-[150px]">
          {lancamento.categoria?.substring(0, 20) || 'Sem categoria'}
        </Badge>
      </TableCell>

      {/* Valor - Always visible */}
      <TableCell className={`py-2 px-2 sm:px-3 md:px-4 text-right text-xs sm:text-sm font-semibold ${
        lancamento.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
      }`}>
        <div className="flex flex-col items-end">
          <span>{formatCurrency(lancamento.valor)}</span>
        </div>
      </TableCell>

      {/* Data - Hidden on mobile/tablet */}
      <TableCell className="text-gray-600 py-2 px-2 sm:px-3 md:px-4 text-xs sm:text-sm hidden md:table-cell">
        {formatDate(lancamento.data)}
      </TableCell>

      {/* Ações - Touch friendly buttons */}
      <TableCell className="py-2 px-2 sm:px-3 md:px-4 sticky right-0 bg-white">
        <div className="flex items-center justify-end gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(lancamento)}
            className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-blue-50 active:bg-blue-100 transition-colors touch-target"
            aria-label="Visualizar lançamento"
          >
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(lancamento)}
            className="h-8 w-8 sm:h-9 sm:w-9 p-0 hover:bg-green-50 active:bg-green-100 transition-colors touch-target"
            aria-label="Editar lançamento"
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