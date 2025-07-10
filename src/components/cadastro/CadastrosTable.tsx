import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Eye, Trash2, Plus } from 'lucide-react';
import { CadastroData } from '@/types/cadastros';

interface CadastrosTableProps {
  cadastros: CadastroData[];
  onEdit: (cadastro: CadastroData) => void;
  onView: (cadastro: CadastroData) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const CadastrosTable: React.FC<CadastrosTableProps> = ({
  cadastros,
  onEdit,
  onView,
  onDelete,
  onAdd,
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cliente':
        return 'bg-blue-100 text-blue-800';
      case 'fornecedor':
        return 'bg-green-100 text-green-800';
      case 'funcionario':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'telefone', label: 'Telefone' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'actions', label: 'Ações' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cadastros</CardTitle>
          <Button onClick={onAdd} className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cadastro
          </Button>
        </div>
        <div className="flex gap-4">
          <Input
            placeholder="Buscar cadastros..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm"
          />
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os tipos</option>
            <option value="cliente">Clientes</option>
            <option value="fornecedor">Fornecedores</option>
            <option value="funcionario">Funcionários</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {cadastros.map((cadastro) => (
              <TableRow key={cadastro.id}>
                <TableCell className="font-medium">{cadastro.nome}</TableCell>
                <TableCell>{cadastro.email}</TableCell>
                <TableCell>{cadastro.telefone}</TableCell>
                <TableCell>
                  <Badge className={getTypeColor(cadastro.tipo)}>
                    {cadastro.tipo}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(cadastro)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(cadastro)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(cadastro.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CadastrosTable;
