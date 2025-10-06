import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LancamentosTableRow from "./LancamentosTableRow";
import LancamentosTableEmptyState from "./LancamentosTableEmptyState";
import LancamentosPagination from "./LancamentosPagination";
import type { Lancamento } from "@/hooks/useLancamentos";

interface LancamentosTableProps {
  data: Lancamento[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onView: (item: Lancamento) => void;
  onEdit: (item: Lancamento) => void;
  onDelete: (id: string) => void;
}

const LancamentosTable: React.FC<LancamentosTableProps> = ({
  data,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onView,
  onEdit,
  onDelete,
}) => {
  console.log("📊 LancamentosTable: Renderizando com", data.length, "itens de", totalItems, "total");
  
  if (!data || data.length === 0) {
    console.log("⚠️ LancamentosTable: Exibindo estado vazio");
    return <LancamentosTableEmptyState />;
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-800">
          Lista de Lançamentos ({totalItems})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 h-10">
                <TableHead className="text-gray-700 text-xs py-1">Tipo</TableHead>
                <TableHead className="text-gray-700 text-xs py-1">Descrição</TableHead>
                <TableHead className="text-gray-700 text-xs py-1">Categoria</TableHead>
                <TableHead className="text-gray-700 text-xs py-1 text-right">Valor</TableHead>
                <TableHead className="text-gray-700 text-xs py-1">Data</TableHead>
                <TableHead className="text-gray-700 text-xs py-1 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((lancamento) => (
                <LancamentosTableRow
                  key={lancamento.id}
                  lancamento={lancamento}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Paginação */}
        <LancamentosPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </CardContent>
    </Card>
  );
};

export default LancamentosTable;
