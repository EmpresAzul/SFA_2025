
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Definindo o tipo Lancamento localmente já que a tabela foi removida
export interface Lancamento {
  id: string;
  data: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  cliente_id?: string;
  fornecedor_id?: string;
  observacoes?: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useLancamentos = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para lançamentos - retorna array vazio já que a tabela foi removida
  const useLancamentosQuery = () => {
    return useQuery({
      queryKey: ['lancamentos'],
      queryFn: async () => {
        if (!session?.user?.id) throw new Error('User not authenticated');
        
        console.log('Tabela lancamentos foi removida. Retornando dados vazios.');
        return [];
      },
      enabled: !!session?.user?.id,
    });
  };

  // Mutation para criar/atualizar lançamento - desabilitada
  const useLancamentosCreate = () => {
    return useMutation({
      mutationFn: async (data: any) => {
        throw new Error('Funcionalidade de lançamentos foi removida');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
        toast({
          title: "Aviso",
          description: "Funcionalidade de lançamentos foi removida",
          variant: "destructive",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro",
          description: "Funcionalidade de lançamentos foi removida",
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para deletar lançamento - desabilitada
  const useLancamentosDelete = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        throw new Error('Funcionalidade de lançamentos foi removida');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
        toast({
          title: "Aviso",
          description: "Funcionalidade de lançamentos foi removida",
          variant: "destructive",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro",
          description: "Funcionalidade de lançamentos foi removida",
          variant: "destructive",
        });
      },
    });
  };

  return {
    useQuery: useLancamentosQuery,
    useCreate: useLancamentosCreate,
    useDelete: useLancamentosDelete,
  };
};
