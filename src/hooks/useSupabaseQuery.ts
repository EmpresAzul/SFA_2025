import { useLancamentos } from '@/hooks/useLancamentos';
import { useLembretes } from '@/hooks/useLembretes';
import { useSaldosBancarios } from '@/hooks/useSaldosBancarios';
import { useCadastros } from '@/hooks/useCadastros';
import { usePrecificacao } from '@/hooks/usePrecificacao';

export const useSupabaseQuery = () => {
  const lancamentos = useLancamentos();
  const lembretes = useLembretes();
  const saldosBancarios = useSaldosBancarios();
  const cadastros = useCadastros();
  const precificacao = usePrecificacao();

  // Mock implementations for compatibility
  const createSaldo = { mutateAsync: async () => {} };
  const updateSaldo = { mutateAsync: async () => {} };
  const deleteSaldo = { mutateAsync: async () => {} };

  return {
    // Lançamentos
    useQueryLancamentos: lancamentos.useQuery,
    useCreateLancamento: lancamentos.useCreate,
    useUpdateLancamento: lancamentos.useUpdate,
    useDeleteLancamento: lancamentos.useDelete,
    // Saldos Bancários - mock implementations
    useCreateSaldoBancario: () => createSaldo,
    useUpdateSaldoBancario: () => updateSaldo,
    useDeleteSaldoBancario: () => deleteSaldo,
    // Cadastros
    useCreateCadastro: cadastros.useCreate,
    useUpdateCadastro: cadastros.useUpdate,
    useDeleteCadastro: cadastros.useDelete,
    // Precificação
    useCreatePrecificacao: () => ({ mutateAsync: async () => {} }),
    useUpdatePrecificacao: () => ({ mutateAsync: async () => {} }),
    useDeletePrecificacao: () => ({ mutateAsync: async () => {} }),
    // Lembretes - use actual properties from useLembretes
    useQueryLembretes: () => ({ 
      data: lembretes.lembretes,
      isLoading: lembretes.isLoading,
      error: lembretes.error 
    }),
    useCreateLembrete: () => lembretes.createLembrete,
    useUpdateLembrete: () => lembretes.updateLembrete,
    useDeleteLembrete: () => lembretes.deleteLembrete,
  };
};