
import React, { useState } from 'react';
import { useFluxoCaixaData } from '@/hooks/useFluxoCaixaData';
import { useFluxoCaixaCalculations } from '@/hooks/useFluxoCaixaCalculations';
import { SummaryCards } from '@/components/fluxo-caixa/SummaryCards';
import { DailyFlowChart } from '@/components/fluxo-caixa/DailyFlowChart';
import { CategoryChart } from '@/components/fluxo-caixa/CategoryChart';
import { PeriodSelector } from '@/components/fluxo-caixa/PeriodSelector';

const FluxoCaixa: React.FC = () => {
  const [periodoFilter, setPeriodoFilter] = useState('mes-atual');
  const { lancamentos, loading } = useFluxoCaixaData(periodoFilter);
  const {
    totalReceitas,
    totalDespesas,
    saldo,
    fluxoPorDia,
    receitasPorCategoria,
    despesasPorCategoria
  } = useFluxoCaixaCalculations(lancamentos);

  const getPeriodoLabel = () => {
    switch (periodoFilter) {
      case 'mes-atual': return 'Mês Atual';
      case 'mes-anterior': return 'Mês Anterior';
      case 'ultimos-3-meses': return 'Últimos 3 Meses';
      case 'ultimos-6-meses': return 'Últimos 6 Meses';
      default: return 'Mês Atual';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-fluxo-text">Fluxo de Caixa</h1>
          <p className="text-gray-600 mt-2">Análise detalhada do movimento financeiro</p>
        </div>
        
        <PeriodSelector value={periodoFilter} onChange={setPeriodoFilter} />
      </div>

      <SummaryCards
        totalReceitas={totalReceitas}
        totalDespesas={totalDespesas}
        saldo={saldo}
        totalTransacoes={lancamentos.length}
        periodoLabel={getPeriodoLabel()}
      />

      <DailyFlowChart data={fluxoPorDia} periodoLabel={getPeriodoLabel()} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart
          data={receitasPorCategoria}
          title="Receitas por Categoria"
          emptyMessage="Nenhuma receita encontrada no período"
        />
        
        <CategoryChart
          data={despesasPorCategoria}
          title="Despesas por Categoria"
          emptyMessage="Nenhuma despesa encontrada no período"
        />
      </div>
    </div>
  );
};

export default FluxoCaixa;
