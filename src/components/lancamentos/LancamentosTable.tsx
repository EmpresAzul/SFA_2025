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
      <CardHeader className="pb-3 p-4 sm:p-6">
        <CardTitle className="text-sm sm:text-base font-semibold text-gray-800">
          Lista de Lançamentos ({totalItems})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 h-10 sm:h-12">
                <TableHead className="text-gray-700 text-xs sm:text-sm py-2 px-2 sm:px-4">Tipo</TableHead>
                <TableHead className="text-gray-700 text-xs sm:text-sm py-2 px-2 sm:px-4 min-w-[150px]">Descrição</TableHead>
                <TableHead className="text-gray-700 text-xs sm:text-sm py-2 px-2 sm:px-4 hidden sm:table-cell">Categoria</TableHead>
                <TableHead className="text-gray-700 text-xs sm:text-sm py-2 px-2 sm:px-4 text-right">Valor</TableHead>
                <TableHead className="text-gray-700 text-xs sm:text-sm py-2 px-2 sm:px-4 hidden md:table-cell">Data</TableHead>
                <TableHead className="text-gray-700 text-xs sm:text-sm py-2 px-2 sm:px-4 text-right">Ações</TableHead>
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
