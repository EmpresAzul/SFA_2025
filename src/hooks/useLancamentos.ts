
import { useQuery as useReactQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Lancamento {
  id: string;
  user_id: string;
  data: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  cliente_id?: string;
  fornecedor_id?: string;
  observacoes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useLancamentos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const useQuery = () => {
    return useReactQuery({
      queryKey: ['lancamentos'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('lancamentos')
          .select(`
            *,
            cliente:cadastros!cliente_id(nome),
            fornecedor:cadastros!fornecedor_id(nome)
          `)
          .order('data', { ascending: false });

        if (error) {
          console.error('Erro ao buscar lançamentos:', error);
          throw error;
        }

        return data as (Lancamento & {
          cliente?: { nome: string } | null;
          fornecedor?: { nome: string } | null;
        })[];
      },
    });
  };

  const useCreate = () => {
    return useMutation({
      mutationFn: async (lancamentoData: Omit<Lancamento, 'id' | 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase
          .from('lancamentos')
          .insert([lancamentoData])
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
        toast({
          title: "Sucesso",
          description: "Lançamento criado com sucesso!",
        });
      },
      onError: (error: any) => {
        console.error('Erro ao criar lançamento:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar lançamento. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  const useUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, ...updateData }: Partial<Lancamento> & { id: string }) => {
        const { data, error } = await supabase
          .from('lancamentos')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
        toast({
          title: "Sucesso",
          description: "Lançamento atualizado com sucesso!",
        });
      },
      onError: (error: any) => {
        console.error('Erro ao atualizar lançamento:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar lançamento. Tente novamente.",
          variant: "destructive",
        });
      },
    });
  };

  const useDelete = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase
          .from('lancamentos')
          .delete()
          .eq('id', id);

        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
        toast({
          title: "Sucesso",
          description: "Lançamento excluído com sucesso!",
        });
      },
      onError: (error: any) => {
        console.error('Erro ao excluir lançamento:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir lançamento. Tente novamente.",
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
