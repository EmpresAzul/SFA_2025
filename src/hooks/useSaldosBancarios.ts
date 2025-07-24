import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { createNotificationFromEvent, shouldNotify } from "@/utils/notificationHelpers";
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
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [saldos, setSaldos] = useState<SaldoBancarioData[]>([]);

  const useQueryHook = () => {
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
      if (!user) throw new Error('Usuário não autenticado');
      const { data, error } = await supabase
        .from('saldos_bancarios')
        .select('*')
        .eq('user_id', user.id)
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
  }, [toast, user]);

  const createSaldo = useCallback(async (data: SaldoBancarioData) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      // Remover id se existir e garantir user_id
      const { id, ...dataWithoutId } = data;
      const dataToInsert = {
        ...dataWithoutId,
        user_id: user.id
      };
      
      console.log('Inserindo saldo bancário:', dataToInsert);
      
      const { error } = await supabase
        .from('saldos_bancarios')
        .insert([dataToInsert]);

      if (error) {
        console.error('Erro ao inserir saldo bancário:', error);
        throw error;
      }
      
      toast({
        title: 'Sucesso',
        description: 'Saldo bancário criado com sucesso!',
      });
      
      // Invalidar cache do dashboard para atualização em tempo real
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['saldos_bancarios'] });
      
      // Verificar se saldo está baixo e criar notificação
      if (user?.id && shouldNotify('low_balance', dataToInsert, user.id)) {
        const notification = createNotificationFromEvent('low_balance', dataToInsert, user.id);
        if (notification) {
          addNotification(notification);
        }
      }
      
      await fetchSaldos();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar saldo bancário';
      console.error('Erro no createSaldo:', error);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  }, [fetchSaldos, toast, user]);

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
      
      // Invalidar cache do dashboard para atualização em tempo real
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['saldos_bancarios'] });
      
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
      
      // Invalidar cache do dashboard para atualização em tempo real
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['saldos_bancarios'] });
      
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
    useQuery: useQueryHook,
  };
};
