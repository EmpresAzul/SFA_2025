import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EstoqueItem {
  id: string;
  user_id: string;
  data: string;
  nome_produto: string;
  unidade_medida: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  quantidade_bruta: number;
  quantidade_liquida: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface EstoqueFormData {
  data: string;
  nome_produto: string;
  unidade_medida: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  quantidade_bruta: number;
  quantidade_liquida: number;
  status: string;
}

interface UseEstoqueDataReturn {
  estoques: EstoqueItem[];
  loading: boolean;
  error: string | null;
  fetchEstoques: () => Promise<void>;
  createEstoque: (data: EstoqueFormData) => Promise<void>;
  updateEstoque: (id: string, data: Partial<EstoqueFormData>) => Promise<void>;
  deleteEstoque: (id: string) => Promise<void>;
  adjustQuantity: (id: string, quantidade: number) => Promise<void>;
  handleToggleStatus: (id: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

export const useEstoqueData = (): UseEstoqueDataReturn => {
  const [estoques, setEstoques] = useState<EstoqueItem[]>([]);
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

  const createEstoque = useCallback(async (data: EstoqueFormData) => {
    try {
      setError(null);

      const { error: insertError } = await supabase
        .from('estoques')
        .insert([{ ...data, user_id: (await supabase.auth.getUser()).data.user?.id }]);

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

  const updateEstoque = useCallback(async (id: string, data: Partial<EstoqueFormData>) => {
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
        .update({ quantidade, valor_total: quantidade * 0 }) // Placeholder para valor_total
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

  useEffect(() => {
    fetchEstoques();
  }, [fetchEstoques]);

  const handleToggleStatus = useCallback(async (id: string) => {
    const estoque = estoques.find(e => e.id === id);
    if (estoque) {
      const newStatus = estoque.status === 'ativo' ? 'inativo' : 'ativo';
      await updateEstoque(id, { status: newStatus });
    }
  }, [estoques, updateEstoque]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteEstoque(id);
  }, [deleteEstoque]);

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
