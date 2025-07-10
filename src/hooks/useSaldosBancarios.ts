import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useState } from "react";

interface SaldoBancarioData {
  id?: string;
  data: string;
  banco: string;
  saldo: number;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export const useSaldosBancarios = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [saldos, setSaldos] = useState<SaldoBancarioData[]>([]);

  const useQuery = () => {
    return useQuery({
      queryKey: ['saldos_bancarios', user?.id],
      queryFn: async () => {
        if (!user) throw new Error('Usuário não autenticado');
        
        const { data, error } = await supabase
          .from('saldos_bancarios')
          .select('*')
          .eq('user_id', user.id)
          .order('data', { ascending: false });

        if (error) throw error;
        return data || [];
      },
      enabled: !!user
    });
  };

  const fetchSaldos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saldos_bancarios')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;
      setSaldos(data || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar saldos bancários';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createSaldo = useCallback(async (data: SaldoBancarioData) => {
    try {
      const { error } = await supabase
        .from('saldos_bancarios')
        .insert([data]);

      if (error) throw error;
      toast({
        title: 'Sucesso',
        description: 'Saldo bancário criado com sucesso!',
      });
      await fetchSaldos();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar saldo bancário';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  }, [fetchSaldos, toast]);

  const updateSaldo = useCallback(async (id: string, data: Partial<SaldoBancarioData>) => {
    try {
      const { error } = await supabase
        .from('saldos_bancarios')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      toast({
        title: 'Sucesso',
        description: 'Saldo bancário atualizado com sucesso!',
      });
      await fetchSaldos();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar saldo bancário';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  }, [fetchSaldos, toast]);

  const deleteSaldo = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('saldos_bancarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: 'Sucesso',
        description: 'Saldo bancário excluído com sucesso!',
      });
      await fetchSaldos();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir saldo bancário';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  }, [fetchSaldos, toast]);

  return {
    loading,
    saldos,
    fetchSaldos,
    createSaldo,
    updateSaldo,
    deleteSaldo,
    useQuery,
  };
};
