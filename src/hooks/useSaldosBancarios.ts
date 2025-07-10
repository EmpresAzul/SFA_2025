
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface SaldoBancarioData {
  id?: string;
  banco: string;
  saldo: number;
  data: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useSaldosBancarios = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saldos, setSaldos] = useState<SaldoBancarioData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSaldos = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saldos_bancarios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSaldos(data || []);
    } catch (error) {
      console.error('Erro ao buscar saldos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar saldos bancários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  const createSaldo = useCallback(async (data: SaldoBancarioData) => {
    if (!user?.id) throw new Error("Usuário não autenticado");

    const { error } = await supabase
      .from('saldos_bancarios')
      .insert({ ...data, user_id: user.id });

    if (error) throw error;
    await fetchSaldos();
  }, [user?.id, fetchSaldos]);

  const updateSaldo = useCallback(async (id: string, data: Partial<SaldoBancarioData>) => {
    if (!user?.id) throw new Error("Usuário não autenticado");

    const { error } = await supabase
      .from('saldos_bancarios')  
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchSaldos();
  }, [user?.id, fetchSaldos]);

  const deleteSaldo = useCallback(async (id: string) => {
    if (!user?.id) throw new Error("Usuário não autenticado");

    const { error } = await supabase
      .from('saldos_bancarios')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    await fetchSaldos();
  }, [user?.id, fetchSaldos]);

  useEffect(() => {
    fetchSaldos();
  }, [fetchSaldos]);

  const useQuery = useCallback(() => ({
    data: saldos,
    isLoading: loading,
  }), [saldos, loading]);

  const useCreate = useCallback(() => ({
    mutateAsync: createSaldo,
    isPending: loading,
  }), [createSaldo, loading]);

  const useUpdate = useCallback(() => ({
    mutateAsync: async ({ id, data }: { id: string; data: Partial<SaldoBancarioData> }) => {
      await updateSaldo(id, data);
    },
    isPending: loading,
  }), [updateSaldo, loading]);

  const useDelete = useCallback(() => ({
    mutateAsync: deleteSaldo,
    isPending: loading,
  }), [deleteSaldo, loading]);

  return {
    saldos,
    loading,
    fetchSaldos,
    createSaldo,
    updateSaldo,
    deleteSaldo,
    useQuery,
    useCreate,
    useUpdate,
    useDelete,
  };
};
