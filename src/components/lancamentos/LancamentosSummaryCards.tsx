
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import type { Lancamento } from '@/hooks/useLancamentos';

type LancamentoComRelacoes = Lancamento & {
  cliente?: { nome: string } | null;
  fornecedor?: { nome: string } | null;
};

interface LancamentosSummaryCardsProps {
  lancamentos: LancamentoComRelacoes[];
}

const LancamentosSummaryCards: React.FC<LancamentosSummaryCardsProps> = ({ lancamentos }) => {
  const getTotalReceitas = () => {
    return lancamentos
      .filter(l => l.tipo === 'receita')
      .reduce((sum, l) => sum + l.valor, 0);
  };

  const getTotalDespesas = () => {
    return lancamentos
      .filter(l => l.tipo === 'despesa')
      .reduce((sum, l) => sum + l.valor, 0);
  };

  const getSaldo = () => {
    return getTotalReceitas() - getTotalDespesas();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-emerald-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-emerald-600">Total Receitas</p>
              <p className="text-xl font-bold text-emerald-900">R$ {getTotalReceitas().toFixed(2)}</p>
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
              <p className="text-xl font-bold text-red-900">R$ {getTotalDespesas().toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${getSaldo() >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-orange-50 to-orange-100 border-orange-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-center">
            <DollarSign className={`h-8 w-8 ${getSaldo() >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            <div className="ml-3">
              <p className={`text-sm font-medium ${getSaldo() >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Saldo</p>
              <p className={`text-xl font-bold ${getSaldo() >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                R$ {getSaldo().toFixed(2)}
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
              <p className="text-sm font-medium text-purple-600">Total Lançamentos</p>
              <p className="text-xl font-bold text-purple-900">{lancamentos.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LancamentosSummaryCards;
