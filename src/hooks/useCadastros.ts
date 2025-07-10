import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CadastroData, CadastroFormData } from '@/types/cadastros';
import { useToast } from '@/hooks/use-toast';

interface UseCadastrosReturn {
  cadastros: CadastroData[];
  loading: boolean;
  error: string | null;
  createCadastro: (data: CadastroFormData) => Promise<void>;
  updateCadastro: (id: string, data: Partial<CadastroFormData>) => Promise<void>;
  deleteCadastro: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  refreshCadastros: () => Promise<void>;
}

export const useCadastros = (): UseCadastrosReturn => {
  const [cadastros, setCadastros] = useState<CadastroData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCadastros = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('cadastros')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setCadastros(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar cadastros';
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

  const createCadastro = useCallback(async (data: CadastroFormData) => {
    try {
      setError(null);

      const { error: insertError } = await supabase
        .from('cadastros')
        .insert([data]);

      if (insertError) {
        throw insertError;
      }

      toast({
        title: 'Sucesso',
        description: 'Cadastro criado com sucesso!',
      });

      await fetchCadastros();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cadastro';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [fetchCadastros, toast]);

  const updateCadastro = useCallback(async (id: string, data: Partial<CadastroFormData>) => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('cadastros')
        .update(data)
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Sucesso',
        description: 'Cadastro atualizado com sucesso!',
      });

      await fetchCadastros();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cadastro';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [fetchCadastros, toast]);

  const deleteCadastro = useCallback(async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('cadastros')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      toast({
        title: 'Sucesso',
        description: 'Cadastro excluído com sucesso!',
      });

      await fetchCadastros();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir cadastro';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [fetchCadastros, toast]);

  const toggleStatus = useCallback(async (id: string) => {
    try {
      setError(null);

      const cadastro = cadastros.find(c => c.id === id);
      if (!cadastro) {
        throw new Error('Cadastro não encontrado');
      }

      const newStatus = cadastro.status === 'ativo' ? 'inativo' : 'ativo';

      const { error: updateError } = await supabase
        .from('cadastros')
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Sucesso',
        description: `Status alterado para ${newStatus}!`,
      });

      await fetchCadastros();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar status';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [cadastros, fetchCadastros, toast]);

  const refreshCadastros = useCallback(async () => {
    await fetchCadastros();
  }, [fetchCadastros]);

  useEffect(() => {
    fetchCadastros();
  }, [fetchCadastros]);

  return {
    cadastros,
    loading,
    error,
    createCadastro,
    updateCadastro,
    deleteCadastro,
    toggleStatus,
    refreshCadastros,
  };
};
