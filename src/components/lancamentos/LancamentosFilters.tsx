import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select-white";
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
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          Filtros de Busca
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Busca por Descrição */}
          <div className="space-y-2 col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Buscar por Descrição
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Digite a descrição..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="fluxo-input pl-10 text-sm"
              />
            </div>
          </div>

          {/* Busca por Valor */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Buscar por Valor
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Ex: 1000 ou 1.500,00"
                value={searchValue}
                onChange={(e) => onSearchValueChange(e.target.value)}
                className="fluxo-input pl-10 text-sm"
              />
            </div>
          </div>

          {/* Filtro por Tipo */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Tipo de Lançamento
            </label>
            <Select value={selectedTipo} onValueChange={onTipoChange}>
              <SelectTrigger className="fluxo-select h-10 text-sm">
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
            <label className="text-xs sm:text-sm font-medium text-gray-700">Categoria</label>
            <Select value={selectedCategoria} onValueChange={onCategoriaChange}>
              <SelectTrigger className="fluxo-select h-10 text-sm">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Categorias</SelectItem>
                
                {/* RECEITAS */}
                <div className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100">
                  RECEITA BRUTA DE VENDAS
                </div>
                <SelectItem value="Venda de Produtos">Venda de Produtos</SelectItem>
                <SelectItem value="Venda de Mercadorias">Venda de Mercadorias</SelectItem>
                <SelectItem value="Prestação de Serviços">Prestação de Serviços</SelectItem>
                
                <div className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100">
                  RESULTADO FINANCEIRO
                </div>
                <SelectItem value="Receitas Financeiras">Receitas Financeiras</SelectItem>
                
                <div className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100">
                  OUTRAS RECEITAS NÃO OPERACIONAIS
                </div>
                <SelectItem value="Outras Receitas Não Operacionais">Outras Receitas Não Operacionais</SelectItem>
                
                {/* DESPESAS */}
                <div className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100">
                  DEDUÇÕES DA RECEITA BRUTA
                </div>
                <SelectItem value="Devoluções e Abatimentos">Devoluções e Abatimentos</SelectItem>
                <SelectItem value="Vendas Canceladas">Vendas Canceladas</SelectItem>
                <SelectItem value="Descontos Incondicionais Concedidos">Descontos Incondicionais Concedidos</SelectItem>
                <SelectItem value="Impostos sobre Vendas (ICMS, PIS, COFINS)">Impostos sobre Vendas (ICMS, PIS, COFINS)</SelectItem>
                
                <div className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100">
                  CUSTOS
                </div>
                <SelectItem value="Custo da Matéria-Prima / Mercadoria">Custo da Matéria-Prima / Mercadoria</SelectItem>
                <SelectItem value="Custo da Mão de Obra Direta">Custo da Mão de Obra Direta</SelectItem>
                <SelectItem value="Custos Indiretos de Fabricação/Prestação (CIF/CIP)">Custos Indiretos de Fabricação/Prestação (CIF/CIP)</SelectItem>
                <SelectItem value="Quebras e Perdas">Quebras e Perdas</SelectItem>
                
                <div className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100">
                  DESPESAS OPERACIONAIS
                </div>
                <SelectItem value="Despesas com Vendas">Despesas com Vendas</SelectItem>
                <SelectItem value="Despesas Administrativas">Despesas Administrativas</SelectItem>
                <SelectItem value="Outras Despesas Operacionais">Outras Despesas Operacionais</SelectItem>
                
                <div className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100">
                  DESPESAS FINANCEIRAS
                </div>
                <SelectItem value="Despesas Financeiras">Despesas Financeiras</SelectItem>
                
                <div className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100">
                  OUTRAS DESPESAS NÃO OPERACIONAIS
                </div>
                <SelectItem value="Outras Despesas Não Operacionais">Outras Despesas Não Operacionais</SelectItem>
                
                <div className="text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100">
                  IMPOSTOS E PARTICIPAÇÕES
                </div>
                <SelectItem value="Imposto de Renda Pessoa Jurídica (IRPJ)">Imposto de Renda Pessoa Jurídica (IRPJ)</SelectItem>
                <SelectItem value="Contribuição Social sobre o Lucro Líquido (CSLL)">Contribuição Social sobre o Lucro Líquido (CSLL)</SelectItem>
                <SelectItem value="Participações de Empregados, Administradores, etc.">Participações de Empregados, Administradores, etc.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Período */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">Período</label>
            <Select value={selectedPeriodo} onValueChange={onPeriodoChange}>
              <SelectTrigger className="fluxo-select h-10 text-sm">
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
