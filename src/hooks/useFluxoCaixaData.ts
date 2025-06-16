
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Lancamento } from '@/types/fluxoCaixa';

export const useFluxoCaixaData = (periodoFilter: string) => {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLancamentos();
    }
  }, [user, periodoFilter]);

  const fetchLancamentos = async () => {
    setLoading(true);
    try {
      let dataInicio: Date;
      let dataFim: Date;

      const hoje = new Date();

      switch (periodoFilter) {
        case 'mes-atual':
          dataInicio = startOfMonth(hoje);
          dataFim = endOfMonth(hoje);
          break;
        case 'mes-anterior':
          const mesAnterior = subMonths(hoje, 1);
          dataInicio = startOfMonth(mesAnterior);
          dataFim = endOfMonth(mesAnterior);
          break;
        case 'ultimos-3-meses':
          dataInicio = startOfMonth(subMonths(hoje, 2));
          dataFim = endOfMonth(hoje);
          break;
        case 'ultimos-6-meses':
          dataInicio = startOfMonth(subMonths(hoje, 5));
          dataFim = endOfMonth(hoje);
          break;
        default:
          dataInicio = startOfMonth(hoje);
          dataFim = endOfMonth(hoje);
      }

      const { data, error } = await supabase
        .from('lancamentos')
        .select('*')
        .eq('user_id', user?.id)
        .gte('data', format(dataInicio, 'yyyy-MM-dd'))
        .lte('data', format(dataFim, 'yyyy-MM-dd'))
        .order('data', { ascending: true });

      if (error) throw error;
      
      const typedLancamentos = (data || []).map(item => ({
        ...item,
        tipo: item.tipo as 'receita' | 'despesa'
      })) as Lancamento[];
      
      setLancamentos(typedLancamentos);
    } catch (error: any) {
      console.error('Erro ao carregar lançamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  return { lancamentos, loading };
};
