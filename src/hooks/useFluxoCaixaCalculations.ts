
import { useMemo } from 'react';
import { format } from 'date-fns';
import { Lancamento, FluxoDiario, CategoriaData } from '@/types/fluxoCaixa';

export const useFluxoCaixaCalculations = (lancamentos: Lancamento[]) => {
  const totalReceitas = useMemo(() => {
    return lancamentos
      .filter(l => l.tipo === 'receita')
      .reduce((sum, l) => sum + l.valor, 0);
  }, [lancamentos]);

  const totalDespesas = useMemo(() => {
    return lancamentos
      .filter(l => l.tipo === 'despesa')
      .reduce((sum, l) => sum + l.valor, 0);
  }, [lancamentos]);

  const saldo = useMemo(() => {
    return totalReceitas - totalDespesas;
  }, [totalReceitas, totalDespesas]);

  const fluxoPorDia = useMemo(() => {
    const fluxoPorDia: { [key: string]: { receitas: number; despesas: number; data: string } } = {};

    lancamentos.forEach(lancamento => {
      const data = lancamento.data;
      if (!fluxoPorDia[data]) {
        fluxoPorDia[data] = { receitas: 0, despesas: 0, data: format(new Date(data), 'dd/MM') };
      }

      if (lancamento.tipo === 'receita') {
        fluxoPorDia[data].receitas += lancamento.valor;
      } else {
        fluxoPorDia[data].despesas += lancamento.valor;
      }
    });

    return Object.values(fluxoPorDia).sort((a, b) => a.data.localeCompare(b.data));
  }, [lancamentos]);

  const receitasPorCategoria = useMemo(() => {
    const receitasPorCategoria: { [key: string]: number } = {};

    lancamentos
      .filter(l => l.tipo === 'receita')
      .forEach(lancamento => {
        if (!receitasPorCategoria[lancamento.categoria]) {
          receitasPorCategoria[lancamento.categoria] = 0;
        }
        receitasPorCategoria[lancamento.categoria] += lancamento.valor;
      });

    return Object.entries(receitasPorCategoria).map(([categoria, valor]) => ({
      name: categoria,
      value: valor,
      color: '#10b981'
    }));
  }, [lancamentos]);

  const despesasPorCategoria = useMemo(() => {
    const despesasPorCategoria: { [key: string]: number } = {};

    lancamentos
      .filter(l => l.tipo === 'despesa')
      .forEach(lancamento => {
        if (!despesasPorCategoria[lancamento.categoria]) {
          despesasPorCategoria[lancamento.categoria] = 0;
        }
        despesasPorCategoria[lancamento.categoria] += lancamento.valor;
      });

    return Object.entries(despesasPorCategoria).map(([categoria, valor]) => ({
      name: categoria,
      value: valor,
      color: '#ef4444'
    }));
  }, [lancamentos]);

  return {
    totalReceitas,
    totalDespesas,
    saldo,
    fluxoPorDia,
    receitasPorCategoria,
    despesasPorCategoria
  };
};
