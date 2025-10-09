import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";

interface LancamentosSummaryCardsProps {
  totalLancamentos: number;
  totalReceitas: number;
  totalDespesas: number;
  saldoAtual: number;
}

const LancamentosSummaryCards: React.FC<LancamentosSummaryCardsProps> = ({
  totalLancamentos,
  totalReceitas,
  totalDespesas,
  saldoAtual,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      {/* Total de Lançamentos */}
      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Total de Lançamentos</CardTitle>
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">{totalLancamentos}</div>
          <p className="text-xs text-emerald-100">Todos os lançamentos</p>
        </CardContent>
      </Card>

      {/* Receitas */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Receitas</CardTitle>
          <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">
            R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-green-100">Entradas de dinheiro</p>
        </CardContent>
      </Card>

      {/* Despesas */}
      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Despesas</CardTitle>
          <ArrowDownRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">
            R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-red-100">Saídas de dinheiro</p>
        </CardContent>
      </Card>

      {/* Saldo Atual */}
      <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
        saldoAtual >= 0 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
          : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Saldo Atual</CardTitle>
          <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">
            R$ {saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className={`text-xs ${saldoAtual >= 0 ? 'text-blue-100' : 'text-orange-100'}`}>
            {saldoAtual >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LancamentosSummaryCards;
