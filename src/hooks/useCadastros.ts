
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

  // Mutation para criar cadastro
  const useCreateCadastro = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        if (!session?.user?.id) {
          throw new Error('Usuário não autenticado');
        }
        
        console.log('useCadastros - Creating cadastro with data:', data);
        
        // Validação rigorosa do tipo
        const validTipos = ['Cliente', 'Fornecedor', 'Funcionário'];
        let tipoNormalizado = data.tipo;
        
        if (data.tipo === 'Funcionario') {
          tipoNormalizado = 'Funcionário';
        }
        
        if (!validTipos.includes(tipoNormalizado)) {
          throw new Error(`Tipo inválido: ${data.tipo}. Tipos válidos: ${validTipos.join(', ')}`);
        }

        // Validação rigorosa da pessoa - SEMPRE sem acentos
        let pessoaNormalizada = data.pessoa;
        
        // Normalizar todas as variações possíveis
        if (data.pessoa === 'Física' || data.pessoa === 'física' || data.pessoa === 'FÍSICA') {
          pessoaNormalizada = 'Fisica';
        } else if (data.pessoa === 'Jurídica' || data.pessoa === 'jurídica' || data.pessoa === 'JURÍDICA') {
          pessoaNormalizada = 'Juridica';
        }
        
        // Validação final
        if (!['Fisica', 'Juridica'].includes(pessoaNormalizada)) {
          console.error('useCadastros - Invalid pessoa value:', data.pessoa, 'normalized to:', pessoaNormalizada);
          throw new Error(`Pessoa inválida: ${data.pessoa}. Valores válidos: Fisica, Juridica (sem acentos)`);
        }
        
        const dataToInsert = {
          user_id: session.user.id,
          data: data.data,
          tipo: tipoNormalizado,
          pessoa: pessoaNormalizada, // Garantido sem acentos
          nome: data.nome?.trim(),
          documento: data.documento ? data.documento.replace(/\D/g, '') : null,
          endereco: data.endereco?.trim() || null,
          numero: data.numero?.trim() || null,
          cidade: data.cidade?.trim() || null,
          estado: data.estado?.trim()?.toUpperCase() || null,
          email: data.email?.trim() || null,
          telefone: data.telefone ? data.telefone.replace(/\D/g, '') : null,
          observacoes: data.observacoes?.trim() || null,
          salario: data.salario && data.salario > 0 ? data.salario : null,
          status: data.status || 'ativo'
        };
        
        console.log('useCadastros - Final data to insert (normalized):', dataToInsert);
        
        const { data: result, error } = await supabase
          .from('cadastros')
          .insert([dataToInsert])
          .select()
          .single();

        if (error) {
          console.error('useCadastros - Error creating cadastro:', error);
          
          if (error.message?.includes('pessoa_check')) {
            throw new Error(`Erro no campo Pessoa. O valor '${data.pessoa}' não é válido. Use 'Fisica' ou 'Juridica' (sem acentos).`);
          }
          
          throw new Error(`Erro ao criar cadastro: ${error.message}`);
        }
        
        console.log('useCadastros - Created cadastro successfully:', result);
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cadastros'] });
      },
      onError: (error: any) => {
        console.error('useCadastros - Create mutation error:', error);
      },
    });
  };

  // Mutation para atualizar cadastro
  const useUpdateCadastro = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        if (!session?.user?.id) {
          throw new Error('Usuário não autenticado');
        }
        
        console.log('useCadastros - Updating cadastro with data:', data);
        
        // Validação rigorosa do tipo
        const validTipos = ['Cliente', 'Fornecedor', 'Funcionário'];
        let tipoNormalizado = data.tipo;
        
        if (data.tipo === 'Funcionario') {
          tipoNormalizado = 'Funcionário';
        }
        
        if (!validTipos.includes(tipoNormalizado)) {
          throw new Error(`Tipo inválido: ${data.tipo}. Tipos válidos: ${validTipos.join(', ')}`);
        }

        // Validação rigorosa da pessoa - SEMPRE sem acentos
        let pessoaNormalizada = data.pessoa;
        
        // Normalizar todas as variações possíveis
        if (data.pessoa === 'Física' || data.pessoa === 'física' || data.pessoa === 'FÍSICA') {
          pessoaNormalizada = 'Fisica';
        } else if (data.pessoa === 'Jurídica' || data.pessoa === 'jurídica' || data.pessoa === 'JURÍDICA') {
          pessoaNormalizada = 'Juridica';
        }
        
        // Validação final
        if (!['Fisica', 'Juridica'].includes(pessoaNormalizada)) {
          console.error('useCadastros - Invalid pessoa value:', data.pessoa, 'normalized to:', pessoaNormalizada);
          throw new Error(`Pessoa inválida: ${data.pessoa}. Valores válidos: Fisica, Juridica (sem acentos)`);
        }
        
        const dataToUpdate = {
          data: data.data,
          tipo: tipoNormalizado,
          pessoa: pessoaNormalizada, // Garantido sem acentos
          nome: data.nome?.trim(),
          documento: data.documento ? data.documento.replace(/\D/g, '') : null,
          endereco: data.endereco?.trim() || null,
          numero: data.numero?.trim() || null,
          cidade: data.cidade?.trim() || null,
          estado: data.estado?.trim()?.toUpperCase() || null,
          email: data.email?.trim() || null,
          telefone: data.telefone ? data.telefone.replace(/\D/g, '') : null,
          observacoes: data.observacoes?.trim() || null,
          salario: data.salario && data.salario > 0 ? data.salario : null,
          status: data.status || 'ativo',
          updated_at: new Date().toISOString()
        };
        
        console.log('useCadastros - Final data to update (normalized):', dataToUpdate);
        
        const { data: result, error } = await supabase
          .from('cadastros')
          .update(dataToUpdate)
          .eq('id', data.id)
          .eq('user_id', session.user.id)
          .select()
          .single();

        if (error) {
          console.error('useCadastros - Error updating cadastro:', error);
          
          if (error.message?.includes('pessoa_check')) {
            throw new Error(`Erro no campo Pessoa. O valor '${data.pessoa}' não é válido. Use 'Fisica' ou 'Juridica' (sem acentos).`);
          }
          
          throw new Error(`Erro ao atualizar cadastro: ${error.message}`);
        }
        
        console.log('useCadastros - Updated cadastro successfully:', result);
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cadastros'] });
      },
      onError: (error: any) => {
        console.error('useCadastros - Update mutation error:', error);
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
        
        console.log('useCadastros - Deleted cadastro successfully:', id);
        return id;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cadastros'] });
        toast({
          title: "🎉 Exclusão Realizada com Sucesso!",
          description: "Cadastro excluído com êxito do sistema. Operação realizada com segurança!",
        });
      },
      onError: (error: any) => {
        console.error('useCadastros - Error deleting cadastro:', error);
        toast({
          title: "❌ Erro ao Excluir",
          description: error?.message || "Erro ao excluir cadastro. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useCadastrosQuery,
    useCreateCadastro,
    useUpdateCadastro,
    useDeleteCadastro,
  };
};
