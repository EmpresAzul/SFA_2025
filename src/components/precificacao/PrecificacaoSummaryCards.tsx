
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Wrench, Clock, TrendingUp } from 'lucide-react';

interface PrecificacaoSummaryCardsProps {
  totalItens: number;
  totalProdutos: number;
  totalServicos: number;
  totalHoras: number;
}

const PrecificacaoSummaryCards: React.FC<PrecificacaoSummaryCardsProps> = ({
  totalItens,
  totalProdutos,
  totalServicos,
  totalHoras,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total de Itens */}
      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
          <TrendingUp className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItens}</div>
          <p className="text-xs text-emerald-100">
            Todos os itens cadastrados
          </p>
        </CardContent>
      </Card>

      {/* Produtos */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produtos</CardTitle>
          <Package className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProdutos}</div>
          <p className="text-xs text-blue-100">
            Produtos cadastrados
          </p>
        </CardContent>
      </Card>

      {/* Serviços */}
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Serviços</CardTitle>
          <Wrench className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalServicos}</div>
          <p className="text-xs text-purple-100">
            Serviços cadastrados
          </p>
        </CardContent>
      </Card>

      {/* Horas */}
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Horas</CardTitle>
          <Clock className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHoras}</div>
          <p className="text-xs text-orange-100">
            Horas cadastradas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrecificacaoSummaryCards;
