
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Cadastro } from '@/hooks/useCadastros';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tipo} ({cadastros.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF/CNPJ</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && cadastros.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Nenhum cadastro encontrado
                </TableCell>
              </TableRow>
            )}
            {cadastros.map((cadastro) => (
              <TableRow key={cadastro.id}>
                <TableCell className="font-medium">{cadastro.nome}</TableCell>
                <TableCell>{cadastro.cpf_cnpj || '-'}</TableCell>
                <TableCell>{cadastro.telefone || '-'}</TableCell>
                <TableCell>{cadastro.email || '-'}</TableCell>
                <TableCell>{format(new Date(cadastro.data), 'dd/MM/yyyy')}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(cadastro)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(cadastro.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
