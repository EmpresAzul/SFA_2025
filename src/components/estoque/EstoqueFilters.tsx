import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface EstoqueFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export const EstoqueFilters: React.FC<EstoqueFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <Card className="estoque-filters">
      <CardHeader className="estoque-filters-header">
        <CardTitle className="estoque-filters-title">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          Filtros de Pesquisa
        </CardTitle>
      </CardHeader>
      <CardContent className="estoque-filters-content">
        <div className="estoque-filters-grid">
          <div className="space-y-2">
            <Label className="estoque-filter-label">Buscar Produto</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Digite o nome do produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="fluxo-input pl-10 text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="estoque-filter-label">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="fluxo-select h-10 text-sm">
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativo">✅ Ativo</SelectItem>
                <SelectItem value="inativo">❌ Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
