
import { useState, useMemo } from 'react';
import { useCadastros, type Cadastro } from '@/hooks/useCadastros';

export const useCadastrosUnified = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [editingCadastro, setEditingCadastro] = useState<Cadastro | null>(null);
  
  const { useQuery, useUpdate, useDelete } = useCadastros();
  const query = useQuery();
  const updateCadastro = useUpdate();
  const deleteCadastro = useDelete();

  const filteredCadastros = useMemo(() => {
    if (!query.data) return [];
    
    return query.data.filter((cadastro: Cadastro) => {
      const matchesSearch = cadastro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cadastro.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cadastro.telefone?.includes(searchTerm);
      
      const matchesTipo = !filterTipo || cadastro.tipo === filterTipo;
      
      return matchesSearch && matchesTipo;
    });
  }, [query.data, searchTerm, filterTipo]);

  const clientes = useMemo(() => {
    if (!query.data) return [];
    return query.data.filter((cadastro: Cadastro) => cadastro.tipo === 'cliente');
  }, [query.data]);

  const fornecedores = useMemo(() => {
    if (!query.data) return [];
    return query.data.filter((cadastro: Cadastro) => cadastro.tipo === 'fornecedor');
  }, [query.data]);

  const funcionarios = useMemo(() => {
    if (!query.data) return [];
    return query.data.filter((cadastro: Cadastro) => cadastro.tipo === 'funcionario');
  }, [query.data]);

  const handleEdit = (cadastro: Cadastro) => {
    setEditingCadastro(cadastro);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCadastro.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir cadastro:', error);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Cadastro>) => {
    try {
      await updateCadastro.mutateAsync({ id, data });
      setEditingCadastro(null);
    } catch (error) {
      console.error('Erro ao atualizar cadastro:', error);
    }
  };

  return {
    cadastros: query.data || [],
    loading: query.isLoading,
    error: query.error,
    filteredCadastros,
    clientes,
    fornecedores,
    funcionarios,
    searchTerm,
    setSearchTerm,
    filterTipo,
    setFilterTipo,
    editingCadastro,
    setEditingCadastro,
    handleEdit,
    handleDelete,
    handleUpdate,
  };
};
