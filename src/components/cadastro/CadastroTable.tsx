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
  Edit,
  Trash2,
  Eye,
  User,
  Building,
  UserCog,
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
import { format } from "date-fns";
import { Cadastro } from "@/hooks/useCadastros";
import CadastroViewModal from "./CadastroViewModal";
import CadastroEditModal from "./CadastroEditModal";

interface CadastroTableProps {
  cadastros: Cadastro[];
  isLoading: boolean;
  tipo: string;
  onEdit: (cadastro: Cadastro) => void;
  onDelete: (id: string) => void;
}

export const CadastroTable: React.FC<CadastroTableProps> = ({
  cadastros,
  isLoading,
  tipo,
  onEdit,
  onDelete,
}) => {
  console.log("CadastroTable render - cadastros:", cadastros);
  console.log("CadastroTable render - isLoading:", isLoading);
  console.log("CadastroTable render - tipo:", tipo);
  const [viewingCadastro, setViewingCadastro] = useState<Cadastro | null>(null);
  const [editingCadastro, setEditingCadastro] = useState<Cadastro | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Cadastro | null>(null);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Cliente":
        return <User className="h-4 w-4 text-blue-600" />;
      case "Fornecedor":
        return <Building className="h-4 w-4 text-green-600" />;
      case "Funcionário":
        return <UserCog className="h-4 w-4 text-purple-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTipoBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "Cliente":
        return "default";
      case "Fornecedor":
        return "secondary";
      case "Funcionário":
        return "outline";
      default:
        return "default";
    }
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <>
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Lista de {tipo} ({cadastros.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold text-gray-700">
                    Tipo
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Nome
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Contato
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Data de Cadastro
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <User className="h-8 w-8" />
                        <p>Carregando cadastros...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && cadastros.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <User className="h-8 w-8" />
                        <p>Nenhum cadastro encontrado</p>
                        <p className="text-sm">
                          Adicione seus primeiros {tipo.toLowerCase()}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {cadastros.map((cadastro) => {
                  console.log("Rendering cadastro:", cadastro);
                  return (
                    <TableRow
                      key={cadastro.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTipoIcon(cadastro.tipo)}
                        <Badge variant={getTipoBadgeVariant(cadastro.tipo)}>
                          {cadastro.tipo}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{cadastro.nome}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {cadastro.telefone || "Telefone não informado"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {cadastro.email || "Email não informado"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(cadastro.data), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2 min-w-[120px]">
                        {/* Visualizar */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingCadastro(cadastro)}
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-300 hover:border-blue-400 bg-white"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Editar */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingCadastro(cadastro)}
                          className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-300 hover:border-amber-400 bg-white"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {/* Excluir */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setItemToDelete(cadastro)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 hover:border-red-400 bg-white"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o cadastro de{" "}
                                <strong>{cadastro.nome}</strong>? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDelete}
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
                );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Visualização */}
      {viewingCadastro && (
        <CadastroViewModal
          cadastro={viewingCadastro}
          isOpen={!!viewingCadastro}
          onClose={() => setViewingCadastro(null)}
        />
      )}

      {/* Modal de Edição */}
      {editingCadastro && (
        <CadastroEditModal
          isOpen={!!editingCadastro}
          onClose={() => setEditingCadastro(null)}
          editingItem={{
            ...editingCadastro,
            pessoa: editingCadastro.pessoa || "Física",
            salario: typeof editingCadastro.salario === 'string' 
              ? parseFloat(editingCadastro.salario) || undefined 
              : editingCadastro.salario,
          }}
          onSave={(data) => {
            onEdit(editingCadastro);
            setEditingCadastro(null);
          }}
          loading={false}
        />
      )}
    </>
  );
};
