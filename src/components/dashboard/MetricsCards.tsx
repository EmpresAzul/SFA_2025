
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Building, Package, Wrench, DollarSign, CreditCard, Wallet } from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';

const MetricsCards: React.FC = () => {
  const { data: metrics, isLoading } = useDashboardMetrics();

  if (isLoading || !metrics) {
    return (
      <div className="responsive-grid mb-6">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4 sm:p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Ponto de Equilíbrio',
      value: `R$ ${metrics.pontoEquilibrio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Qtde. Clientes',
      value: metrics.qtdeClientes.toString(),
      icon: Users,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Qtde. Fornecedores',
      value: metrics.qtdeFornecedores.toString(),
      icon: Building,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Qtde. Produtos',
      value: metrics.qtdeProdutos.toString(),
      icon: Package,
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Qtde. Serviços',
      value: metrics.qtdeServicos.toString(),
      icon: Wrench,
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Total Receitas do Mês',
      value: `R$ ${metrics.totalReceitasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Despesas do Mês',
      value: `R$ ${metrics.totalDespesasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: CreditCard,
      gradient: 'from-red-500 to-red-600'
    },
    {
      title: 'Saldo Bancário',
      value: `R$ ${metrics.saldoBancario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Wallet,
      gradient: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpiCards.map((kpi, index) => (
        <Card key={index} className="hover:shadow-colorful transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  {kpi.title}
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {kpi.value}
                </p>
              </div>
              <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${kpi.gradient}`}>
                <kpi.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsCards;
