
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCadastros = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para cadastros
  const useCadastrosQueryHook = () => {
    return useQuery({
      queryKey: ['cadastros'],
      queryFn: async () => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useCadastros - Fetching cadastros for user:', session.user.id);
        
        const { data, error } = await supabase
          .from('cadastros')
          .select('*')
          .eq('user_id', session.user.id)
          .order('nome');

        if (error) {
          console.error('useCadastros - Error fetching cadastros:', error);
          throw error;
        }
        
        console.log('useCadastros - Fetched cadastros:', data);
        return data;
      },
      enabled: !!session?.user?.id,
    });
  };

  // Mutation para criar/atualizar cadastro
  const useCadastrosCreateHook = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useCadastros - Creating/updating cadastro:', data);
        
        if (data.id) {
          // Atualização
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
            throw error;
          }
          
          console.log('useCadastros - Updated cadastro:', result);
          return result;
        } else {
          // Criação
          const insertData = {
            data: data.data,
            tipo: data.tipo,
            pessoa: data.pessoa,
            nome: data.nome,
            documento: data.documento,
            endereco: data.endereco || null,
            numero: data.numero || null,
            cidade: data.cidade || null,
            estado: data.estado || null,
            email: data.email || null,
            telefone: data.telefone || null,
            observacoes: data.observacoes || null,
            anexo_url: data.anexo_url || null,
            salario: data.salario || null,
            status: data.status || 'ativo',
            user_id: session.user.id,
          };

          console.log('useCadastros - Insert data:', insertData);

          const { data: result, error } = await supabase
            .from('cadastros')
            .insert(insertData)
            .select()
            .single();

          if (error) {
            console.error('useCadastros - Error creating cadastro:', error);
            throw error;
          }
          
          console.log('useCadastros - Created cadastro:', result);
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
        console.error('useCadastros - Error with cadastro:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar cadastro: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para deletar cadastro
  const useCadastrosDeleteHook = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('useCadastros - Deleting cadastro:', id);
        
        const { error } = await supabase
          .from('cadastros')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);

        if (error) {
          console.error('useCadastros - Error deleting cadastro:', error);
          throw error;
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
          description: "Erro ao excluir cadastro: " + error.message,
          variant: "destructive",
        });
      },
    });
  };

  return {
    useQuery: useCadastrosQueryHook,
    useCreate: useCadastrosCreateHook,
    useDelete: useCadastrosDeleteHook,
  };
};
