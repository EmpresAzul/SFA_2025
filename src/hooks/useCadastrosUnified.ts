
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCadastros } from '@/hooks/useCadastros';

export const useCadastrosUnified = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [activeTab, setActiveTab] = useState('lista');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { toast } = useToast();
  const { useQuery, useUpdate, useDelete } = useCadastros();

  // Fazer consultas separadas para cada tipo
  const { data: clientes = [], isLoading: loadingClientes, refetch: refetchClientes } = useQuery('Cliente');
  const { data: fornecedores = [], isLoading: loadingFornecedores, refetch: refetchFornecedores } = useQuery('Fornecedor');
  const { data: funcionarios = [], isLoading: loadingFuncionarios, refetch: refetchFuncionarios } = useQuery('Funcionário');

  const updateCadastro = useUpdate();
  const deleteCadastro = useDelete();

  const loading = loadingClientes || loadingFornecedores || loadingFuncionarios;

  const refetch = () => {
    refetchClientes();
    refetchFornecedores();
    refetchFuncionarios();
  };

  // Combinar todos os dados
  const allItems = [
    ...clientes.map(item => ({ ...item, tipoDisplay: 'Cliente' })),
    ...fornecedores.map(item => ({ ...item, tipoDisplay: 'Fornecedor' })),
    ...funcionarios.map(item => ({ ...item, tipoDisplay: 'Funcionário' }))
  ];

  // Filtrar dados
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === 'todos' || item.tipoDisplay.toLowerCase() === tipoFilter;
    const matchesStatus = statusFilter === 'todos' || item.status === statusFilter;
    
    return matchesSearch && matchesTipo && matchesStatus;
  });

  // Estatísticas
  const stats = {
    total: allItems.length,
    clientes: clientes.length,
    fornecedores: fornecedores.length,
    funcionarios: funcionarios.length,
    ativos: allItems.filter(item => item.status === 'ativo').length
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (data: any) => {
    try {
      await updateCadastro.mutateAsync({ id: data.id, ...data });
      setIsEditModalOpen(false);
      setEditingItem(null);
      refetch();
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (item: any) => {
    const newStatus = item.status === 'ativo' ? 'inativo' : 'ativo';
    try {
      await updateCadastro.mutateAsync({ 
        id: item.id, 
        status: newStatus 
      });
      toast({
        title: "Status atualizado",
        description: `Cadastro ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso.`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao alterar o status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir ${nome}?`)) {
      return;
    }

    try {
      await deleteCadastro.mutateAsync(id);
      refetch();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o item.",
        variant: "destructive",
      });
    }
  };

  return {
    // State
    searchTerm,
    setSearchTerm,
    tipoFilter,
    setTipoFilter,
    statusFilter,
    setStatusFilter,
    activeTab,
    setActiveTab,
    editingItem,
    setEditingItem,
    isEditModalOpen,
    setIsEditModalOpen,
    
    // Data
    filteredItems,
    stats,
    loading,
    updateCadastro,
    
    // Handlers
    handleEdit,
    handleSaveEdit,
    handleToggleStatus,
    handleDelete,
  };
};
