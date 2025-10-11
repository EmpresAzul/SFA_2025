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
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 p-3 sm:p-4 md:p-6">
        <CardTitle className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2">
          <span className="inline-block w-1 h-4 sm:h-5 bg-blue-600 rounded-full"></span>
          Lista de Lançamentos ({totalItems})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile-optimized horizontal scroll */}
        <div className="overflow-x-auto smooth-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 h-10 sm:h-12">
                <TableHead className="text-gray-700 text-xs sm:text-sm py-2 px-2 sm:px-3 md:px-4 font-semibold">
                  Tipo
                </TableHead>
                <TableHead className="text-gray-700 text-xs sm:text-sm py-2 px-2 sm:px-3 md:px-4 min-w-[140px] sm:min-w-[180px] font-semibold">
                  Descrição
                </TableHead>
                <TableHead className="text-gray-700 text-xs sm:text-sm py-2 px-2 sm:px-3 md:px-4 hidden sm:table-cell font-semibold">
                  Categoria
                </TableHead>
                <TableHead className="text-gray-700 text-xs sm:text-sm py-2 px-2 sm:px-3 md:px-4 text-right font-semibold">
                  Valor
                </TableHead>
                <TableHead className="text-gray-700 text-xs sm:text-sm py-2 px-2 sm:px-3 md:px-4 hidden md:table-cell font-semibold">
                  Data
                </TableHead>
                <TableHead className="text-gray-700 text-xs sm:text-sm py-2 px-2 sm:px-3 md:px-4 text-right font-semibold sticky right-0 bg-gray-50">
                  Ações
                </TableHead>
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
