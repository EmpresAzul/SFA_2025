
import { useQuery as useReactQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { LancamentoComRelacoes } from '@/types/lancamentos';

export const useLancamentosQuery = () => {
  return useReactQuery({
    queryKey: ['lancamentos'],
    queryFn: async () => {
      console.log('useLancamentosQuery: Iniciando busca de lançamentos');
      console.log('useLancamentosQuery: Session atual:', await supabase.auth.getSession());
      
      const { data, error } = await supabase
        .from('lancamentos')
        .select(`
          *,
          cliente:cadastros!cliente_id(nome),
          fornecedor:cadastros!fornecedor_id(nome)
        `)
        .order('data', { ascending: false });

      if (error) {
        console.error('useLancamentosQuery: Erro ao buscar lançamentos:', error);
        console.error('useLancamentosQuery: Detalhes do erro:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('useLancamentosQuery: Lançamentos encontrados:', data?.length || 0);
      console.log('useLancamentosQuery: Primeiros 3 lançamentos:', data?.slice(0, 3));
      
      return data as LancamentoComRelacoes[];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
