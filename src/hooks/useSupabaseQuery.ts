
import { useEstoques } from './useEstoques';
import { useLancamentos } from './useLancamentos';
import { useSaldosBancarios } from './useSaldosBancarios';
import { useCadastros } from './useCadastros';
import { usePrecificacao } from './usePrecificacao';

export const useSupabaseQuery = () => {
  const estoques = useEstoques();
  const lancamentos = useLancamentos();
  const saldosBancarios = useSaldosBancarios();
  const cadastros = useCadastros();
  const precificacao = usePrecificacao();

  return {
    // Queries - retornando as funções diretamente
    useEstoques: estoques.useQuery,
    useLancamentos: lancamentos.useQuery,
    useSaldosBancarios: saldosBancarios.useQuery,
    useCadastros: cadastros.useQuery,
    usePrecificacao: precificacao.useQuery,
    
    // Mutations - retornando as funções diretamente
    useCreateEstoque: estoques.useCreate,
    useDeleteEstoque: estoques.useDelete,
    useCreateLancamento: lancamentos.useCreate,
    useUpdateLancamento: lancamentos.useUpdate,
    useDeleteLancamento: lancamentos.useDelete,
    useCreateSaldoBancario: saldosBancarios.useCreate,
    useDeleteSaldoBancario: saldosBancarios.useDelete,
    useCreateCadastro: cadastros.useCreate,
    useUpdateCadastro: cadastros.useUpdate,
    useDeleteCadastro: cadastros.useDelete,
    useCreatePrecificacao: precificacao.useCreate,
    useUpdatePrecificacao: precificacao.useUpdate,
    useDeletePrecificacao: precificacao.useDelete,
  };
};
