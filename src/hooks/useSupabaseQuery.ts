
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseQuery = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para cadastros
  const useCadastros = () => {
    return useQuery({
      queryKey: ['cadastros'],
      queryFn: async () => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSupabaseQuery - Fetching cadastros for user:', session.user.id);
        
        const { data, error } = await supabase
          .from('cadastros')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'ativo')
          .order('nome');

        if (error) {
          console.error('useSupabaseQuery - Error fetching cadastros:', error);
          throw error;
        }
        
        console.log('useSupabaseQuery - Fetched cadastros:', data);
        return data;
      },
      enabled: !!session?.user?.id,
    });
  };

  // Query para estoques
  const useEstoques = () => {
    return useQuery({
      queryKey: ['estoques'],
      queryFn: async () => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSupabaseQuery - Fetching estoques for user:', session.user.id);
        
        const { data, error } = await supabase
          .from('estoques')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'ativo')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('useSupabaseQuery - Error fetching estoques:', error);
          throw error;
        }
        
        console.log('useSupabaseQuery - Fetched estoques:', data);
        return data;
      },
      enabled: !!session?.user?.id,
    });
  };

  // Query para lançamentos
  const useLancamentos = () => {
    return useQuery({
      queryKey: ['lancamentos'],
      queryFn: async () => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSupabaseQuery - Fetching lancamentos for user:', session.user.id);
        
        const { data, error } = await supabase
          .from('lancamentos')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'ativo')
          .order('data', { ascending: false });

        if (error) {
          console.error('useSupabaseQuery - Error fetching lancamentos:', error);
          throw error;
        }
        
        console.log('useSupabaseQuery - Fetched lancamentos:', data);
        return data;
      },
      enabled: !!session?.user?.id,
    });
  };

  // Query para saldos bancários
  const useSaldosBancarios = () => {
    return useQuery({
      queryKey: ['saldos_bancarios'],
      queryFn: async () => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSupabaseQuery - Fetching saldos_bancarios for user:', session.user.id);
        
        const { data, error } = await supabase
          .from('saldos_bancarios')
          .select('*')
          .eq('user_id', session.user.id)
          .order('data', { ascending: false });

        if (error) {
          console.error('useSupabaseQuery - Error fetching saldos_bancarios:', error);
          throw error;
        }
        
        console.log('useSupabaseQuery - Fetched saldos_bancarios:', data);
        return data;
      },
      enabled: !!session?.user?.id,
    });
  };

  // Mutation para criar cadastro
  const useCreateCadastro = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSupabaseQuery - Creating cadastro:', data);
        
        const { data: result, error } = await supabase
          .from('cadastros')
          .insert({
            ...data,
            user_id: session.user.id,
          })
          .select()
          .single();

        if (error) {
          console.error('useSupabaseQuery - Error creating cadastro:', error);
          throw error;
        }
        
        console.log('useSupabaseQuery - Created cadastro:', result);
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cadastros'] });
        toast({
          title: "Sucesso!",
          description: "Cadastro criado com sucesso",
        });
      },
      onError: (error: any) => {
        console.error('useSupabaseQuery - Error creating cadastro:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar cadastro: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para criar estoque
  const useCreateEstoque = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSupabaseQuery - Creating estoque:', data);
        
        const { data: result, error } = await supabase
          .from('estoques')
          .insert({
            ...data,
            user_id: session.user.id,
          })
          .select()
          .single();

        if (error) {
          console.error('useSupabaseQuery - Error creating estoque:', error);
          throw error;
        }
        
        console.log('useSupabaseQuery - Created estoque:', result);
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['estoques'] });
        toast({
          title: "Sucesso!",
          description: "Item de estoque criado com sucesso",
        });
      },
      onError: (error: any) => {
        console.error('useSupabaseQuery - Error creating estoque:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar item de estoque: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para criar lançamento
  const useCreateLancamento = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSupabaseQuery - Creating lancamento:', data);
        
        const { data: result, error } = await supabase
          .from('lancamentos')
          .insert({
            ...data,
            user_id: session.user.id,
          })
          .select()
          .single();

        if (error) {
          console.error('useSupabaseQuery - Error creating lancamento:', error);
          throw error;
        }
        
        console.log('useSupabaseQuery - Created lancamento:', result);
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
        toast({
          title: "Sucesso!",
          description: "Lançamento criado com sucesso",
        });
      },
      onError: (error: any) => {
        console.error('useSupabaseQuery - Error creating lancamento:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar lançamento: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para criar saldo bancário
  const useCreateSaldoBancario = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSupabaseQuery - Creating saldo bancario:', data);
        
        const { data: result, error } = await supabase
          .from('saldos_bancarios')
          .insert({
            ...data,
            user_id: session.user.id,
          })
          .select()
          .single();

        if (error) {
          console.error('useSupabaseQuery - Error creating saldo bancario:', error);
          throw error;
        }
        
        console.log('useSupabaseQuery - Created saldo bancario:', result);
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['saldos_bancarios'] });
        toast({
          title: "Sucesso!",
          description: "Saldo bancário criado com sucesso",
        });
      },
      onError: (error: any) => {
        console.error('useSupabaseQuery - Error creating saldo bancario:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar saldo bancário: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  return {
    // Queries
    useCadastros,
    useEstoques,
    useLancamentos,
    useSaldosBancarios,
    
    // Mutations
    useCreateCadastro,
    useCreateEstoque,
    useCreateLancamento,
    useCreateSaldoBancario,
  };
};
