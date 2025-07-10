
import { useState, useMemo } from 'react';
import { useCadastros, type Cadastro } from '@/hooks/useCadastros';

export const useCadastrosUnified = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState('lista');
  const [editingItem, setEditingItem] = useState<Cadastro | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
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
      
      const matchesStatus = !statusFilter || cadastro.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [query.data, searchTerm, statusFilter]);

  const filteredItems = filteredCadastros;

  const stats = useMemo(() => {
    const total = query.data?.length || 0;
    const ativos = query.data?.filter(c => c.status === 'ativo').length || 0;
    const clientes = query.data?.filter(c => c.tipo === 'cliente').length || 0;
    const fornecedores = query.data?.filter(c => c.tipo === 'fornecedor').length || 0;
    const funcionarios = query.data?.filter(c => c.tipo === 'funcionario').length || 0;
    
    return { total, ativos, clientes, fornecedores, funcionarios };
  }, [query.data]);

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
    setEditingItem(cadastro);
    setIsEditModalOpen(true);
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
      setEditingItem(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar cadastro:', error);
    }
  };

  const handleSaveEdit = async (data: Partial<Cadastro>) => {
    if (editingItem?.id) {
      await handleUpdate(editingItem.id, data);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const cadastro = query.data?.find(c => c.id === id);
    if (cadastro) {
      const newStatus = cadastro.status === 'ativo' ? 'inativo' : 'ativo';
      await handleUpdate(id, { status: newStatus });
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
    statusFilter,
    setStatusFilter,
    activeTab,
    setActiveTab,
    editingItem,
    setEditingItem,
    isEditModalOpen,
    setIsEditModalOpen,
    filteredItems,
    stats,
    handleEdit,
    handleDelete,
    handleUpdate,
    handleSaveEdit,
    handleToggleStatus,
  };
};
