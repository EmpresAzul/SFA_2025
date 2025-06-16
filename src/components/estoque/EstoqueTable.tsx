
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Pencil, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Estoque } from '@/types/estoque';

interface EstoqueTableProps {
  filteredEstoques: Estoque[];
  selectedEstoque: Estoque | null;
  setSelectedEstoque: (estoque: Estoque | null) => void;
  handleEdit: (estoque: Estoque) => void;
  handleToggleStatus: (estoque: Estoque) => void;
  handleDelete: (id: string) => void;
}

export const EstoqueTable: React.FC<EstoqueTableProps> = ({
  filteredEstoques,
  selectedEstoque,
  setSelectedEstoque,
  handleEdit,
  handleToggleStatus,
  handleDelete
}) => {
  const getStatusBadge = (status: string) => {
    const colors = {
      ativo: 'bg-emerald-100 text-emerald-800',
      inativo: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
        <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📦 Itens do Estoque ({filteredEstoques.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50 hover:bg-gray-100">
                <TableHead className="font-semibold text-gray-700">Data</TableHead>
                <TableHead className="font-semibold text-gray-700">Produto</TableHead>
                <TableHead className="font-semibold text-gray-700">Unidade</TableHead>
                <TableHead className="font-semibold text-gray-700">Quantidade</TableHead>
                <TableHead className="font-semibold text-gray-700">Valor Unitário</TableHead>
                <TableHead className="font-semibold text-gray-700">Valor Total</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstoques.map((estoque) => (
                <TableRow key={estoque.id} className="hover:bg-blue-50 transition-colors duration-200">
                  <TableCell className="font-medium">{format(new Date(estoque.data), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="font-semibold text-gray-800">{estoque.nome_produto}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {estoque.unidade_medida}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{estoque.quantidade}</TableCell>
                  <TableCell className="text-green-600 font-semibold">R$ {estoque.valor_unitario.toFixed(2)}</TableCell>
                  <TableCell className="text-green-700 font-bold">R$ {estoque.valor_total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(estoque.status)}>
                      {estoque.status === 'ativo' ? '✅ Ativo' : '❌ Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      {/* Botão Visualizar */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => setSelectedEstoque(estoque)}
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              📦 Detalhes do Item
                            </DialogTitle>
                          </DialogHeader>
                          {selectedEstoque && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="font-medium text-gray-600">Produto:</p>
                                  <p className="font-semibold">{selectedEstoque.nome_produto}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-600">Data:</p>
                                  <p>{format(new Date(selectedEstoque.data), 'dd/MM/yyyy')}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-600">Quantidade:</p>
                                  <p>{selectedEstoque.quantidade} {selectedEstoque.unidade_medida}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-600">Valor Unit.:</p>
                                  <p className="text-green-600 font-semibold">R$ {selectedEstoque.valor_unitario.toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-600">Quantidade Bruta:</p>
                                  <p>{selectedEstoque.quantidade_bruta}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-600">Quantidade Líquida:</p>
                                  <p>{selectedEstoque.quantidade_liquida}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="font-medium text-gray-600">Valor Total:</p>
                                  <p className="text-green-700 font-bold text-lg">R$ {selectedEstoque.valor_total.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Botão Editar */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-yellow-50 hover:border-yellow-300"
                        onClick={() => {
                          handleEdit(estoque);
                          // Switch to form tab
                          const tabTrigger = document.querySelector('[value="formulario"]') as HTMLElement;
                          if (tabTrigger) tabTrigger.click();
                        }}
                      >
                        <Pencil className="h-4 w-4 text-yellow-600" />
                      </Button>

                      {/* Botão Ativar/Desativar */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-purple-50 hover:border-purple-300"
                        onClick={() => handleToggleStatus(estoque)}
                      >
                        {estoque.status === 'ativo' ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>

                      {/* Botão Excluir */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza de que deseja excluir permanentemente o item "{estoque.nome_produto}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(estoque.id)}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
