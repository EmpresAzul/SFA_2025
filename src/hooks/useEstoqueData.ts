
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from "@/integrations/supabase/types";

// Use the actual database schema types
type EstoqueRow = Database['public']['Tables']['estoques']['Row'];
type EstoqueInsert = Database['public']['Tables']['estoques']['Insert'];

interface UseEstoqueDataReturn {
  estoques: EstoqueRow[];
  loading: boolean;
  error: string | null;
  fetchEstoques: () => Promise<void>;
  createEstoque: (data: EstoqueInsert) => Promise<void>;
  updateEstoque: (id: string, data: Partial<EstoqueInsert>) => Promise<void>;
  deleteEstoque: (id: string) => Promise<void>;
  adjustQuantity: (id: string, quantidade: number) => Promise<void>;
  handleToggleStatus: (id: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

export const useEstoqueData = (): UseEstoqueDataReturn => {
  const [estoques, setEstoques] = useState<EstoqueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEstoques = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('estoques')
        .select('*')
        .order('nome_produto', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setEstoques(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estoque';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createEstoque = useCallback(async (data: EstoqueInsert) => {
    try {
      setError(null);

      const { error: insertError } = await supabase
        .from('estoques')
        .insert(data);

      if (insertError) {
        throw insertError;
      }

      toast({
        title: 'Sucesso',
        description: 'Item adicionado ao estoque com sucesso!',
      });

      await fetchEstoques();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar item ao estoque';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [fetchEstoques, toast]);

  const updateEstoque = useCallback(async (id: string, data: Partial<EstoqueInsert>) => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('estoques')
        .update(data)
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Sucesso',
        description: 'Item atualizado com sucesso!',
      });

      await fetchEstoques();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar item';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [fetchEstoques, toast]);

  const deleteEstoque = useCallback(async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('estoques')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      toast({
        title: 'Sucesso',
        description: 'Item removido do estoque com sucesso!',
      });

      await fetchEstoques();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover item do estoque';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [fetchEstoques, toast]);

  const adjustQuantity = useCallback(async (id: string, quantidade: number) => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('estoques')
        .update({ quantidade })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Sucesso',
        description: 'Quantidade ajustada com sucesso!',
      });

      await fetchEstoques();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao ajustar quantidade';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [fetchEstoques, toast]);

  const handleToggleStatus = useCallback(async (id: string) => {
    try {
      const estoque = estoques.find(e => e.id === id);
      if (!estoque) return;

      const newStatus = estoque.status === 'ativo' ? 'inativo' : 'ativo';
      await updateEstoque(id, { status: newStatus });
    } catch (err) {
      console.error('Erro ao alterar status:', err);
    }
  }, [estoques, updateEstoque]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteEstoque(id);
    } catch (err) {
      console.error('Erro ao excluir item:', err);
    }
  }, [deleteEstoque]);

  useEffect(() => {
    fetchEstoques();
  }, [fetchEstoques]);

  return {
    estoques,
    loading,
    error,
    fetchEstoques,
    createEstoque,
    updateEstoque,
    deleteEstoque,
    adjustQuantity,
    handleToggleStatus,
    handleDelete,
  };
};
