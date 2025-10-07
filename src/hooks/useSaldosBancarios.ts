import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { createNotificationFromEvent, shouldNotify } from "@/utils/notificationHelpers";
import { useCallback, useState } from "react";
import { SaldoBancarioData } from "@/types/saldosBancarios";

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
          .order('data_atualizacao', { ascending: false });

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
      
      // Mapear dados para o formato esperado
      const saldosMapeados = (data || []).map(item => ({
        ...item,
        agencia: item.tipo?.includes('Agência:') ? item.tipo.split('Agência:')[1]?.split('|')[0]?.trim() : '',
        conta_tipo: item.tipo?.includes('Conta:') ? item.tipo.split('Conta:')[1]?.split('|')[0]?.trim() : '',
        cidade: item.tipo?.includes('Cidade:') ? item.tipo.split('Cidade:')[1]?.split('|')[0]?.trim() : '',
        pix: item.tipo?.includes('PIX:') ? item.tipo.split('PIX:')[1]?.trim() : '',
      }));
      
      setSaldos(saldosMapeados);
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

  const createSaldo = useCallback(async (data: any) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      // Mapear dados do formulário para a estrutura da tabela
      const dataToInsert = {
        banco: data.banco,
        saldo: data.saldo,
        valor: data.saldo, // Duplicar para compatibilidade
        data: data.data,
        tipo: `Agência: ${data.agencia || 'N/A'} | Conta: ${data.conta_tipo || 'N/A'} | Cidade: ${data.cidade || 'N/A'} | PIX: ${data.pix || 'N/A'}`,
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

  const updateSaldo = useCallback(async (id: string, data: any) => {
    try {
      // Mapear dados do formulário para a estrutura da tabela
      const updateData = {
        banco: data.banco,
        saldo: data.saldo,
        valor: data.saldo, // Duplicar para compatibilidade
        data: data.data,
        tipo: `Agência: ${data.agencia || 'N/A'} | Conta: ${data.conta_tipo || 'N/A'} | Cidade: ${data.cidade || 'N/A'} | PIX: ${data.pix || 'N/A'}`,
      };

      const { error } = await supabase
        .from('saldos_bancarios')
        .update(updateData)
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
