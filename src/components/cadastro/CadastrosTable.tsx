import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Eye, Trash2, Plus, Search, Filter } from 'lucide-react';
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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fornecedor':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'funcionario':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cliente':
        return '👤';
      case 'fornecedor':
        return '🏢';
      case 'funcionario':
        return '👷';
      default:
        return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar cadastros..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={selectedType}
                onChange={(e) => onTypeChange(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
              >
                <option value="">Todos os tipos</option>
                <option value="cliente">Clientes</option>
                <option value="fornecedor">Fornecedores</option>
                <option value="funcionario">Funcionários</option>
              </select>
            </div>
            <Button 
              onClick={onAdd} 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Cadastro
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Cadastros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cadastros.map((cadastro) => (
          <Card 
            key={cadastro.id} 
            className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            onClick={() => onView(cadastro)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getTypeIcon(cadastro.tipo)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">{cadastro.nome}</h3>
                    <Badge className={`${getTypeColor(cadastro.tipo)} text-xs font-medium`}>
                      {cadastro.tipo}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
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
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <span className="truncate">{cadastro.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Telefone:</span>
                  <span>{cadastro.telefone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cadastros.length === 0 && (
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cadastro encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou adicionar um novo cadastro.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CadastrosTable;
