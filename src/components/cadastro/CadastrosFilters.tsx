
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface CadastrosFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  tipoFilter: string;
  setTipoFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const CadastrosFilters: React.FC<CadastrosFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  tipoFilter,
  setTipoFilter,
  statusFilter,
  setStatusFilter
}) => {
  return (
    <Card className="shadow-colorful border-0 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-sm sm:text-base">🔍 Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-medium">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              <Input
                placeholder="Nome ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-10 h-8 sm:h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-medium">Tipo</Label>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="h-8 sm:h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="cliente">Clientes</SelectItem>
                <SelectItem value="fornecedor">Fornecedores</SelectItem>
                <SelectItem value="funcionário">Funcionários</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-medium">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 sm:h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CadastrosFilters;
