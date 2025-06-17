
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Precificacao = Database['public']['Tables']['precificacao']['Row'];
type PrecificacaoInsert = Database['public']['Tables']['precificacao']['Insert'];
type PrecificacaoUpdate = Database['public']['Tables']['precificacao']['Update'];

export const usePrecificacao = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useQueryHook = () => {
    return useQuery({
      queryKey: ['precificacao'],
      queryFn: async () => {
        console.log('Buscando dados de precificação...');
        
        // Obter o usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('Usuário não autenticado');
          return [];
        }

        const { data, error } = await supabase
          .from('precificacao')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar precificação:', error);
          throw error;
        }

        console.log('Dados de precificação carregados:', data);
        return data as Precificacao[];
      },
    });
  };

  const useCreate = () => {
    return useMutation({
      mutationFn: async (data: PrecificacaoInsert) => {
        console.log('Criando item de precificação:', data);
        
        // Garantir que o user_id está presente
        if (!data.user_id) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            throw new Error('Usuário não autenticado');
          }
          data.user_id = user.id;
        }

        const { data: result, error } = await supabase
          .from('precificacao')
          .insert(data)
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar precificação:', error);
          throw error;
        }

        console.log('Item de precificação criado com sucesso:', result);
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['precificacao'] });
        console.log('Query de precificação invalidada após criação');
      },
      onError: (error) => {
        console.error('Erro na mutação de criação:', error);
      },
    });
  };

  const useUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: PrecificacaoUpdate }) => {
        console.log('Atualizando item de precificação:', id, data);
        const { data: result, error } = await supabase
          .from('precificacao')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Erro ao atualizar precificação:', error);
          throw error;
        }

        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['precificacao'] });
        toast({
          title: "Sucesso!",
          description: "Item atualizado com êxito.",
        });
      },
      onError: (error) => {
        console.error('Erro na mutação de atualização:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar item. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  const useDelete = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        console.log('Excluindo item de precificação:', id);
        const { error } = await supabase
          .from('precificacao')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Erro ao excluir precificação:', error);
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['precificacao'] });
        toast({
          title: "Sucesso!",
          description: "Item excluído com êxito.",
        });
      },
      onError: (error) => {
        console.error('Erro na mutação de exclusão:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir item. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useQuery: useQueryHook,
    useCreate,
    useUpdate,
    useDelete,
  };
};
