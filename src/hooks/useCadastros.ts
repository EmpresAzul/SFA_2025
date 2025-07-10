import { useCallback } from 'react';
import { useCadastrosQueries } from './cadastros/useCadastrosQueries';
import { useCadastrosMutations } from './cadastros/useCadastrosMutations';
import { UseCadastrosReturn } from './cadastros/types';

export type { Cadastro, CadastroFormData } from './cadastros/types';

export const useCadastros = (): UseCadastrosReturn => {
  const { cadastros, loading, error, refreshCadastros } = useCadastrosQueries();
  const { createCadastro, updateCadastro, deleteCadastro, toggleStatus } = useCadastrosMutations(
    cadastros,
    refreshCadastros
  );

  const useCreate = useCallback(() => ({
    mutateAsync: createCadastro
  }), [createCadastro]);

  const useQuery = useCallback(() => ({
    data: cadastros,
    isLoading: loading,
    error
  }), [cadastros, loading, error]);

  const useUpdate = useCallback(() => ({
    mutateAsync: async ({ id, data }: { id: string; data: Partial<any> }) => {
      await updateCadastro(id, data);
    }
  }), [updateCadastro]);

  const useDelete = useCallback(() => ({
    mutateAsync: deleteCadastro
  }), [deleteCadastro]);

  return {
    cadastros,
    loading,
    error,
    createCadastro,
    updateCadastro,
    deleteCadastro,
    toggleStatus,
    refreshCadastros,
    useCreate,
    useQuery,
    useUpdate,
    useDelete,
  };
};