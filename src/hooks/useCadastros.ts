
import { useQuery as useReactQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Cadastro {
  id: string;
  user_id: string;
  nome: string;
  tipo: 'Cliente' | 'Fornecedor' | 'Funcionário';
  pessoa: 'Física' | 'Jurídica';
  cpf_cnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  salario?: number;
  data: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useCadastros = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useQuery = (tipo?: 'Cliente' | 'Fornecedor' | 'Funcionário') => {
    return useReactQuery({
      queryKey: ['cadastros', tipo],
      queryFn: async () => {
        console.log('Buscando cadastros, tipo:', tipo);
        let query = supabase
          .from('cadastros')
          .select('*')
          .order('nome', { ascending: true });

        if (tipo) {
          query = query.eq('tipo', tipo);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar cadastros:', error);
          throw error;
        }

        console.log('Cadastros encontrados:', data);
        return data as Cadastro[];
      },
    });
  };

  const useCreate = () => {
    return useMutation({
      mutationFn: async (cadastroData: Omit<Cadastro, 'id' | 'created_at' | 'updated_at'>) => {
        console.log('Criando cadastro:', cadastroData);
        
        // Validar dados obrigatórios
        if (!cadastroData.nome || !cadastroData.tipo || !cadastroData.pessoa) {
          throw new Error('Nome, tipo e pessoa são obrigatórios');
        }

        const { data, error } = await supabase
          .from('cadastros')
          .insert([cadastroData])
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar cadastro:', error);
          throw error;
        }
        
        console.log('Cadastro criado com sucesso:', data);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cadastros'] });
        toast({
          title: "Sucesso",
          description: "Cadastro criado com sucesso!",
        });
      },
      onError: (error: any) => {
        console.error('Erro ao criar cadastro:', error);
        toast({
          title: "Erro",
          description: error.message || "Erro ao criar cadastro. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  const useUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, ...updateData }: Partial<Cadastro> & { id: string }) => {
        console.log('Atualizando cadastro:', id, updateData);
        
        const { data, error } = await supabase
          .from('cadastros')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Erro ao atualizar cadastro:', error);
          throw error;
        }
        
        console.log('Cadastro atualizado com sucesso:', data);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cadastros'] });
        toast({
          title: "Sucesso",
          description: "Cadastro atualizado com sucesso!",
        });
      },
      onError: (error: any) => {
        console.error('Erro ao atualizar cadastro:', error);
        toast({
          title: "Erro",
          description: error.message || "Erro ao atualizar cadastro. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  const useDelete = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        console.log('Excluindo cadastro:', id);
        
        const { error } = await supabase
          .from('cadastros')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Erro ao excluir cadastro:', error);
          throw error;
        }
        
        console.log('Cadastro excluído com sucesso');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cadastros'] });
        toast({
          title: "Sucesso",
          description: "Cadastro excluído com sucesso!",
        });
      },
      onError: (error: any) => {
        console.error('Erro ao excluir cadastro:', error);
        toast({
          title: "Erro",
          description: error.message || "Erro ao excluir cadastro. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useQuery,
    useCreate,
    useUpdate,
    useDelete,
  };
};
