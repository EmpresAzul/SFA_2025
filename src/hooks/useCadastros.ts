
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

        return data as Cadastro[];
      },
    });
  };

  const useCreate = () => {
    return useMutation({
      mutationFn: async (cadastroData: Omit<Cadastro, 'id' | 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase
          .from('cadastros')
          .insert([cadastroData])
          .select()
          .single();

        if (error) throw error;
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
          description: "Erro ao criar cadastro. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  const useUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, ...updateData }: Partial<Cadastro> & { id: string }) => {
        const { data, error } = await supabase
          .from('cadastros')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
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
          description: "Erro ao atualizar cadastro. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  const useDelete = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase
          .from('cadastros')
          .delete()
          .eq('id', id);

        if (error) throw error;
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
          description: "Erro ao excluir cadastro. Tente novamente.",
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
