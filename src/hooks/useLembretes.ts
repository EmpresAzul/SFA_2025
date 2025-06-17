
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Lembrete {
  id: string;
  user_id: string;
  titulo: string;
  descricao: string | null;
  data_lembrete: string;
  hora_lembrete: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LembreteFormData {
  titulo: string;
  descricao?: string;
  data_lembrete: string;
  hora_lembrete?: string;
}

export const useLembretes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: lembretes = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['lembretes', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('useLembretes: Usuário não autenticado');
        return [];
      }

      console.log('useLembretes: Buscando lembretes para usuário:', user.id);

      const { data, error } = await supabase
        .from('lembretes')
        .select('*')
        .eq('user_id', user.id)
        .order('data_lembrete', { ascending: true });

      if (error) {
        console.error('Erro ao buscar lembretes:', error);
        throw error;
      }

      console.log('useLembretes: Lembretes encontrados:', data?.length || 0);
      console.log('useLembretes: Dados completos:', data);

      return data as Lembrete[];
    },
    enabled: !!user
  });

  const createLembrete = useMutation({
    mutationFn: async (data: LembreteFormData) => {
      if (!user) throw new Error('Usuário não autenticado');

      console.log('useLembretes: Criando lembrete:', data);

      const { error } = await supabase
        .from('lembretes')
        .insert({
          ...data,
          user_id: user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
      toast({
        title: "Lembrete criado!",
        description: "O lembrete foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar lembrete:', error);
      toast({
        title: "Erro ao criar lembrete",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const updateLembrete = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Lembrete> & { id: string }) => {
      console.log('useLembretes: Atualizando lembrete:', id, data);

      const { error } = await supabase
        .from('lembretes')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
      toast({
        title: "Lembrete atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar lembrete:', error);
      toast({
        title: "Erro ao atualizar lembrete",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const deleteLembrete = useMutation({
    mutationFn: async (id: string) => {
      console.log('useLembretes: Deletando lembrete:', id);

      const { error } = await supabase
        .from('lembretes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lembretes'] });
      toast({
        title: "Lembrete excluído!",
        description: "O lembrete foi removido com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir lembrete:', error);
      toast({
        title: "Erro ao excluir lembrete",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  console.log('useLembretes: Estado atual - Loading:', isLoading, 'Lembretes:', lembretes.length, 'User:', user?.id);

  return {
    lembretes,
    isLoading,
    error,
    refetch,
    createLembrete,
    updateLembrete,
    deleteLembrete
  };
};
