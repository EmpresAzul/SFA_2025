import React from "react";
import LembretesActiveCard from "@/components/dashboard/LembretesActiveCard";
import MetricsCards from "@/components/dashboard/MetricsCards";
import DashboardChart from "@/components/dashboard/DashboardChart";

const Dashboard: React.FC = () => {

  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          📈 Dashboard Financeiro
        </h1>
        <p className="text-gray-600 text-sm">
          Visão geral dos principais indicadores do seu negócio
        </p>
      </div>

      {/* Métricas com dados reais */}
      <MetricsCards />

      {/* Lembretes Ativos */}
      <div className="mb-6">
        <LembretesActiveCard />
      </div>

      {/* Gráficos com dados reais */}
      <DashboardChart />
    </div>
  );
};

export default Dashboard;
