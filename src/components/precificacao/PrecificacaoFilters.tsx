import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

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
    <Card className="precificacao-filters">
      <CardHeader className="precificacao-filters-header">
        <CardTitle className="precificacao-filters-title">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          Filtros de Busca
        </CardTitle>
      </CardHeader>
      <CardContent className="precificacao-filters-content">
        <div className="precificacao-filters-grid">
          {/* Busca por Nome */}
          <div className="space-y-2">
            <label className="precificacao-filter-label">
              Buscar por Nome
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Digite o nome do item..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="fluxo-input pl-10 text-sm"
              />
            </div>
          </div>

          {/* Filtro por Tipo */}
          <div className="space-y-2">
            <label className="precificacao-filter-label">
              Tipo de Item
            </label>
            <Select value={selectedTipo} onValueChange={onTipoChange}>
              <SelectTrigger className="fluxo-select h-10 text-sm">
                <SelectValue placeholder="Todos os Tipos" />
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
            <label className="precificacao-filter-label">Status</label>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="fluxo-select h-10 text-sm">
                <SelectValue placeholder="Todos os Status" />
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
