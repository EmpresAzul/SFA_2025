
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  hideTypeFilter?: boolean;
}

export const ContactAdvancedFilters: React.FC<ContactAdvancedFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  hideTypeFilter = false
}) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardHeader>
        <CardTitle className="gradient-fluxo-text flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filtros Avançados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Busca por nome */}
          <div>
            <Label htmlFor="search" className="text-fluxo-blue-900 font-medium flex items-center">
              <Search className="mr-1 h-4 w-4" />
              Buscar por nome
            </Label>
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome ou documento..."
              className="mt-1"
            />
          </div>

          {/* Filtro por tipo - só aparece se não estiver escondido */}
          {!hideTypeFilter && (
            <div>
              <Label className="text-fluxo-blue-900 font-medium">
                Tipo de Cadastro
              </Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Cliente">Clientes</SelectItem>
                  <SelectItem value="Fornecedor">Fornecedores</SelectItem>
                  <SelectItem value="Funcionário">Funcionários</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Data início */}
          <div>
            <Label htmlFor="startDate" className="text-fluxo-blue-900 font-medium flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Data início
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Data fim */}
          <div>
            <Label htmlFor="endDate" className="text-fluxo-blue-900 font-medium flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Data fim
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
