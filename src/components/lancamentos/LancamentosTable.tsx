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
import type { Lancamento } from "@/hooks/useLancamentos";

interface LancamentosTableProps {
  data: Lancamento[];
  onView: (item: Lancamento) => void;
  onEdit: (item: Lancamento) => void;
  onDelete: (id: string) => void;
}

const LancamentosTable: React.FC<LancamentosTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
}) => {
  if (data.length === 0) {
    return <LancamentosTableEmptyState />;
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Lista de Lançamentos ({data.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                <TableHead className="font-semibold text-gray-700">Descrição</TableHead>
                <TableHead className="font-semibold text-gray-700">Categoria</TableHead>
                <TableHead className="font-semibold text-gray-700">Valor</TableHead>
                <TableHead className="font-semibold text-gray-700">Data</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Ações</TableHead>
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
      </CardContent>
    </Card>
  );
};

export default LancamentosTable;
