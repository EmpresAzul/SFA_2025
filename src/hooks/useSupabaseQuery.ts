
import { useCadastros } from './useCadastros';
import { useEstoques } from './useEstoques';
import { useLancamentos } from './useLancamentos';
import { useSaldosBancarios } from './useSaldosBancarios';

export const useSupabaseQuery = () => {
  const cadastros = useCadastros();
  const estoques = useEstoques();
  const lancamentos = useLancamentos();
  const saldosBancarios = useSaldosBancarios();

  return {
    // Queries
    useCadastros: cadastros.useCadastrosQuery,
    useEstoques: estoques.useEstoquesQuery,
    useLancamentos: lancamentos.useLancamentosQuery,
    useSaldosBancarios: saldosBancarios.useSaldosBancariosQuery,
    
    // Mutations
    useCreateCadastro: cadastros.useCreateCadastro,
    useDeleteCadastro: cadastros.useDeleteCadastro,
    useCreateEstoque: estoques.useCreateEstoque,
    useDeleteEstoque: estoques.useDeleteEstoque,
    useCreateLancamento: lancamentos.useCreateLancamento,
    useDeleteLancamento: lancamentos.useDeleteLancamento,
    useCreateSaldoBancario: saldosBancarios.useCreateSaldoBancario,
    useDeleteSaldoBancario: saldosBancarios.useDeleteSaldoBancario,
  };
};
