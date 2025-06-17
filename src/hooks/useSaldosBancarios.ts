
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useSaldosBancarios = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para saldos bancários
  const useSaldosBancariosQuery = () => {
    return useQuery({
      queryKey: ['saldos_bancarios'],
      queryFn: async () => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSaldosBancarios - Fetching saldos bancarios for user:', session.user.id);
        
        const { data, error } = await supabase
          .from('saldos_bancarios')
          .select('*')
          .eq('user_id', session.user.id)
          .order('data', { ascending: false });

        if (error) {
          console.error('useSaldosBancarios - Error fetching saldos bancarios:', error);
          throw error;
        }
        
        console.log('useSaldosBancarios - Fetched saldos bancarios:', data);
        return data;
      },
      enabled: !!session?.user?.id,
    });
  };

  // Mutation para criar saldo bancário
  const useSaldosBancariosCreate = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSaldosBancarios - Creating saldo bancario:', data);
        
        const { data: result, error } = await supabase
          .from('saldos_bancarios')
          .insert({
            data: data.data || new Date().toISOString().split('T')[0],
            banco: data.banco,
            saldo: data.saldo,
            user_id: session.user.id,
          })
          .select()
          .single();

        if (error) {
          console.error('useSaldosBancarios - Error creating saldo bancario:', error);
          throw error;
        }
        
        console.log('useSaldosBancarios - Created saldo bancario:', result);
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['saldos_bancarios'] });
        toast({
          title: "Sucesso!",
          description: "Saldo bancário salvo com sucesso",
        });
      },
      onError: (error: any) => {
        console.error('useSaldosBancarios - Error with saldo bancario:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar saldo bancário: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para atualizar saldo bancário
  const useSaldosBancariosUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: any }) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSaldosBancarios - Updating saldo bancario:', id, data);
        
        const { data: result, error } = await supabase
          .from('saldos_bancarios')
          .update({
            data: data.data || new Date().toISOString().split('T')[0],
            banco: data.banco,
            saldo: data.saldo,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .eq('user_id', session.user.id)
          .select()
          .single();

        if (error) {
          console.error('useSaldosBancarios - Error updating saldo bancario:', error);
          throw error;
        }
        
        console.log('useSaldosBancarios - Updated saldo bancario:', result);
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['saldos_bancarios'] });
        toast({
          title: "Sucesso!",
          description: "Saldo bancário atualizado com sucesso",
        });
      },
      onError: (error: any) => {
        console.error('useSaldosBancarios - Error updating saldo bancario:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar saldo bancário: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para deletar saldo bancário
  const useSaldosBancariosDelete = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSaldosBancarios - Deleting saldo bancario:', id);
        
        const { error } = await supabase
          .from('saldos_bancarios')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);

        if (error) {
          console.error('useSaldosBancarios - Error deleting saldo bancario:', error);
          throw error;
        }
        
        console.log('useSaldosBancarios - Deleted saldo bancario:', id);
        return id;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['saldos_bancarios'] });
        toast({
          title: "Sucesso!",
          description: "Saldo bancário excluído com sucesso",
        });
      },
      onError: (error: any) => {
        console.error('useSaldosBancarios - Error deleting saldo bancario:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir saldo bancário: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  return {
    useQuery: useSaldosBancariosQuery,
    useCreate: useSaldosBancariosCreate,
    useUpdate: useSaldosBancariosUpdate,
    useDelete: useSaldosBancariosDelete,
  };
};
