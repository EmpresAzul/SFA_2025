import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Eye, Edit, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

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

  if (data.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum lançamento encontrado
          </h3>
          <p className="text-gray-500 text-center">
            Não há lançamentos que correspondam aos filtros aplicados.
          </p>
        </CardContent>
      </Card>
    );
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
                <TableRow key={lancamento.id} className="hover:bg-gray-50">
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LancamentosTable;
