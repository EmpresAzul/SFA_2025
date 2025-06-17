
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
        const { data, error } = await supabase
          .from('precificacao')
          .select('*')
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
        const { data: result, error } = await supabase
          .from('precificacao')
          .insert(data)
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar precificação:', error);
          throw error;
        }

        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['precificacao'] });
        toast({
          title: "Sucesso!",
          description: "Item cadastrado com êxito.",
        });
      },
      onError: (error) => {
        console.error('Erro na mutação de criação:', error);
        toast({
          title: "Erro",
          description: "Erro ao cadastrar item. Tente novamente.",
          variant: "destructive",
        });
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
