
import { useState, useMemo } from 'react';

export interface CustosVariaveis {
  fornecedores: number;
  impostos: number;
  comissoes: number;
  taxaCartao: number;
  outros: number;
  lucratividade: number;
}

export interface GastosFixos {
  gastosFixosMensais: number;
  proLabore: number;
}

export const usePontoEquilibrio = () => {
  const [faturamento, setFaturamento] = useState(50000);
  const [custosVariaveis, setCustosVariaveis] = useState<CustosVariaveis>({
    fornecedores: 25,
    impostos: 8.5,
    comissoes: 5,
    taxaCartao: 3,
    outros: 2,
    lucratividade: 15
  });
  const [gastosFixos, setGastosFixos] = useState<GastosFixos>({
    gastosFixosMensais: 8000,
    proLabore: 5000
  });
  const [saidasNaoOperacionais, setSaidasNaoOperacionais] = useState(1000);

  // Cálculos
  const totalCustosVariaveisPercentual = useMemo(() => {
    return custosVariaveis.fornecedores + 
           custosVariaveis.impostos + 
           custosVariaveis.comissoes + 
           custosVariaveis.taxaCartao + 
           custosVariaveis.outros + 
           custosVariaveis.lucratividade;
  }, [custosVariaveis]);

  const margemContribuicao = useMemo(() => {
    return (100 - totalCustosVariaveisPercentual) / 100;
  }, [totalCustosVariaveisPercentual]);

  const totalGastosFixos = useMemo(() => {
    return gastosFixos.gastosFixosMensais + gastosFixos.proLabore + saidasNaoOperacionais;
  }, [gastosFixos, saidasNaoOperacionais]);

  const pontoEquilibrio = useMemo(() => {
    if (margemContribuicao <= 0) return 0;
    return totalGastosFixos / margemContribuicao;
  }, [totalGastosFixos, margemContribuicao]);

  const percentualPE = useMemo(() => {
    if (faturamento === 0) return 0;
    return (pontoEquilibrio / faturamento) * 100;
  }, [pontoEquilibrio, faturamento]);

  const proLaboreMaximo = useMemo(() => {
    const receitaDisponivel = faturamento * margemContribuicao;
    const proLaboreMax = receitaDisponivel - gastosFixos.gastosFixosMensais - saidasNaoOperacionais;
    return Math.max(0, proLaboreMax);
  }, [faturamento, margemContribuicao, gastosFixos.gastosFixosMensais, saidasNaoOperacionais]);

  return {
    faturamento,
    setFaturamento,
    custosVariaveis,
    setCustosVariaveis,
    gastosFixos,
    setGastosFixos,
    saidasNaoOperacionais,
    setSaidasNaoOperacionais,
    pontoEquilibrio,
    percentualPE,
    margemContribuicao: margemContribuicao * 100,
    proLaboreMaximo,
    totalCustosVariaveisPercentual
  };
};
