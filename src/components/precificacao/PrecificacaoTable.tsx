import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Package,
  Wrench,
  Clock,
} from "lucide-react";
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
import { formatNumberToDisplay } from "@/utils/currency";
import { usePrecificacao } from "@/hooks/usePrecificacao";
import PrecificacaoPagination from "./PrecificacaoPagination";


interface Precificacao {
  id: string;
  [key: string]: any;
}

interface PrecificacaoTableProps {
  data: Precificacao[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onView: (item: Precificacao) => void;
  onEdit: (item: Precificacao) => void;
}

const PrecificacaoTable: React.FC<PrecificacaoTableProps> = ({
  data,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onView,
  onEdit,
}) => {
  const { useUpdate, useDelete } = usePrecificacao();
  const updateMutation = useUpdate();
  const deleteMutation = useDelete();
  const [itemToDelete, setItemToDelete] = useState<Precificacao | null>(null);

  const handleToggleStatus = async (item: Precificacao) => {
    const newStatus = item.status === "ativo" ? "inativo" : "ativo";
    updateMutation.mutate({
      id: item.id,
      data: { status: newStatus },
    });
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Produto":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "Serviço":
        return <Wrench className="h-4 w-4 text-purple-600" />;
      case "Hora":
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getTipoBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "Produto":
        return "default";
      case "Serviço":
        return "secondary";
      case "Hora":
        return "outline";
      default:
        return "default";
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-800">
          Lista de Itens Cadastrados ({totalItems})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 h-10">
                <TableHead className="font-semibold text-gray-700 text-xs py-2">
                  Tipo
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2">
                  Nome
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2">
                  Categoria
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2 text-right">
                  Preço Final
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
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Package className="h-8 w-8" />
                      <p>Nenhum item encontrado</p>
                      <p className="text-sm">
                        Cadastre seus primeiros produtos, serviços ou horas
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors h-12"
                  >
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1">
                        {getTipoIcon(item.tipo)}
                        <Badge 
                          variant={getTipoBadgeVariant(item.tipo)}
                          className="text-xs px-2 py-0.5"
                        >
                          {item.tipo.charAt(0)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium py-2 text-sm max-w-[200px] truncate">
                      {item.nome}
                    </TableCell>
                    <TableCell className="py-2 text-sm max-w-[150px] truncate">
                      {item.dados_json?.categoria || item.categoria || '-'}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600 py-2 text-right text-sm">
                      {formatNumberToDisplay(item.preco_venda || item.preco_final || 0)}
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        variant={
                          (item.status || "ativo") === "ativo" ? "default" : "secondary"
                        }
                        className="text-xs px-2 py-0.5"
                      >
                        {(item.status || "ativo") === "ativo" ? "A" : "I"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center justify-center gap-1">
                        {/* Visualizar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(item)}
                          className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Visualizar"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>

                        {/* Editar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                          className="h-7 w-7 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          title="Editar"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>

                        {/* Ativar/Desativar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(item)}
                          className={`h-7 w-7 p-0 ${
                            item.status === "ativo"
                              ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                              : "text-gray-400 hover:text-gray-500 hover:bg-gray-50"
                          }`}
                          title={
                            item.status === "ativo" ? "Desativar" : "Ativar"
                          }
                          disabled={updateMutation.isPending}
                        >
                          {item.status === "ativo" ? (
                            <ToggleRight className="h-3.5 w-3.5" />
                          ) : (
                            <ToggleLeft className="h-3.5 w-3.5" />
                          )}
                        </Button>

                        {/* Excluir */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Excluir"
                              onClick={() => setItemToDelete(item)}
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
                                Tem certeza que deseja excluir o item "
                                {item.nome}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setItemToDelete(null)}
                              >
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending
                                  ? "Excluindo..."
                                  : "Excluir"}
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
        <PrecificacaoPagination
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

export default PrecificacaoTable;
