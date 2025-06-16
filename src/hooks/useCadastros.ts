
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
          return [];
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

  // Mutation para criar/atualizar cadastro - seguindo padrão do EstoqueForm
  const useCreateCadastro = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        if (!session?.user?.id) {
          console.log('useCadastros - No authenticated user for create/update');
          throw new Error('Usuário não autenticado');
        }
        
        console.log('useCadastros - Creating/updating cadastro:', data);
        
        if (data.id) {
          // Atualização - seguindo padrão do estoque
          const { data: result, error } = await supabase
            .from('cadastros')
            .update({
              data: data.data,
              tipo: data.tipo,
              pessoa: data.pessoa,
              nome: data.nome,
              documento: data.documento,
              endereco: data.endereco,
              numero: data.numero,
              cidade: data.cidade,
              estado: data.estado,
              email: data.email,
              telefone: data.telefone,
              observacoes: data.observacoes,
              anexo_url: data.anexo_url,
              salario: data.salario,
              status: data.status,
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
          // Criação - seguindo padrão do estoque
          const { data: result, error } = await supabase
            .from('cadastros')
            .insert([{
              user_id: session.user.id,
              data: data.data,
              tipo: data.tipo,
              pessoa: data.pessoa,
              nome: data.nome,
              documento: data.documento,
              endereco: data.endereco,
              numero: data.numero,
              cidade: data.cidade,
              estado: data.estado,
              email: data.email,
              telefone: data.telefone,
              observacoes: data.observacoes,
              anexo_url: data.anexo_url,
              salario: data.salario,
              status: data.status
            }])
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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cadastros'] });
      },
      onError: (error: any) => {
        console.error('useCadastros - Mutation error:', error);
      },
    });
  };

  // Mutation para deletar cadastro
  const useDeleteCadastro = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        if (!session?.user?.id) {
          throw new Error('Usuário não autenticado');
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
