import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Pencil, ToggleLeft, ToggleRight, Trash2, Package } from "lucide-react";
import { format } from "date-fns";
import { Estoque } from "@/types/estoque";
import EstoquePagination from "./EstoquePagination";

interface EstoqueTableProps {
  filteredEstoques: Estoque[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  selectedEstoque: Estoque | null;
  setSelectedEstoque: (estoque: Estoque | null) => void;
  handleEdit: (estoque: Estoque) => void;
  handleToggleStatus: (estoque: Estoque) => void;
  handleDelete: (id: string) => void;
}

export const EstoqueTable: React.FC<EstoqueTableProps> = ({
  filteredEstoques,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  selectedEstoque,
  setSelectedEstoque,
  handleEdit,
  handleToggleStatus,
  handleDelete,
}) => {
  const getStatusBadge = (status: string) => {
    const colors = {
      ativo: "default",
      inativo: "secondary",
    };
    return colors[status as keyof typeof colors] || "secondary";
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-800">
          Itens do Estoque ({totalItems})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 h-10">
                <TableHead className="font-semibold text-gray-700 text-xs py-2">
                  Data
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2">
                  Produto
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2">
                  Unidade
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2 text-right">
                  Quantidade
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2 text-right">
                  Valor Unitário
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2 text-right">
                  Valor Total
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2 text-center">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstoques.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Package className="h-8 w-8" />
                      <p>Nenhum item encontrado</p>
                      <p className="text-sm">
                        Cadastre seus primeiros itens de estoque
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEstoques.map((estoque) => (
                  <TableRow
                    key={estoque.id}
                    className="hover:bg-gray-50/50 transition-colors h-12"
                  >
                    <TableCell className="py-2 text-sm">
                      {format(new Date(estoque.data), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="font-medium py-2 text-sm max-w-[200px] truncate">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        {estoque.nome_produto}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5"
                      >
                        {estoque.unidade_medida}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-right text-sm font-medium">
                      {estoque.quantidade}
                    </TableCell>
                    <TableCell className="py-2 text-right text-sm font-medium text-green-600">
                      R$ {estoque.valor_unitario.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-2 text-right text-sm font-semibold text-green-700">
                      R$ {estoque.valor_total.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge 
                        variant={getStatusBadge(estoque.status)}
                        className="text-xs px-2 py-0.5"
                      >
                        {estoque.status === "ativo" ? "A" : "I"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center justify-center gap-1">
                        {/* Botão Visualizar */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => setSelectedEstoque(estoque)}
                              title="Visualizar"
                            >
                              <Eye className="h-3.5 w-3.5" />
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
                                  <p className="font-medium text-gray-600">
                                    Produto:
                                  </p>
                                  <p className="font-semibold">
                                    {selectedEstoque.nome_produto}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-600">
                                    Data:
                                  </p>
                                  <p>
                                    {format(
                                      new Date(selectedEstoque.data),
                                      "dd/MM/yyyy",
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-600">
                                    Quantidade:
                                  </p>
                                  <p>
                                    {selectedEstoque.quantidade}{" "}
                                    {selectedEstoque.unidade_medida}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-600">
                                    Valor Unit.:
                                  </p>
                                  <p className="text-green-600 font-semibold">
                                    R${" "}
                                    {selectedEstoque.valor_unitario.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-600">
                                    Quantidade Bruta:
                                  </p>
                                  <p>{selectedEstoque.quantidade_bruta}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-600">
                                    Quantidade Líquida:
                                  </p>
                                  <p>{selectedEstoque.quantidade_liquida}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="font-medium text-gray-600">
                                    Valor Total:
                                  </p>
                                  <p className="text-green-700 font-bold text-lg">
                                    R$ {selectedEstoque.valor_total.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                        {/* Botão Editar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => {
                            handleEdit(estoque);
                            // Switch to form tab
                            const tabTrigger = document.querySelector(
                              '[value="formulario"]',
                            ) as HTMLElement;
                            if (tabTrigger) tabTrigger.click();
                          }}
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        {/* Botão Ativar/Desativar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-7 w-7 p-0 ${
                            estoque.status === "ativo"
                              ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                              : "text-gray-400 hover:text-gray-500 hover:bg-gray-50"
                          }`}
                          onClick={() => handleToggleStatus(estoque)}
                          title={estoque.status === "ativo" ? "Desativar" : "Ativar"}
                        >
                          {estoque.status === "ativo" ? (
                            <ToggleRight className="h-3.5 w-3.5" />
                          ) : (
                            <ToggleLeft className="h-3.5 w-3.5" />
                          )}
                        </Button>

                        {/* Botão Excluir */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Excluir"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmar Exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza de que deseja excluir permanentemente
                                o item "{estoque.nome_produto}"? Esta ação não
                                pode ser desfeita.
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Paginação */}
        <EstoquePagination
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
