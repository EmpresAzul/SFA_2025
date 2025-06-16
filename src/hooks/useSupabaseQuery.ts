
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
        
        console.log('useSupabaseQuery - Creating/updating cadastro:', data);
        
        if (data.id) {
          // Atualização
          const { data: result, error } = await supabase
            .from('cadastros')
            .update({
              tipo: data.tipo,
              nome: data.nome,
              documento: data.documento,
              endereco: data.endereco,
              cidade: data.cidade,
              estado: data.estado,
              email: data.email,
              telefone: data.telefone,
              status: data.status,
              updated_at: new Date().toISOString()
            })
            .eq('id', data.id)
            .eq('user_id', session.user.id)
            .select()
            .single();

          if (error) {
            console.error('useSupabaseQuery - Error updating cadastro:', error);
            throw error;
          }
          
          console.log('useSupabaseQuery - Updated cadastro:', result);
          return result;
        } else {
          // Criação
          const { data: result, error } = await supabase
            .from('cadastros')
            .insert({
              tipo: data.tipo,
              nome: data.nome,
              documento: data.documento,
              endereco: data.endereco,
              cidade: data.cidade,
              estado: data.estado,
              email: data.email,
              telefone: data.telefone,
              status: data.status || 'ativo',
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
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cadastros'] });
        toast({
          title: "Sucesso!",
          description: "Cadastro salvo com sucesso",
        });
      },
      onError: (error: any) => {
        console.error('useSupabaseQuery - Error with cadastro:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar cadastro: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para deletar cadastro
  const useDeleteCadastro = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSupabaseQuery - Deleting cadastro:', id);
        
        const { error } = await supabase
          .from('cadastros')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);

        if (error) {
          console.error('useSupabaseQuery - Error deleting cadastro:', error);
          throw error;
        }
        
        console.log('useSupabaseQuery - Deleted cadastro:', id);
        return id;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cadastros'] });
        toast({
          title: "Sucesso!",
          description: "Cadastro excluído com sucesso",
        });
      },
      onError: (error: any) => {
        console.error('useSupabaseQuery - Error deleting cadastro:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir cadastro: " + error.message,
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
        
        console.log('useSupabaseQuery - Creating/updating estoque:', data);
        
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
            console.error('useSupabaseQuery - Error updating estoque:', error);
            throw error;
          }
          
          console.log('useSupabaseQuery - Updated estoque:', result);
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
            console.error('useSupabaseQuery - Error creating estoque:', error);
            throw error;
          }
          
          console.log('useSupabaseQuery - Created estoque:', result);
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
        console.error('useSupabaseQuery - Error with estoque:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar item de estoque: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para deletar estoque
  const useDeleteEstoque = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSupabaseQuery - Deleting estoque:', id);
        
        const { error } = await supabase
          .from('estoques')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);

        if (error) {
          console.error('useSupabaseQuery - Error deleting estoque:', error);
          throw error;
        }
        
        console.log('useSupabaseQuery - Deleted estoque:', id);
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
        console.error('useSupabaseQuery - Error deleting estoque:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir item de estoque: " + error.message,
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
        
        console.log('useSupabaseQuery - Creating/updating lancamento:', data);
        
        if (data.id) {
          // Atualização
          const { data: result, error } = await supabase
            .from('lancamentos')
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
            console.error('useSupabaseQuery - Error updating lancamento:', error);
            throw error;
          }
          
          console.log('useSupabaseQuery - Updated lancamento:', result);
          return result;
        } else {
          // Criação
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
        console.error('useSupabaseQuery - Error with lancamento:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar lançamento: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para deletar lançamento
  const useDeleteLancamento = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSupabaseQuery - Deleting lancamento:', id);
        
        const { error } = await supabase
          .from('lancamentos')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);

        if (error) {
          console.error('useSupabaseQuery - Error deleting lancamento:', error);
          throw error;
        }
        
        console.log('useSupabaseQuery - Deleted lancamento:', id);
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
        console.error('useSupabaseQuery - Error deleting lancamento:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir lançamento: " + error.message,
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
        
        console.log('useSupabaseQuery - Creating/updating saldo bancario:', data);
        
        if (data.id) {
          // Atualização
          const { data: result, error } = await supabase
            .from('saldos_bancarios')
            .update({
              data: data.data,
              banco: data.banco,
              saldo: data.saldo,
              updated_at: new Date().toISOString()
            })
            .eq('id', data.id)
            .eq('user_id', session.user.id)
            .select()
            .single();

          if (error) {
            console.error('useSupabaseQuery - Error updating saldo bancario:', error);
            throw error;
          }
          
          console.log('useSupabaseQuery - Updated saldo bancario:', result);
          return result;
        } else {
          // Criação
          const { data: result, error } = await supabase
            .from('saldos_bancarios')
            .insert({
              data: data.data,
              banco: data.banco,
              saldo: data.saldo,
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
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['saldos_bancarios'] });
        toast({
          title: "Sucesso!",
          description: "Saldo bancário salvo com sucesso",
        });
      },
      onError: (error: any) => {
        console.error('useSupabaseQuery - Error with saldo bancario:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar saldo bancário: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para deletar saldo bancário
  const useDeleteSaldoBancario = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useSupabaseQuery - Deleting saldo bancario:', id);
        
        const { error } = await supabase
          .from('saldos_bancarios')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);

        if (error) {
          console.error('useSupabaseQuery - Error deleting saldo bancario:', error);
          throw error;
        }
        
        console.log('useSupabaseQuery - Deleted saldo bancario:', id);
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
        console.error('useSupabaseQuery - Error deleting saldo bancario:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir saldo bancário: " + error.message,
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
    useDeleteCadastro,
    useCreateEstoque,
    useDeleteEstoque,
    useCreateLancamento,
    useDeleteLancamento,
    useCreateSaldoBancario,
    useDeleteSaldoBancario,
  };
};
