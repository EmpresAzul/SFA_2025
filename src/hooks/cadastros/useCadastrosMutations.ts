import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CadastroFormData, Cadastro } from './types';

export const useCadastrosMutations = (
  cadastros: Cadastro[],
  refreshCadastros: () => Promise<void>
) => {
  const { toast } = useToast();

  const createCadastro = useCallback(async (data: CadastroFormData) => {
    try {
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

      await refreshCadastros();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cadastro';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [refreshCadastros, toast]);

  const updateCadastro = useCallback(async (id: string, data: Partial<CadastroFormData>) => {
    try {
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

      await refreshCadastros();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cadastro';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [refreshCadastros, toast]);

  const deleteCadastro = useCallback(async (id: string) => {
    try {
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

      await refreshCadastros();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir cadastro';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [refreshCadastros, toast]);

  const toggleStatus = useCallback(async (id: string) => {
    try {
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

      await refreshCadastros();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar status';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [cadastros, refreshCadastros, toast]);

  return {
    createCadastro,
    updateCadastro,
    deleteCadastro,
    toggleStatus,
  };
};