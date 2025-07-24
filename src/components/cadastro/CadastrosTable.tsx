import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight, Users, Building, UserCheck } from 'lucide-react';
import { CadastroData } from '@/types/cadastros';
import CadastrosPagination from './CadastrosPagination';

interface CadastrosTableProps {
  cadastros: CadastroData[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onEdit: (cadastro: CadastroData) => void;
  onView: (cadastro: CadastroData) => void;
  onToggleStatus: (cadastro: CadastroData) => void;
  onDelete: (id: string, nome: string) => void;
}

const CadastrosTable: React.FC<CadastrosTableProps> = ({
  cadastros,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
  onView,
  onToggleStatus,
  onDelete,
}) => {
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'cliente':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'fornecedor':
        return <Building className="h-4 w-4 text-green-600" />;
      case 'funcionario':
        return <UserCheck className="h-4 w-4 text-purple-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTipoBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'cliente':
        return "default";
      case 'fornecedor':
        return "secondary";
      case 'funcionario':
        return "outline";
      default:
        return "default";
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <Users className="h-5 w-5 text-teal-600" />
          Lista de Cadastros ({totalItems})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 h-10">
                <TableHead className="font-semibold text-gray-700 text-xs py-2 w-16">
                  Tipo
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2">
                  Nome
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2 hidden sm:table-cell">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2 hidden md:table-cell">
                  Telefone
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2 w-16">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs py-2 text-center w-24">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cadastros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Users className="h-8 w-8" />
                      <p>Nenhum cadastro encontrado</p>
                      <p className="text-sm">
                        Cadastre seus primeiros clientes, fornecedores ou funcionários
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                cadastros.map((cadastro) => (
                  <TableRow
                    key={cadastro.id}
                    className="hover:bg-gray-50/50 transition-colors h-12"
                  >
                    <TableCell className="py-2">
                      <Badge 
                        variant={getTipoBadgeVariant(cadastro.tipo)}
                        className="text-xs px-2 py-0.5"
                      >
                        {cadastro.tipo.charAt(0).toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium py-2 text-sm">
                      <div className="flex items-center gap-2">
                        {getTipoIcon(cadastro.tipo)}
                        <div className="min-w-0 flex-1">
                          <div className="truncate">{cadastro.nome}</div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {cadastro.email && <div className="truncate">{cadastro.email}</div>}
                            {cadastro.telefone && <div>{cadastro.telefone}</div>}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-sm max-w-[180px] truncate text-gray-600 hidden sm:table-cell">
                      {cadastro.email || '-'}
                    </TableCell>
                    <TableCell className="py-2 text-sm text-gray-600 hidden md:table-cell">
                      {cadastro.telefone || '-'}
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        variant={
                          cadastro.status === "ativo" ? "default" : "secondary"
                        }
                        className="text-xs px-2 py-0.5"
                      >
                        {cadastro.status === "ativo" ? "A" : "I"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center justify-center gap-1">
                        {/* Visualizar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(cadastro)}
                          className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Visualizar"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>

                        {/* Editar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(cadastro)}
                          className="h-7 w-7 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          title="Editar"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>

                        {/* Ativar/Desativar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleStatus(cadastro)}
                          className={`h-7 w-7 p-0 ${
                            cadastro.status === "ativo"
                              ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                              : "text-gray-400 hover:text-gray-500 hover:bg-gray-50"
                          }`}
                          title={
                            cadastro.status === "ativo" ? "Desativar" : "Ativar"
                          }
                        >
                          {cadastro.status === "ativo" ? (
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
                                Tem certeza que deseja excluir o cadastro "
                                {cadastro.nome}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(cadastro.id, cadastro.nome)}
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
        <CadastrosPagination
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

export default CadastrosTable;
