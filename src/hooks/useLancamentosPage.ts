import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLancamentos, type Lancamento } from "@/hooks/useLancamentos";
import { useCadastros } from "@/hooks/useCadastros";

export const useLancamentosPage = () => {
  const [filteredLancamentos, setFilteredLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [categoriaFilter, setCategoriaFilter] = useState("todas");
  const [activeTab, setActiveTab] = useState("lista");
  const [editingLancamento, setEditingLancamento] = useState<Lancamento | null>(null);
  
  const { user, session } = useAuth();
  const { toast } = useToast();

  const {
    useQuery: useLancamentosQuery,
    useCreate,
    useUpdate,
    useDelete,
  } = useLancamentos();
  
  const { data: lancamentos, isLoading, error } = useLancamentosQuery();

  console.log("🔍 useLancamentosPage - Estado:", {
    lancamentos: lancamentos?.length || 0,
    isLoading,
    hasError: !!error,
    errorMessage: error?.message
  });

  const createLancamento = useCreate();
  const updateLancamento = useUpdate();
  const deleteLancamento = useDelete();

  const { useQuery: useCadastrosQuery } = useCadastros();
  const cadastrosQuery = useCadastrosQuery();
  const allCadastros = cadastrosQuery.data || [];
  const clientes = allCadastros.filter((item: any) => item.tipo === "Cliente");
  const fornecedores = allCadastros.filter((item: any) => item.tipo === "Fornecedor");

  useEffect(() => {
    console.log("🔄 useEffect - Filtrando lançamentos:", lancamentos?.length || 0);
    
    if (!lancamentos || lancamentos.length === 0) {
      console.log("⚠️ Nenhum lançamento para filtrar");
      setFilteredLancamentos([]);
      return;
    }

    let filtered: Lancamento[] = [...lancamentos];

    // Aplicar filtro de busca
    if (searchTerm && searchTerm.trim()) {
      filtered = filtered.filter(
        (lancamento) =>
          lancamento.categoria
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (lancamento.observacoes &&
            lancamento.observacoes
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (lancamento.descricao &&
            lancamento.descricao
              .toLowerCase()
              .includes(searchTerm.toLowerCase())),
      );
    }

    // Aplicar filtro de tipo
    if (tipoFilter !== "todos") {
      filtered = filtered.filter(
        (lancamento) => lancamento.tipo === tipoFilter,
      );
    }

    // Aplicar filtro de categoria
    if (categoriaFilter !== "todas") {
      filtered = filtered.filter(
        (lancamento) => lancamento.categoria === categoriaFilter,
      );
    }

    // Ordenar por data (mais recente primeiro)
    filtered.sort((a, b) => {
      const dateA = new Date(a.data).getTime();
      const dateB = new Date(b.data).getTime();
      return dateB - dateA; // Ordem decrescente (mais recente primeiro)
    });

    console.log("✅ Lançamentos filtrados e ordenados:", filtered.length);
    setFilteredLancamentos(filtered);
  }, [lancamentos, searchTerm, tipoFilter, categoriaFilter]);

  const filterLancamentos = () => {
    // Função mantida para compatibilidade, mas não é mais usada
    console.log("⚠️ filterLancamentos() chamada - usar useEffect ao invés");
  };

  const handleEdit = (lancamento: Lancamento) => {
    setEditingLancamento(lancamento);
    setActiveTab("formulario");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLancamento.mutateAsync(id);
      toast({
        title: "Sucesso!",
        description: "Lançamento excluído com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir lançamento:", error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o lançamento.",
        variant: "destructive",
      });
    }
  };

  const handleNewLancamento = () => {
    setEditingLancamento(null);
    setActiveTab("formulario");
  };

  return {
    // State
    filteredLancamentos,
    loading,
    setLoading,
    searchTerm,
    setSearchTerm,
    tipoFilter,
    setTipoFilter,
    categoriaFilter,
    setCategoriaFilter,
    activeTab,
    setActiveTab,
    editingLancamento,
    setEditingLancamento,

    // Data
    isLoading,
    clientes,
    fornecedores,
    user,
    toast,

    // Mutations
    createLancamento,
    updateLancamento,
    deleteLancamento,

    // Handlers
    handleEdit,
    handleDelete,
    handleNewLancamento,
  };
};
