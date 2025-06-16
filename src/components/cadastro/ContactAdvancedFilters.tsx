
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Calendar } from 'lucide-react';

interface ContactAdvancedFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
}

export const ContactAdvancedFilters: React.FC<ContactAdvancedFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) => {
  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStartDate('');
    setEndDate('');
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Busca por Nome */}
          <div>
            <Label htmlFor="search" className="text-fluxo-blue-900 font-medium flex items-center mb-2">
              <Search className="h-4 w-4 mr-2" />
              Buscar por Nome
            </Label>
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome..."
              className="w-full"
            />
          </div>

          {/* Data Início */}
          <div>
            <Label htmlFor="startDate" className="text-fluxo-blue-900 font-medium flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Data Início
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Data Fim */}
          <div>
            <Label htmlFor="endDate" className="text-fluxo-blue-900 font-medium flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Data Fim
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Filtro por Tipo */}
          <div>
            <Label className="text-fluxo-blue-900 font-medium flex items-center mb-2">
              <Filter className="h-4 w-4 mr-2" />
              Tipo de Cadastro
            </Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Cliente">Clientes</SelectItem>
                <SelectItem value="Fornecedor">Fornecedores</SelectItem>
                <SelectItem value="Funcionário">Funcionários</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão Limpar Filtros */}
          <div className="flex items-end">
            <Button
              onClick={clearFilters}
              variant="outline"
              className="w-full hover:bg-gray-50"
            >
              <Filter className="mr-2 h-4 w-4" />
              Limpar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
