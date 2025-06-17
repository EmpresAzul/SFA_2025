
import { useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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

export interface ProjecaoData {
  faturamento: number;
  custosVariaveis: CustosVariaveis;
  gastosFixos: GastosFixos;
  saidasNaoOperacionais: number;
  resultados: {
    pontoEquilibrio: number;
    percentualPE: number;
    margemContribuicao: number;
    proLaboreMaximo: number;
  };
}

export interface Projecao {
  id: string;
  nome_projecao: string;
  dados_projecao: ProjecaoData;
  created_at: string;
  updated_at: string;
}

export const usePontoEquilibrio = () => {
  const queryClient = useQueryClient();
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
  const [projecaoAtual, setProjecaoAtual] = useState<string | null>(null);

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

  // Query para buscar projeções
  const { data: projecoes = [], isLoading: isLoadingProjecoes } = useQuery({
    queryKey: ['projecoes-ponto-equilibrio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projecoes_ponto_equilibrio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Projecao[];
    }
  });

  // Mutation para salvar projeção
  const salvarProjecaoMutation = useMutation({
    mutationFn: async (nomeProjecao: string) => {
      const dadosProjecao: ProjecaoData = {
        faturamento,
        custosVariaveis,
        gastosFixos,
        saidasNaoOperacionais,
        resultados: {
          pontoEquilibrio,
          percentualPE,
          margemContribuicao: margemContribuicao * 100,
          proLaboreMaximo
        }
      };

      const { data, error } = await supabase
        .from('projecoes_ponto_equilibrio')
        .insert({
          nome_projecao: nomeProjecao,
          dados_projecao: dadosProjecao,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projecoes-ponto-equilibrio'] });
      setProjecaoAtual(data.id);
      toast.success('Projeção salva com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao salvar projeção:', error);
      toast.error('Erro ao salvar projeção');
    }
  });

  // Mutation para atualizar projeção
  const atualizarProjecaoMutation = useMutation({
    mutationFn: async ({ id, nomeProjecao }: { id: string; nomeProjecao?: string }) => {
      const dadosProjecao: ProjecaoData = {
        faturamento,
        custosVariaveis,
        gastosFixos,
        saidasNaoOperacionais,
        resultados: {
          pontoEquilibrio,
          percentualPE,
          margemContribuicao: margemContribuicao * 100,
          proLaboreMaximo
        }
      };

      const updateData: any = { dados_projecao: dadosProjecao };
      if (nomeProjecao) updateData.nome_projecao = nomeProjecao;

      const { data, error } = await supabase
        .from('projecoes_ponto_equilibrio')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projecoes-ponto-equilibrio'] });
      toast.success('Projeção atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar projeção:', error);
      toast.error('Erro ao atualizar projeção');
    }
  });

  // Mutation para deletar projeção
  const deletarProjecaoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projecoes_ponto_equilibrio')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projecoes-ponto-equilibrio'] });
      setProjecaoAtual(null);
      toast.success('Projeção excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar projeção:', error);
      toast.error('Erro ao deletar projeção');
    }
  });

  const carregarProjecao = (projecao: Projecao) => {
    const dados = projecao.dados_projecao;
    setFaturamento(dados.faturamento);
    setCustosVariaveis(dados.custosVariaveis);
    setGastosFixos(dados.gastosFixos);
    setSaidasNaoOperacionais(dados.saidasNaoOperacionais);
    setProjecaoAtual(projecao.id);
    toast.success(`Projeção "${projecao.nome_projecao}" carregada!`);
  };

  const novaProjecao = () => {
    setFaturamento(50000);
    setCustosVariaveis({
      fornecedores: 25,
      impostos: 8.5,
      comissoes: 5,
      taxaCartao: 3,
      outros: 2,
      lucratividade: 15
    });
    setGastosFixos({
      gastosFixosMensais: 8000,
      proLabore: 5000
    });
    setSaidasNaoOperacionais(1000);
    setProjecaoAtual(null);
    toast.success('Nova projeção criada!');
  };

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
    totalCustosVariaveisPercentual,
    // Projeções
    projecoes,
    isLoadingProjecoes,
    projecaoAtual,
    salvarProjecao: salvarProjecaoMutation.mutate,
    atualizarProjecao: atualizarProjecaoMutation.mutate,
    deletarProjecao: deletarProjecaoMutation.mutate,
    carregarProjecao,
    novaProjecao,
    isSaving: salvarProjecaoMutation.isPending || atualizarProjecaoMutation.isPending,
    isDeleting: deletarProjecaoMutation.isPending
  };
};
