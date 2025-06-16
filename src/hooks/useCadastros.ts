
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCadastros = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para buscar cadastros
  const useCadastrosQuery = () => {
    return useQuery({
      queryKey: ['cadastros', session?.user?.id],
      queryFn: async () => {
        if (!session?.user?.id) {
          console.log('useCadastros - No authenticated user');
          throw new Error('User not authenticated');
        }
        
        console.log('useCadastros - Fetching cadastros for user:', session.user.id);
        
        const { data, error } = await supabase
          .from('cadastros')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('useCadastros - Error fetching cadastros:', error);
          throw error;
        }
        
        console.log('useCadastros - Fetched cadastros:', data);
        return data || [];
      },
      enabled: !!session?.user?.id,
      retry: 3,
      staleTime: 30000,
    });
  };

  // Mutation para criar/atualizar cadastro
  const useCreateCadastro = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        if (!session?.user?.id) {
          console.log('useCadastros - No authenticated user for create/update');
          throw new Error('User not authenticated');
        }
        
        console.log('useCadastros - Creating/updating cadastro:', data);
        
        // Normalizar o tipo para evitar problemas com check constraint
        let tipoNormalizado = data.tipo;
        if (data.tipo === 'Funcionário') {
          tipoNormalizado = 'Funcionario';
        }
        
        // Preparar dados para inserção/atualização
        const cadastroData = {
          data: data.data,
          tipo: tipoNormalizado,
          pessoa: data.pessoa,
          nome: data.nome.trim(),
          documento: data.documento?.replace(/\D/g, '') || null,
          endereco: data.endereco?.trim() || null,
          numero: data.numero?.trim() || null,
          cidade: data.cidade?.trim() || null,
          estado: data.estado?.trim().toUpperCase() || null,
          email: data.email?.trim() || null,
          telefone: data.telefone?.replace(/\D/g, '') || null,
          observacoes: data.observacoes?.trim() || null,
          anexo_url: data.anexo_url?.trim() || null,
          salario: data.salario && data.salario > 0 ? data.salario : null,
          status: data.status || 'ativo',
          user_id: session.user.id,
        };

        if (data.id) {
          // Atualização
          console.log('useCadastros - Updating cadastro with ID:', data.id);
          
          const { data: result, error } = await supabase
            .from('cadastros')
            .update({
              ...cadastroData,
              updated_at: new Date().toISOString()
            })
            .eq('id', data.id)
            .eq('user_id', session.user.id)
            .select()
            .single();

          if (error) {
            console.error('useCadastros - Error updating cadastro:', error);
            throw new Error(`Erro ao atualizar cadastro: ${error.message}`);
          }
          
          console.log('useCadastros - Updated cadastro:', result);
          return result;
        } else {
          // Criação
          console.log('useCadastros - Creating new cadastro with data:', cadastroData);

          const { data: result, error } = await supabase
            .from('cadastros')
            .insert(cadastroData)
            .select()
            .single();

          if (error) {
            console.error('useCadastros - Error creating cadastro:', error);
            throw new Error(`Erro ao criar cadastro: ${error.message}`);
          }
          
          console.log('useCadastros - Created cadastro:', result);
          return result;
        }
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['cadastros'] });
        console.log('useCadastros - Mutation success:', data);
        toast({
          title: "Sucesso!",
          description: variables.id ? "Cadastro atualizado com sucesso!" : "Cadastro criado com sucesso!",
        });
      },
      onError: (error: any) => {
        console.error('useCadastros - Mutation error:', error);
        toast({
          title: "Erro",
          description: error?.message || "Erro ao salvar cadastro. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para deletar cadastro
  const useDeleteCadastro = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        if (!session?.user?.id) {
          throw new Error('User not authenticated');
        }
        
        console.log('useCadastros - Deleting cadastro:', id);
        
        const { error } = await supabase
          .from('cadastros')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);

        if (error) {
          console.error('useCadastros - Error deleting cadastro:', error);
          throw new Error(`Erro ao excluir cadastro: ${error.message}`);
        }
        
        console.log('useCadastros - Deleted cadastro:', id);
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
        console.error('useCadastros - Error deleting cadastro:', error);
        toast({
          title: "Erro",
          description: error?.message || "Erro ao excluir cadastro. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useCadastrosQuery,
    useCreateCadastro,
    useDeleteCadastro,
  };
};
