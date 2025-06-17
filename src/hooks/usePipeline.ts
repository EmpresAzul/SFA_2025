
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Negocio {
  id: string;
  nome_lead: string;
  email?: string;
  whatsapp?: string;
  observacoes?: string;
  status: 'em_desenvolvimento' | 'assinatura_contrato' | 'documento_aberto' | 'fatura_final';
  valor_negocio: number;
  posicao: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const PIPELINE_STATUSES = {
  'em_desenvolvimento': 'Em Desenvolvimento',
  'assinatura_contrato': 'Assinatura do Contrato', 
  'documento_aberto': 'Documento Aberto',
  'fatura_final': 'Fatura Final'
} as const;

export const usePipeline = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: negocios = [], refetch } = useQuery({
    queryKey: ['negocios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('negocios')
        .select('*')
        .order('posicao', { ascending: true });

      if (error) throw error;
      return data as Negocio[];
    }
  });

  const createNegocio = async (data: Omit<Negocio, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'posicao'>) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar a maior posição atual para o status
      const { data: maxPosicaoData } = await supabase
        .from('negocios')
        .select('posicao')
        .eq('status', data.status)
        .eq('user_id', user.id)
        .order('posicao', { ascending: false })
        .limit(1);

      const novaPosicao = maxPosicaoData && maxPosicaoData.length > 0 
        ? (maxPosicaoData[0].posicao || 0) + 1 
        : 0;

      const { error } = await supabase
        .from('negocios')
        .insert([
          {
            ...data,
            user_id: user.id,
            posicao: novaPosicao
          }
        ]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Negócio criado com sucesso.",
      });

      refetch();
      return true;
    } catch (error) {
      console.error('Erro ao criar negócio:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar negócio. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateNegocio = async (id: string, data: Partial<Negocio>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('negocios')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Negócio atualizado com sucesso.",
      });

      refetch();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar negócio:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar negócio. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNegocio = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('negocios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Negócio excluído com sucesso.",
      });

      refetch();
      return true;
    } catch (error) {
      console.error('Erro ao excluir negócio:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir negócio. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const moveNegocio = async (negocioId: string, novoStatus: string, novaPosicao: number) => {
    try {
      const { error } = await supabase
        .from('negocios')
        .update({ 
          status: novoStatus, 
          posicao: novaPosicao,
          updated_at: new Date().toISOString()
        })
        .eq('id', negocioId);

      if (error) throw error;

      refetch();
      return true;
    } catch (error) {
      console.error('Erro ao mover negócio:', error);
      return false;
    }
  };

  const getNegociosByStatus = (status: string) => {
    return negocios
      .filter((negocio: Negocio) => negocio.status === status)
      .sort((a: Negocio, b: Negocio) => (a.posicao || 0) - (b.posicao || 0));
  };

  return {
    negocios,
    isLoading,
    createNegocio,
    updateNegocio,
    deleteNegocio,
    moveNegocio,
    getNegociosByStatus,
    refetch
  };
};
