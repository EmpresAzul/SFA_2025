import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface LembretesFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
}

const LembretesFilters: React.FC<LembretesFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}) => {
  return (
    <Card className="lembretes-filters">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Filtros</h3>
        </div>

        <div className="lembretes-filters-grid">
          <div className="space-y-2">
            <Label className="lembretes-filter-label">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="fluxo-input pl-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="lembretes-filter-label">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="fluxo-select h-10 text-sm">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="lembretes-filter-label">Período</Label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="fluxo-select h-10 text-sm">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="amanha">Amanhã</SelectItem>
                <SelectItem value="esta-semana">Esta semana</SelectItem>
                <SelectItem value="vencidos">Vencidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LembretesFilters;
