
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
          .order('created_at', { ascending: false });

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
              ...data,
              user_id: session.user.id,
              updated_at: new Date().toISOString()
            })
            .eq('id', data.id)
            .eq('user_id', session.user.id)
            .select()
            .single();

          if (error) {
            console.error('useEstoques - Error updating estoque:', error);
            throw error;
          }
          
          console.log('useEstoques - Updated estoque:', result);
          return result;
        } else {
          // Criação
          const { data: result, error } = await supabase
            .from('estoques')
            .insert({
              ...data,
              user_id: session.user.id,
            })
            .select()
            .single();

          if (error) {
            console.error('useEstoques - Error creating estoque:', error);
            throw error;
          }
          
          console.log('useEstoques - Created estoque:', result);
          return result;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['estoques'] });
        toast({
          title: "Sucesso!",
          description: "Item de estoque salvo com sucesso",
        });
      },
      onError: (error: any) => {
        console.error('useEstoques - Error with estoque:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar item de estoque: " + error.message,
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
        
        console.log('useEstoques - Deleting estoque:', id);
        
        const { error } = await supabase
          .from('estoques')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);

        if (error) {
          console.error('useEstoques - Error deleting estoque:', error);
          throw error;
        }
        
        console.log('useEstoques - Deleted estoque:', id);
        return id;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['estoques'] });
        toast({
          title: "Sucesso!",
          description: "Item de estoque excluído com sucesso",
        });
      },
      onError: (error: any) => {
        console.error('useEstoques - Error deleting estoque:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir item de estoque: " + error.message,
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
