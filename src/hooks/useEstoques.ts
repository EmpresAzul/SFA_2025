
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useEstoques = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para estoques
  const useEstoquesQuery = () => {
    return useQuery({
      queryKey: ['estoques'],
      queryFn: async () => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useEstoques - Fetching estoques for user:', session.user.id);
        
        const { data, error } = await supabase
          .from('estoques')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'ativo')
          .order('nome_produto');

        if (error) {
          console.error('useEstoques - Error fetching estoques:', error);
          throw error;
        }
        
        console.log('useEstoques - Fetched estoques:', data);
        return data;
      },
      enabled: !!session?.user?.id,
    });
  };

  // Mutation para criar/atualizar estoque
  const useEstoquesCreate = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useEstoques - Creating/updating estoque:', data);
        
        if (data.id) {
          // Atualização
          const { data: result, error } = await supabase
            .from('estoques')
            .update({
              data: data.data,
              nome_produto: data.nome_produto,
              quantidade: data.quantidade,
              valor_unitario: data.valor_unitario,
              valor_total: data.valor_total,
              quantidade_bruta: data.quantidade_bruta,
              quantidade_liquida: data.quantidade_liquida,
              unidade_medida: data.unidade_medida,
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
            .from('estoques')
            .insert({
              data: data.data,
              nome_produto: data.nome_produto,
              quantidade: data.quantidade,
              valor_unitario: data.valor_unitario,
              valor_total: data.valor_total,
              quantidade_bruta: data.quantidade_bruta,
              quantidade_liquida: data.quantidade_liquida,
              unidade_medida: data.unidade_medida,
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
        queryClient.invalidateQueries({ queryKey: ['estoques'] });
        toast({
          title: "Sucesso!",
          description: "Estoque salvo com sucesso",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro",
          description: "Erro ao salvar estoque: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para deletar estoque
  const useEstoquesDelete = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        const { error } = await supabase
          .from('estoques')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);

        if (error) throw error;
        return id;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['estoques'] });
        toast({
          title: "Sucesso!",
          description: "Estoque excluído com sucesso",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro",
          description: "Erro ao excluir estoque: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  return {
    useQuery: useEstoquesQuery,
    useCreate: useEstoquesCreate,
    useDelete: useEstoquesDelete,
  };
};
