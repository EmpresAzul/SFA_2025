
import { useQuery as useReactQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { addMonths, format } from 'date-fns';

export interface Lancamento {
  id: string;
  user_id: string;
  data: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  cliente_id?: string;
  fornecedor_id?: string;
  observacoes?: string;
  status: string;
  recorrente: boolean;
  meses_recorrencia?: number | null;
  lancamento_pai_id?: string | null;
  created_at: string;
  updated_at: string;
}

export const useLancamentos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useQuery = () => {
    return useReactQuery({
      queryKey: ['lancamentos'],
      queryFn: async () => {
        console.log('Buscando lançamentos');
        
        const { data, error } = await supabase
          .from('lancamentos')
          .select(`
            *,
            cliente:cadastros!cliente_id(nome),
            fornecedor:cadastros!fornecedor_id(nome)
          `)
          .order('data', { ascending: false });

        if (error) {
          console.error('Erro ao buscar lançamentos:', error);
          throw error;
        }

        console.log('Lançamentos encontrados:', data);
        return data as (Lancamento & {
          cliente?: { nome: string } | null;
          fornecedor?: { nome: string } | null;
        })[];
      },
    });
  };

  const criarLancamentosRecorrentes = async (lancamentoData: any, mesesRecorrencia: number) => {
    const lancamentosParaCriar = [];
    const dataInicial = new Date(lancamentoData.data);
    
    // Criar o lançamento principal
    const { data: lancamentoPrincipal, error: erroLancamentoPrincipal } = await supabase
      .from('lancamentos')
      .insert([{
        ...lancamentoData,
        recorrente: true,
        meses_recorrencia: mesesRecorrencia,
        lancamento_pai_id: null
      }])
      .select()
      .single();

    if (erroLancamentoPrincipal) {
      throw erroLancamentoPrincipal;
    }

    console.log('Lançamento principal criado:', lancamentoPrincipal);

    // Criar os lançamentos futuros
    for (let i = 1; i <= mesesRecorrencia; i++) {
      const dataFutura = addMonths(dataInicial, i);
      lancamentosParaCriar.push({
        ...lancamentoData,
        data: format(dataFutura, 'yyyy-MM-dd'),
        recorrente: false,
        meses_recorrencia: null,
        lancamento_pai_id: lancamentoPrincipal.id
      });
    }

    if (lancamentosParaCriar.length > 0) {
      const { error: erroLancamentosFuturos } = await supabase
        .from('lancamentos')
        .insert(lancamentosParaCriar);

      if (erroLancamentosFuturos) {
        console.error('Erro ao criar lançamentos futuros:', erroLancamentosFuturos);
        throw erroLancamentosFuturos;
      }

      console.log(`${lancamentosParaCriar.length} lançamentos futuros criados`);
    }

    return lancamentoPrincipal;
  };

  const useCreate = () => {
    return useMutation({
      mutationFn: async (lancamentoData: Omit<Lancamento, 'id' | 'created_at' | 'updated_at'>) => {
        console.log('Criando lançamento:', lancamentoData);
        
        // Validar dados obrigatórios
        if (!lancamentoData.data || !lancamentoData.tipo || !lancamentoData.categoria || !lancamentoData.valor) {
          throw new Error('Data, tipo, categoria e valor são obrigatórios');
        }

        if (!lancamentoData.user_id) {
          throw new Error('User ID é obrigatório');
        }

        // Se for recorrente, usar função especial
        if (lancamentoData.recorrente && lancamentoData.meses_recorrencia && lancamentoData.meses_recorrencia > 0) {
          return await criarLancamentosRecorrentes(lancamentoData, lancamentoData.meses_recorrencia);
        }

        // Lançamento simples
        const { data, error } = await supabase
          .from('lancamentos')
          .insert([{
            ...lancamentoData,
            recorrente: false,
            meses_recorrencia: null,
            lancamento_pai_id: null
          }])
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar lançamento:', error);
          throw error;
        }
        
        console.log('Lançamento criado com sucesso:', data);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
        console.log('Query invalidada após criação');
      },
      onError: (error: any) => {
        console.error('Erro na mutation de criação:', error);
      },
    });
  };

  const useUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, ...updateData }: Partial<Lancamento> & { id: string }) => {
        console.log('Atualizando lançamento ID:', id);
        console.log('Dados recebidos para atualização:', updateData);
        
        if (!id) {
          throw new Error('ID do lançamento é obrigatório para atualização');
        }

        // Remove campos que não devem ser atualizados
        const { created_at, updated_at, user_id, status, ...dataToUpdate } = updateData;
        
        console.log('Dados que serão enviados para atualização (limpos):', dataToUpdate);

        const { data, error } = await supabase
          .from('lancamentos')
          .update(dataToUpdate)
          .eq('id', id)
          .select(`
            *,
            cliente:cadastros!cliente_id(nome),
            fornecedor:cadastros!fornecedor_id(nome)
          `)
          .single();

        if (error) {
          console.error('Erro ao atualizar lançamento:', error);
          console.error('Erro details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }
        
        console.log('Lançamento atualizado com sucesso:', data);
        return data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
        console.log('Query invalidada após atualização, dados:', data);
        toast({
          title: "Sucesso",
          description: "Lançamento atualizado com sucesso!",
        });
      },
      onError: (error: any) => {
        console.error('Erro na mutation de atualização:', error);
        toast({
          title: "Erro",
          description: error.message || "Erro ao atualizar lançamento. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  const useDelete = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        console.log('Excluindo lançamento:', id);
        
        const { error } = await supabase
          .from('lancamentos')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Erro ao excluir lançamento:', error);
          throw error;
        }
        
        console.log('Lançamento excluído com sucesso');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
        toast({
          title: "Sucesso",
          description: "Lançamento excluído com sucesso!",
        });
      },
      onError: (error: any) => {
        console.error('Erro ao excluir lançamento:', error);
        toast({
          title: "Erro",
          description: error.message || "Erro ao excluir lançamento. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useQuery,
    useCreate,
    useUpdate,
    useDelete,
  };
};
