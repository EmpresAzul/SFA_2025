import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useIntegratedFluxoCaixa } from "@/hooks/useIntegratedFluxoCaixa";
import { SummaryCards } from "@/components/fluxo-caixa/SummaryCards";
import { DailyFlowChart } from "@/components/fluxo-caixa/DailyFlowChart";
import { CategoryChart } from "@/components/fluxo-caixa/CategoryChart";
import { PeriodSelector } from "@/components/fluxo-caixa/PeriodSelector";
import { DateRangeFilter } from "@/components/fluxo-caixa/DateRangeFilter";

const FluxoCaixa: React.FC = () => {
  const [periodoFilter, setPeriodoFilter] = useState("mes-atual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const queryClient = useQueryClient();

  // Definir datas padrão quando selecionar período personalizado
  useEffect(() => {
    if (periodoFilter === "personalizado" && !startDate && !endDate) {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
      setEndDate(lastDayOfMonth.toISOString().split('T')[0]);
    }
  }, [periodoFilter, startDate, endDate]);

  const {
    lancamentos,
    loading,
    totalReceitas,
    totalDespesas,
    saldo,
    fluxoPorDia,
    receitasPorCategoria,
    despesasPorCategoria,
    onLancamentosChange,
  } = useIntegratedFluxoCaixa(
    periodoFilter,
    periodoFilter === "personalizado" ? startDate : undefined,
    periodoFilter === "personalizado" ? endDate : undefined
  );

  // Escutar mudanças nos lançamentos para atualização automática
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.queryKey?.[0] === "lancamentos") {
        console.log(
          "Detectada mudança nos lançamentos, atualizando fluxo de caixa...",
        );
        onLancamentosChange();
      }
    });

    return () => unsubscribe();
  }, [queryClient, onLancamentosChange]);

  const getPeriodoLabel = () => {
    switch (periodoFilter) {
      case "mes-atual":
        return "Mês Atual";
      case "mes-anterior":
        return "Mês Anterior";
      case "ultimos-3-meses":
        return "Últimos 3 Meses";
      case "ultimos-6-meses":
        return "Últimos 6 Meses";
      case "personalizado":
        if (startDate && endDate) {
          const start = new Date(startDate).toLocaleDateString('pt-BR');
          const end = new Date(endDate).toLocaleDateString('pt-BR');
          return `${start} - ${end}`;
        }
        return "Período Personalizado";
      default:
        return "Mês Atual";
    }
  };

  if (loading) {
    return (
      <div className="responsive-padding bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do fluxo de caixa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            💰 Fluxo de Caixa
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Análise detalhada do movimento financeiro - {lancamentos.length}{" "}
            lançamentos
          </p>
        </div>

        <PeriodSelector value={periodoFilter} onChange={setPeriodoFilter} />
      </div>

      {/* Filtro por período personalizado */}
      {periodoFilter === "personalizado" && (
        <div className="mb-6">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>
      )}

      <SummaryCards
        totalReceitas={totalReceitas}
        totalDespesas={totalDespesas}
        saldo={saldo}
        totalTransacoes={lancamentos.length}
        periodoLabel={getPeriodoLabel()}
      />

      <DailyFlowChart data={fluxoPorDia} periodoLabel={getPeriodoLabel()} />

      <div className="responsive-grid-2">
        <CategoryChart
          data={receitasPorCategoria}
          title="💚 Receitas por Categoria"
          emptyMessage="Nenhuma receita encontrada no período"
        />

        <CategoryChart
          data={despesasPorCategoria}
          title="❤️ Despesas por Categoria"
          emptyMessage="Nenhuma despesa encontrada no período"
        />
      </div>
    </div>
  );
};

export default FluxoCaixa;
