
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Estoque } from '@/types/estoque';

export const useEstoqueData = () => {
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchEstoques();
    }
  }, [user]);

  const fetchEstoques = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('estoques')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEstoques(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar estoques",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (estoque: Estoque) => {
    try {
      const newStatus = estoque.status === 'ativo' ? 'inativo' : 'ativo';
      const { error } = await supabase
        .from('estoques')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', estoque.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Status atualizado!",
        description: `Item ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso.`,
      });

      fetchEstoques();
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('estoques')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Item excluído!",
        description: "O item foi removido do estoque.",
      });

      fetchEstoques();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    estoques,
    loading,
    fetchEstoques,
    handleToggleStatus,
    handleDelete
  };
};
