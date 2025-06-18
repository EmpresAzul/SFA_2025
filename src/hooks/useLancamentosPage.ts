
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLancamentos, type Lancamento } from '@/hooks/useLancamentos';
import { useCadastros } from '@/hooks/useCadastros';

type LancamentoComRelacoes = Lancamento & {
  cliente?: { nome: string } | null;
  fornecedor?: { nome: string } | null;
};

export const useLancamentosPage = () => {
  const [filteredLancamentos, setFilteredLancamentos] = useState<LancamentoComRelacoes[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [categoriaFilter, setCategoriaFilter] = useState('todas');
  const [activeTab, setActiveTab] = useState('lista');
  const [editingLancamento, setEditingLancamento] = useState<LancamentoComRelacoes | null>(null);
  const { user, session } = useAuth();
  const { toast } = useToast();

  console.log('useLancamentosPage: Usuário autenticado:', !!user);
  console.log('useLancamentosPage: Sessão ativa:', !!session);

  const { useQuery: useLancamentosQuery, useCreate, useUpdate, useDelete } = useLancamentos();
  const { data: lancamentos, isLoading, error } = useLancamentosQuery();
  
  console.log('useLancamentosPage: Dados de lançamentos:', lancamentos);
  console.log('useLancamentosPage: Carregando:', isLoading);
  console.log('useLancamentosPage: Erro:', error);

  const createLancamento = useCreate();
  const updateLancamento = useUpdate();
  const deleteLancamento = useDelete();

  const { useQuery: useCadastrosQuery } = useCadastros();
  const { data: clientes } = useCadastrosQuery('Cliente');
  const { data: fornecedores } = useCadastrosQuery('Fornecedor');

  useEffect(() => {
    console.log('useLancamentosPage: useEffect chamado - lancamentos:', lancamentos?.length || 0);
    if (lancamentos) {
      filterLancamentos();
    }
  }, [lancamentos, searchTerm, tipoFilter, categoriaFilter]);

  const filterLancamentos = () => {
    if (!lancamentos) {
      console.log('useLancamentosPage: Sem lançamentos para filtrar');
      return;
    }
    
    console.log('useLancamentosPage: Filtrando', lancamentos.length, 'lançamentos');
    let filtered: LancamentoComRelacoes[] = [...lancamentos];

    if (searchTerm) {
      filtered = filtered.filter(lancamento =>
        lancamento.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lancamento.observacoes && lancamento.observacoes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (tipoFilter !== 'todos') {
      filtered = filtered.filter(lancamento => lancamento.tipo === tipoFilter);
    }

    if (categoriaFilter !== 'todas') {
      filtered = filtered.filter(lancamento => lancamento.categoria === categoriaFilter);
    }

    console.log('useLancamentosPage: Lançamentos filtrados:', filtered.length);
    setFilteredLancamentos(filtered);
  };

  const handleEdit = (lancamento: LancamentoComRelacoes) => {
    console.log('Editando lançamento:', lancamento);
    setEditingLancamento(lancamento);
    setActiveTab('formulario');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      try {
        await deleteLancamento.mutateAsync(id);
        toast({
          title: "Sucesso!",
          description: "Lançamento excluído com sucesso.",
        });
      } catch (error) {
        console.error('Erro ao excluir lançamento:', error);
        toast({
          title: "Erro ao excluir",
          description: "Ocorreu um erro ao excluir o lançamento.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNewLancamento = () => {
    console.log('Clicando em Novo Lançamento');
    setEditingLancamento(null);
    setActiveTab('formulario');
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
