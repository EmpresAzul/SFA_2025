
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
    // Queries - usando os nomes corretos retornados pelos hooks
    useCadastros: cadastros.useCadastrosQuery,
    useEstoques: estoques.useEstoquesQuery,
    useLancamentos: lancamentos.useLancamentosQuery,
    useSaldosBancarios: saldosBancarios.useSaldosBancariosQuery,
    
    // Mutations - usando os nomes corretos retornados pelos hooks
    useCreateCadastro: cadastros.useCreateCadastro,
    useDeleteCadastro: cadastros.useDeleteCadastro,
    useCreateEstoque: estoques.useEstoquesCreate,
    useDeleteEstoque: estoques.useEstoquesDelete,
    useCreateLancamento: lancamentos.useLancamentosCreate,
    useDeleteLancamento: lancamentos.useLancamentosDelete,
    useCreateSaldoBancario: saldosBancarios.useSaldosBancariosCreate,
    useDeleteSaldoBancario: saldosBancarios.useSaldosBancariosDelete,
  };
};
