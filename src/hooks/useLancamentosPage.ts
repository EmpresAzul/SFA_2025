import { useState, useEffect, useMemo } from "react";
import { useLancamentos } from "@/hooks/useLancamentos";
import { useCadastros } from "@/hooks/useCadastros";
import type { LancamentoComRelacoes } from "@/types/lancamentos";

export const useLancamentosPage = () => {
  const [activeTab, setActiveTab] = useState("lista");
  const [loading, setLoading] = useState(false);
  const [editingLancamento, setEditingLancamento] = useState<LancamentoComRelacoes | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterStatus, setFilterStatus] = useState("ativo");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Hooks
  const lancamentosQuery = useLancamentos().useQuery();
  const { useCreate, useUpdate, useDelete } = useLancamentos();
  const createLancamento = useCreate();
  const updateLancamento = useUpdate();
  const deleteLancamento = useDelete();

  const cadastrosHook = useCadastros();
  const cadastrosQuery = cadastrosHook.useQuery();

  const filteredLancamentos = useMemo(() => {
    if (!lancamentosQuery.data) return [];

    return lancamentosQuery.data.filter((lancamento) => {
      const matchesSearch =
        lancamento.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lancamento.observacoes?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTipo = !filterTipo || lancamento.tipo === filterTipo;
      const matchesCategoria =
        !filterCategoria || lancamento.categoria === filterCategoria;
      const matchesStatus = !filterStatus || lancamento.status === filterStatus;

      return (
        matchesSearch && matchesTipo && matchesCategoria && matchesStatus
      );
    });
  }, [
    lancamentosQuery.data,
    searchTerm,
    filterTipo,
    filterCategoria,
    filterStatus,
  ]);

  const paginatedLancamentos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredLancamentos.slice(startIndex, endIndex);
  }, [currentPage, filteredLancamentos, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredLancamentos.length / itemsPerPage);
  }, [filteredLancamentos.length, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    filterTipo,
    filterCategoria,
    filterStatus,
    lancamentosQuery.data,
  ]);

  const clientes = useMemo(() => {
    return cadastrosQuery.data?.filter(c => c.tipo === 'cliente') || [];
  }, [cadastrosQuery.data]);

  const fornecedores = useMemo(() => {
    return cadastrosQuery.data?.filter(c => c.tipo === 'fornecedor') || [];
  }, [cadastrosQuery.data]);

  const handleEdit = (lancamento: LancamentoComRelacoes) => {
    setEditingLancamento(lancamento);
    setActiveTab("formulario");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLancamento.mutateAsync(id);
    } catch (error) {
      console.error("Erro ao excluir lançamento:", error);
    }
  };

  return {
    // State
    activeTab,
    setActiveTab,
    loading,
    setLoading,
    editingLancamento,
    setEditingLancamento,
    searchTerm,
    setSearchTerm,
    filterTipo,
    setFilterTipo,
    filterCategoria,
    setFilterCategoria,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    
    // Data
    lancamentos: lancamentosQuery.data || [],
    clientes,
    fornecedores,
    isLoading: lancamentosQuery.isLoading || cadastrosQuery.isLoading,
    
    // Mutations
    createLancamento,
    updateLancamento,
    deleteLancamento,
    
    // Handlers
    handleEdit,
    handleDelete,
  };
};
