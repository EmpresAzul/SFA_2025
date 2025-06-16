
import { useMemo } from 'react';
import type { Lancamento } from '@/hooks/useLancamentos';

type LancamentoComRelacoes = Lancamento & {
  cliente?: { nome: string } | null;
  fornecedor?: { nome: string } | null;
};

export interface DREData {
  receitaOperacionalBruta: number;
  deducoesReceitaBruta: number;
  receitaOperacionalLiquida: number;
  custosVendas: number;
  resultadoOperacionalBruto: number;
  despesasOperacionais: number;
  despesasFinanceiras: number;
  resultadoOperacional: number;
  outrasReceitasDespesas: number;
  resultadoAntesIR: number;
  provisaoIR: number;
  lucroLiquido: number;
  detalhamento: {
    receitasOperacionais: { [key: string]: number };
    deducoes: { [key: string]: number };
    custos: { [key: string]: number };
    despesasOperacionais: { [key: string]: number };
    despesasFinanceiras: { [key: string]: number };
    outrasReceitas: { [key: string]: number };
    outrasDespesas: { [key: string]: number };
  };
}

export const useDRECalculations = (lancamentos: LancamentoComRelacoes[]): DREData => {
  return useMemo(() => {
    // Categorização das receitas
    const receitasOperacionais: { [key: string]: number } = {};
    const outrasReceitas: { [key: string]: number } = {};
    
    // Categorização das despesas
    const deducoes: { [key: string]: number } = {};
    const custos: { [key: string]: number } = {};
    const despesasOperacionais: { [key: string]: number } = {};
    const despesasFinanceiras: { [key: string]: number } = {};
    const outrasDespesas: { [key: string]: number } = {};

    // Processamento dos lançamentos
    lancamentos.forEach(lancamento => {
      const categoria = lancamento.categoria;
      const valor = lancamento.valor;

      if (lancamento.tipo === 'receita') {
        // Receitas Operacionais
        if (['Vendas de Produtos', 'Vendas de Mercadorias', 'Prestação de Serviços', 'Outras Receitas Operacionais'].includes(categoria)) {
          receitasOperacionais[categoria] = (receitasOperacionais[categoria] || 0) + valor;
        }
        // Outras Receitas
        else {
          outrasReceitas[categoria] = (outrasReceitas[categoria] || 0) + valor;
        }
      } else {
        // Deduções da Receita
        if (['Devoluções de Vendas', 'Abatimentos sobre Vendas', 'ICMS sobre Vendas', 'PIS/COFINS', 'ISS', 'Outros Impostos sobre Vendas'].includes(categoria)) {
          deducoes[categoria] = (deducoes[categoria] || 0) + valor;
        }
        // Custos
        else if (categoria.includes('Custo') || categoria.includes('CPV') || categoria.includes('CMV') || categoria.includes('CSP') || 
                 ['Matéria-Prima', 'Mão de Obra Direta', 'Custos Indiretos de Fabricação'].includes(categoria)) {
          custos[categoria] = (custos[categoria] || 0) + valor;
        }
        // Despesas Financeiras
        else if (['Juros Pagos', 'Taxas Bancárias', 'IOF', 'Descontos Concedidos', 'Variações Monetárias Passivas'].includes(categoria)) {
          despesasFinanceiras[categoria] = (despesasFinanceiras[categoria] || 0) + valor;
        }
        // Outras Despesas
        else if (['Despesas Extraordinárias', 'Provisões para Contingências'].includes(categoria)) {
          outrasDespesas[categoria] = (outrasDespesas[categoria] || 0) + valor;
        }
        // Despesas Operacionais (todo o resto)
        else {
          despesasOperacionais[categoria] = (despesasOperacionais[categoria] || 0) + valor;
        }
      }
    });

    // Cálculos do DRE
    const receitaOperacionalBruta = Object.values(receitasOperacionais).reduce((sum, val) => sum + val, 0);
    const deducoesReceitaBruta = Object.values(deducoes).reduce((sum, val) => sum + val, 0);
    const receitaOperacionalLiquida = receitaOperacionalBruta - deducoesReceitaBruta;
    
    const custosVendas = Object.values(custos).reduce((sum, val) => sum + val, 0);
    const resultadoOperacionalBruto = receitaOperacionalLiquida - custosVendas;
    
    const despesasOperacionaisTotal = Object.values(despesasOperacionais).reduce((sum, val) => sum + val, 0);
    const despesasFinanceirasTotal = Object.values(despesasFinanceiras).reduce((sum, val) => sum + val, 0);
    
    const resultadoOperacional = resultadoOperacionalBruto - despesasOperacionaisTotal - despesasFinanceirasTotal;
    
    const outrasReceitasTotal = Object.values(outrasReceitas).reduce((sum, val) => sum + val, 0);
    const outrasDespesasTotal = Object.values(outrasDespesas).reduce((sum, val) => sum + val, 0);
    const outrasReceitasDespesas = outrasReceitasTotal - outrasDespesasTotal;
    
    const resultadoAntesIR = resultadoOperacional + outrasReceitasDespesas;
    const provisaoIR = resultadoAntesIR > 0 ? resultadoAntesIR * 0.15 : 0; // 15% estimado
    const lucroLiquido = resultadoAntesIR - provisaoIR;

    return {
      receitaOperacionalBruta,
      deducoesReceitaBruta,
      receitaOperacionalLiquida,
      custosVendas,
      resultadoOperacionalBruto,
      despesasOperacionais: despesasOperacionaisTotal,
      despesasFinanceiras: despesasFinanceirasTotal,
      resultadoOperacional,
      outrasReceitasDespesas,
      resultadoAntesIR,
      provisaoIR,
      lucroLiquido,
      detalhamento: {
        receitasOperacionais,
        deducoes,
        custos,
        despesasOperacionais,
        despesasFinanceiras,
        outrasReceitas,
        outrasDespesas
      }
    };
  }, [lancamentos]);
};

