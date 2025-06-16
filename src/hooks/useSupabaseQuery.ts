
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
    useCadastros: cadastros.useQuery,
    useEstoques: estoques.useQuery,
    useLancamentos: lancamentos.useQuery,
    useSaldosBancarios: saldosBancarios.useQuery,
    
    // Mutations
    useCreateCadastro: cadastros.useCreate,
    useDeleteCadastro: cadastros.useDelete,
    useCreateEstoque: estoques.useCreate,
    useDeleteEstoque: estoques.useDelete,
    useCreateLancamento: lancamentos.useCreate,
    useDeleteLancamento: lancamentos.useDelete,
    useCreateSaldoBancario: saldosBancarios.useCreate,
    useDeleteSaldoBancario: saldosBancarios.useDelete,
  };
};
