
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

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
  periodoLabel
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-emerald-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-emerald-600">Total Receitas</p>
              <p className="text-xl font-bold text-emerald-900">R$ {totalReceitas.toFixed(2)}</p>
              <p className="text-xs text-emerald-600 mt-1">{periodoLabel}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Total Despesas</p>
              <p className="text-xl font-bold text-red-900">R$ {totalDespesas.toFixed(2)}</p>
              <p className="text-xs text-red-600 mt-1">{periodoLabel}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${saldo >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-orange-50 to-orange-100 border-orange-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-center">
            <DollarSign className={`h-8 w-8 ${saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            <div className="ml-3">
              <p className={`text-sm font-medium ${saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Saldo Líquido</p>
              <p className={`text-xl font-bold ${saldo >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                R$ {saldo.toFixed(2)}
              </p>
              <p className={`text-xs ${saldo >= 0 ? 'text-blue-600' : 'text-orange-600'} mt-1`}>
                {saldo >= 0 ? 'Superávit' : 'Déficit'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Total Transações</p>
              <p className="text-xl font-bold text-purple-900">{totalTransacoes}</p>
              <p className="text-xs text-purple-600 mt-1">{periodoLabel}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
