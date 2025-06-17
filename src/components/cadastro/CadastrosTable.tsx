
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import CadastroViewModal from '@/components/cadastro/CadastroViewModal';

interface CadastrosTableProps {
  filteredItems: any[];
  onEdit: (item: any) => void;
  onToggleStatus: (item: any) => void;
  onDelete: (id: string, nome: string) => void;
}

const CadastrosTable: React.FC<CadastrosTableProps> = ({
  filteredItems,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  return (
    <Card className="shadow-colorful border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-sm sm:text-base">📊 Lista de Cadastros ({filteredItems.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="responsive-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Nome</TableHead>
                <TableHead className="text-xs sm:text-sm">Tipo</TableHead>
                <TableHead className="mobile-hidden text-xs sm:text-sm">E-mail</TableHead>
                <TableHead className="mobile-hidden text-xs sm:text-sm">Telefone</TableHead>
                <TableHead className="text-xs sm:text-sm">Status</TableHead>
                <TableHead className="text-right text-xs sm:text-sm">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={`${item.tipoDisplay}-${item.id}`}>
                  <TableCell className="font-medium text-xs sm:text-sm">{item.nome}</TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.tipoDisplay === 'Cliente' ? 'bg-blue-100 text-blue-800' :
                      item.tipoDisplay === 'Fornecedor' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {item.tipoDisplay === 'Cliente' ? '👤 Cliente' :
                       item.tipoDisplay === 'Fornecedor' ? '🏢 Fornecedor' :
                       '👨‍💼 Funcionário'}
                    </span>
                  </TableCell>
                  <TableCell className="mobile-hidden text-xs sm:text-sm">{item.email}</TableCell>
                  <TableCell className="mobile-hidden text-xs sm:text-sm">{item.telefone}</TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'ativo' ? '✅ Ativo' : '❌ Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <CadastroViewModal cadastro={item} />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onToggleStatus(item)}
                        className={`hover:bg-gray-50 h-6 w-6 sm:h-8 sm:w-8 p-0 ${
                          item.status === 'ativo' ? 'text-green-600' : 'text-red-600'
                        }`}
                        title={item.status === 'ativo' ? 'Desativar' : 'Ativar'}
                      >
                        {item.status === 'ativo' ? 
                          <ToggleRight className="h-2 w-2 sm:h-3 sm:w-3" /> : 
                          <ToggleLeft className="h-2 w-2 sm:h-3 sm:w-3" />
                        }
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(item)}
                        className="hover:bg-blue-50 h-6 w-6 sm:h-8 sm:w-8 p-0"
                        title="Editar"
                      >
                        <Edit className="h-2 w-2 sm:h-3 sm:w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(item.id, item.nome)}
                        className="hover:bg-red-50 text-red-600 h-6 w-6 sm:h-8 sm:w-8 p-0"
                        title="Excluir"
                      >
                        <Trash2 className="h-2 w-2 sm:h-3 sm:w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 sm:py-8 text-gray-500">
                    <Users className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mb-3 sm:mb-4" />
                    <p className="text-xs sm:text-sm">Nenhum cadastro encontrado</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CadastrosTable;
