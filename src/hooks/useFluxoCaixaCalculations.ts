import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Lancamento, FluxoDiario, CategoriaData } from "@/types/fluxoCaixa";

// Paleta de cores específicas para receitas (tons de verde/azul)
const RECEITAS_COLORS = [
  '#10B981', // Emerald 500
  '#059669', // Emerald 600
  '#047857', // Emerald 700
  '#065F46', // Emerald 800
  '#064E3B', // Emerald 900
  '#0D9488', // Teal 600
  '#0F766E', // Teal 700
  '#115E59', // Teal 800
  '#134E4A', // Teal 900
  '#1D4ED8', // Blue 700
  '#1E40AF', // Blue 800
  '#1E3A8A', // Blue 900
];

// Paleta de cores específicas para despesas (tons de vermelho/laranja)
const DESPESAS_COLORS = [
  '#EF4444', // Red 500
  '#DC2626', // Red 600
  '#B91C1C', // Red 700
  '#991B1B', // Red 800
  '#7F1D1D', // Red 900
  '#EA580C', // Orange 600
  '#C2410C', // Orange 700
  '#9A3412', // Orange 800
  '#7C2D12', // Orange 900
  '#BE123C', // Rose 700
  '#9F1239', // Rose 800
  '#881337', // Rose 900
];

// Função para obter cor específica por categoria
const getCategoryColor = (categoria: string, tipo: 'receita' | 'despesa', index: number) => {
  const colors = tipo === 'receita' ? RECEITAS_COLORS : DESPESAS_COLORS;
  
  // Criar um hash simples da categoria para consistência
  let hash = 0;
  for (let i = 0; i < categoria.length; i++) {
    const char = categoria.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Usar o hash para selecionar uma cor consistente
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

export const useFluxoCaixaCalculations = (lancamentos: Lancamento[]) => {
  const totalReceitas = useMemo(() => {
    return lancamentos
      .filter((l) => l.tipo === "receita")
      .reduce((sum, l) => sum + l.valor, 0);
  }, [lancamentos]);

  const totalDespesas = useMemo(() => {
    return lancamentos
      .filter((l) => l.tipo === "despesa")
      .reduce((sum, l) => sum + l.valor, 0);
  }, [lancamentos]);

  const saldo = useMemo(() => {
    return totalReceitas - totalDespesas;
  }, [totalReceitas, totalDespesas]);

  const fluxoPorDia = useMemo(() => {
    const fluxoPorDia: {
      [key: string]: {
        receitas: number;
        despesas: number;
        data: string;
        dataCompleta: string;
      };
    } = {};

    lancamentos.forEach((lancamento) => {
      const dataLancamento = lancamento.data;
      const dataFormatada = format(parseISO(dataLancamento), "dd/MM");

      if (!fluxoPorDia[dataLancamento]) {
        fluxoPorDia[dataLancamento] = {
          receitas: 0,
          despesas: 0,
          data: dataFormatada,
          dataCompleta: dataLancamento,
        };
      }

      if (lancamento.tipo === "receita") {
        fluxoPorDia[dataLancamento].receitas += lancamento.valor;
      } else {
        fluxoPorDia[dataLancamento].despesas += lancamento.valor;
      }
    });

    return Object.values(fluxoPorDia)
      .sort((a, b) => a.dataCompleta.localeCompare(b.dataCompleta))
      .map(({ dataCompleta, ...rest }) => rest);
  }, [lancamentos]);

  const receitasPorCategoria = useMemo(() => {
    const receitasPorCategoria: { [key: string]: number } = {};

    lancamentos
      .filter((l) => l.tipo === "receita")
      .forEach((lancamento) => {
        if (!receitasPorCategoria[lancamento.categoria]) {
          receitasPorCategoria[lancamento.categoria] = 0;
        }
        receitasPorCategoria[lancamento.categoria] += lancamento.valor;
      });

    return Object.entries(receitasPorCategoria).map(([categoria, valor], index) => ({
      name: categoria,
      value: valor,
      color: getCategoryColor(categoria, 'receita', index),
    }));
  }, [lancamentos]);

  const despesasPorCategoria = useMemo(() => {
    const despesasPorCategoria: { [key: string]: number } = {};

    lancamentos
      .filter((l) => l.tipo === "despesa")
      .forEach((lancamento) => {
        if (!despesasPorCategoria[lancamento.categoria]) {
          despesasPorCategoria[lancamento.categoria] = 0;
        }
        despesasPorCategoria[lancamento.categoria] += lancamento.valor;
      });

    return Object.entries(despesasPorCategoria).map(([categoria, valor], index) => ({
      name: categoria,
      value: valor,
      color: getCategoryColor(categoria, 'despesa', index),
    }));
  }, [lancamentos]);

  return {
    totalReceitas,
    totalDespesas,
    saldo,
    fluxoPorDia,
    receitasPorCategoria,
    despesasPorCategoria,
  };
};
