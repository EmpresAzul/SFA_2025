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
import { Search, Filter, Calendar, DollarSign } from "lucide-react";

interface LancamentosFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  selectedTipo: string;
  onTipoChange: (value: string) => void;
  selectedCategoria: string;
  onCategoriaChange: (value: string) => void;
  selectedPeriodo: string;
  onPeriodoChange: (value: string) => void;
}

const LancamentosFilters: React.FC<LancamentosFiltersProps> = ({
  searchTerm,
  onSearchChange,
  searchValue,
  onSearchValueChange,
  selectedTipo,
  onTipoChange,
  selectedCategoria,
  onCategoriaChange,
  selectedPeriodo,
  onPeriodoChange,
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Busca por Descrição */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Buscar por Descrição
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Digite a descrição..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Busca por Valor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Buscar por Valor
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Ex: 1000 ou 1.500,00"
                value={searchValue}
                onChange={(e) => onSearchValueChange(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filtro por Tipo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tipo de Lançamento
            </label>
            <Select value={selectedTipo} onValueChange={onTipoChange}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Categoria */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Categoria</label>
            <Select value={selectedCategoria} onValueChange={onCategoriaChange}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Categorias</SelectItem>
                <SelectItem value="Vendas de Serviços">Vendas de Serviços</SelectItem>
                <SelectItem value="Prestação de Serviços">Prestação de Serviços</SelectItem>
                <SelectItem value="Custo dos Serviços Prestados">Custo dos Serviços Prestados</SelectItem>
                <SelectItem value="Marketing e Publicidade">Marketing e Publicidade</SelectItem>
                <SelectItem value="Investimento em Marketing">Investimento em Marketing</SelectItem>
                <SelectItem value="Periodicidade mensal e anual">Periodicidade mensal e anual</SelectItem>
                <SelectItem value="Manutenção programada mensal">Manutenção programada mensal</SelectItem>
                <SelectItem value="Contrato de prestação de serviços">Contrato de prestação de serviços</SelectItem>
                <SelectItem value="Contrato Prest Serv">Contrato Prest Serv</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Período */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Período</label>
            <Select value={selectedPeriodo} onValueChange={onPeriodoChange}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Períodos</SelectItem>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="semana">Esta Semana</SelectItem>
                <SelectItem value="mes">Este Mês</SelectItem>
                <SelectItem value="trimestre">Este Trimestre</SelectItem>
                <SelectItem value="ano">Este Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LancamentosFilters;
