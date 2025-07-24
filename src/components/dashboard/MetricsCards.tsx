import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Building,
  Package,
  Wrench,
  DollarSign,
  CreditCard,
  Wallet,
} from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

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
      title: "Qtde. Funcionários",
      value: metrics.qtdeFuncionarios.toString(),
      subtitle: "Funcionários cadastrados",
      icon: UserCheck,
      bgColor: "bg-emerald-500",
    },
    {
      title: "Qtde. Clientes",
      value: metrics.qtdeClientes.toString(),
      subtitle: "Clientes cadastrados",
      icon: Users,
      bgColor: "bg-blue-500",
    },
    {
      title: "Qtde. Fornecedores",
      value: metrics.qtdeFornecedores.toString(),
      subtitle: "Fornecedores cadastrados",
      icon: Building,
      bgColor: "bg-purple-500",
    },
    {
      title: "Qtde. Produtos",
      value: metrics.qtdeProdutos.toString(),
      subtitle: "Produtos em estoque",
      icon: Package,
      bgColor: "bg-orange-500",
    },
    {
      title: "Qtde. Serviços",
      value: metrics.qtdeServicos.toString(),
      subtitle: "Serviços cadastrados",
      icon: Wrench,
      bgColor: "bg-pink-500",
    },
    {
      title: "Total Receitas do Mês",
      value: `R$ ${metrics.totalReceitasMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      subtitle: "Receitas do mês atual",
      icon: DollarSign,
      bgColor: "bg-green-500",
    },
    {
      title: "Total Despesas do Mês",
      value: `R$ ${metrics.totalDespesasMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      subtitle: "Despesas do mês atual",
      icon: CreditCard,
      bgColor: "bg-red-500",
    },
    {
      title: "Saldo Bancário",
      value: `R$ ${metrics.saldoBancario.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      subtitle: "Saldo consolidado",
      icon: Wallet,
      bgColor: "bg-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {kpiCards.map((kpi, index) => (
        <Card
          key={index}
          className={`${kpi.bgColor} hover:shadow-lg hover:scale-105 transition-all duration-300 border-0 shadow-md text-white`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-white/90 mb-1 tracking-wide">
                  {kpi.title}
                </p>
                <p className="text-xl font-bold text-white mb-1">
                  {kpi.value}
                </p>
                <p className="text-xs text-white/80">
                  {kpi.subtitle}
                </p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsCards;
