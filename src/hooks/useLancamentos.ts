
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useLancamentos = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para lançamentos
  const useLancamentosQuery = () => {
    return useQuery({
      queryKey: ['lancamentos'],
      queryFn: async () => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useLancamentos - Fetching lancamentos for user:', session.user.id);
        
        const { data, error } = await supabase
          .from('lancamentos')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'ativo')
          .order('data', { ascending: false });

        if (error) {
          console.error('useLancamentos - Error fetching lancamentos:', error);
          throw error;
        }
        
        console.log('useLancamentos - Fetched lancamentos:', data);
        return data;
      },
      enabled: !!session?.user?.id,
    });
  };

  // Mutation para criar/atualizar lançamento
  const useLancamentosCreate = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useLancamentos - Creating/updating lancamento:', data);
        
        if (data.id) {
          // Atualização
          const { data: result, error } = await supabase
            .from('lancamentos')
            .update({
              data: data.data,
              tipo: data.tipo,
              categoria: data.categoria,
              valor: data.valor,
              cliente_id: data.cliente_id,
              fornecedor_id: data.fornecedor_id,
              observacoes: data.observacoes,
              status: data.status,
              updated_at: new Date().toISOString()
            })
            .eq('id', data.id)
            .eq('user_id', session.user.id)
            .select()
            .single();

          if (error) throw error;
          return result;
        } else {
          // Criação
          const { data: result, error } = await supabase
            .from('lancamentos')
            .insert({
              data: data.data,
              tipo: data.tipo,
              categoria: data.categoria,
              valor: data.valor,
              cliente_id: data.cliente_id,
              fornecedor_id: data.fornecedor_id,
              observacoes: data.observacoes,
              status: data.status || 'ativo',
              user_id: session.user.id,
            })
            .select()
            .single();

          if (error) throw error;
          return result;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
        toast({
          title: "Sucesso!",
          description: "Lançamento salvo com sucesso",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro",
          description: "Erro ao salvar lançamento: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para deletar lançamento
  const useLancamentosDelete = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        const { error } = await supabase
          .from('lancamentos')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);

        if (error) throw error;
        return id;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
        toast({
          title: "Sucesso!",
          description: "Lançamento excluído com sucesso",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro",
          description: "Erro ao excluir lançamento: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  return {
    useQuery: useLancamentosQuery,
    useCreate: useLancamentosCreate,
    useDelete: useLancamentosDelete,
  };
};
