
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
    // Queries - retornando as funções diretamente
    useCadastros: cadastros.useCadastrosQuery,
    useEstoques: estoques.useQuery,
    useLancamentos: lancamentos.useQuery,
    useSaldosBancarios: saldosBancarios.useQuery,
    
    // Mutations - retornando as funções diretamente
    useCreateCadastro: cadastros.useCreateCadastro,
    useDeleteCadastro: cadastros.useDeleteCadastro,
    useCreateEstoque: estoques.useCreate,
    useDeleteEstoque: estoques.useDelete,
    useCreateLancamento: lancamentos.useCreate,
    useDeleteLancamento: lancamentos.useDelete,
    useCreateSaldoBancario: saldosBancarios.useCreate,
    useDeleteSaldoBancario: saldosBancarios.useDelete,
  };
};
