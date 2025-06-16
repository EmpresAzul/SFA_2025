
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

// Definindo o tipo Lancamento localmente já que a tabela foi removida
export interface Lancamento {
  id: string;
  data: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  cliente_id?: string;
  fornecedor_id?: string;
  observacoes?: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

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
      // Como a tabela lancamentos foi removida, retornamos array vazio
      console.log('Tabela lancamentos foi removida. Retornando dados vazios.');
      setLancamentos([]);
    } catch (error: any) {
      console.error('Erro ao carregar lançamentos:', error);
      setLancamentos([]);
    } finally {
      setLoading(false);
    }
  };

  return { lancamentos, loading };
};
