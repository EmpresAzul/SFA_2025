
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface PrecificacaoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTipo: string;
  onTipoChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

const PrecificacaoFilters: React.FC<PrecificacaoFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedTipo,
  onTipoChange,
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600" />
          Filtros de Busca
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca por Nome */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Buscar por Nome
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Digite o nome do item..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filtro por Tipo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tipo de Item
            </label>
            <Select value={selectedTipo} onValueChange={onTipoChange}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="Produto">Produto</SelectItem>
                <SelectItem value="Serviço">Serviço</SelectItem>
                <SelectItem value="Hora">Hora</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Status
            </label>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
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

export default PrecificacaoFilters;
