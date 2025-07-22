import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";

interface SummaryCardsProps {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  totalTransacoes: number;
  periodoLabel: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalReceitas,
  totalDespesas,
  saldo,
  totalTransacoes,
  periodoLabel,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Card Receitas */}
      <Card className="bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Total Receitas</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-white/80">{periodoLabel}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Despesas */}
      <Card className="bg-gradient-to-br from-red-400 via-red-500 to-rose-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Total Despesas</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-white/80">{periodoLabel}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Saldo */}
      <Card className={`bg-gradient-to-br ${
        saldo >= 0 
          ? "from-blue-400 via-blue-500 to-indigo-600" 
          : "from-orange-400 via-orange-500 to-red-500"
      } border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Saldo Líquido</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-white/80">
                {saldo >= 0 ? "Superávit" : "Déficit"}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Transações */}
      <Card className="bg-gradient-to-br from-purple-400 via-purple-500 to-violet-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Total Transações</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{totalTransacoes}</p>
              <p className="text-xs text-white/80">{periodoLabel}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
