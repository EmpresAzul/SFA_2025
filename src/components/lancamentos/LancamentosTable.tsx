
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatNumberToDisplay } from '@/utils/currency';
import type { LancamentoComRelacoes } from '@/types/lancamentosForm';

interface LancamentosTableProps {
  data: LancamentoComRelacoes[];
  loading: boolean;
  onEdit: (lancamento: LancamentoComRelacoes) => void;
  onDelete: (id: string) => Promise<void>;
}

const LancamentosTable: React.FC<LancamentosTableProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
}) => {
  const [viewingLancamento, setViewingLancamento] = useState<LancamentoComRelacoes | null>(null);

  const handleView = (lancamento: LancamentoComRelacoes) => {
    setViewingLancamento(lancamento);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === 'receita' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center">Carregando lançamentos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Lançamentos Financeiros ({data.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold text-gray-700">Data</TableHead>
                <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                <TableHead className="font-semibold text-gray-700">Categoria</TableHead>
                <TableHead className="font-semibold text-gray-700">Valor</TableHead>
                <TableHead className="font-semibold text-gray-700">Cliente/Fornecedor</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <DollarSign className="h-8 w-8" />
                      <p>Nenhum lançamento encontrado</p>
                      <p className="text-sm">Cadastre seus primeiros lançamentos financeiros</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((lancamento) => (
                  <TableRow key={lancamento.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium">
                      {formatDate(lancamento.data)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTipoIcon(lancamento.tipo)}
                        <Badge
                          variant={lancamento.tipo === 'receita' ? 'default' : 'destructive'}
                        >
                          {lancamento.tipo === 'receita' ? 'Receita' : 'Despesa'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{lancamento.categoria}</TableCell>
                    <TableCell className={`font-semibold ${
                      lancamento.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatNumberToDisplay(lancamento.valor)}
                    </TableCell>
                    <TableCell>
                      {lancamento.cliente?.nome || lancamento.fornecedor?.nome || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        {/* Visualizar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(lancamento)}
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Editar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(lancamento)}
                          className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {/* Excluir */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este lançamento de {formatNumberToDisplay(lancamento.valor)}? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDelete(lancamento.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LancamentosTable;
