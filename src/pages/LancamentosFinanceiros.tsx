
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLancamentos, type Lancamento } from '@/hooks/useLancamentos';
import { useCadastros } from '@/hooks/useCadastros';
import LancamentosSummaryCards from '@/components/lancamentos/LancamentosSummaryCards';
import LancamentosFilters from '@/components/lancamentos/LancamentosFilters';
import LancamentosTable from '@/components/lancamentos/LancamentosTable';
import LancamentosForm from '@/components/lancamentos/LancamentosForm';

type LancamentoComRelacoes = Lancamento & {
  cliente?: { nome: string } | null;
  fornecedor?: { nome: string } | null;
};

const LancamentosFinanceiros: React.FC = () => {
  const [filteredLancamentos, setFilteredLancamentos] = useState<LancamentoComRelacoes[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [categoriaFilter, setCategoriaFilter] = useState('todas');
  const [activeTab, setActiveTab] = useState('lista');
  const [editingLancamento, setEditingLancamento] = useState<LancamentoComRelacoes | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { useQuery: useLancamentosQuery, useCreate, useUpdate, useDelete } = useLancamentos();
  const { data: lancamentos, isLoading } = useLancamentosQuery();
  const createLancamento = useCreate();
  const updateLancamento = useUpdate();
  const deleteLancamento = useDelete();

  const { useQuery: useCadastrosQuery } = useCadastros();
  const { data: clientes } = useCadastrosQuery('Cliente');
  const { data: fornecedores } = useCadastrosQuery('Fornecedor');

  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    tipo: 'receita' as 'receita' | 'despesa',
    valor: '',
    cliente_id: '',
    fornecedor_id: '',
    categoria: '',
    observacoes: ''
  });

  useEffect(() => {
    if (lancamentos) {
      filterLancamentos();
    }
  }, [lancamentos, searchTerm, tipoFilter, categoriaFilter]);

  const filterLancamentos = () => {
    if (!lancamentos) return;
    
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

    setFilteredLancamentos(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipo) {
      toast({
        title: "Erro",
        description: "Por favor, selecione o tipo de lançamento.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.categoria) {
      toast({
        title: "Erro",
        description: "Por favor, selecione a categoria.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, informe um valor válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const lancamentoData = {
        data: formData.data,
        tipo: formData.tipo,
        categoria: formData.categoria,
        valor: parseFloat(formData.valor),
        cliente_id: formData.cliente_id || undefined,
        fornecedor_id: formData.fornecedor_id || undefined,
        observacoes: formData.observacoes.trim() || undefined,
        user_id: user!.id,
        status: 'ativo'
      };

      console.log('Dados do lançamento a serem salvos:', lancamentoData);

      if (editingLancamento) {
        await updateLancamento.mutateAsync({ id: editingLancamento.id, ...lancamentoData });
        setEditingLancamento(null);
      } else {
        await createLancamento.mutateAsync(lancamentoData);
      }

      resetForm();
      setActiveTab('lista');
    } catch (error: any) {
      console.error('Erro ao salvar lançamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      data: new Date().toISOString().split('T')[0],
      tipo: 'receita',
      valor: '',
      cliente_id: '',
      fornecedor_id: '',
      categoria: '',
      observacoes: ''
    });
    setEditingLancamento(null);
  };

  const handleEdit = (lancamento: LancamentoComRelacoes) => {
    setFormData({
      data: lancamento.data,
      tipo: lancamento.tipo,
      valor: lancamento.valor.toString(),
      cliente_id: lancamento.cliente_id || '',
      fornecedor_id: lancamento.fornecedor_id || '',
      categoria: lancamento.categoria,
      observacoes: lancamento.observacoes || ''
    });
    setEditingLancamento(lancamento);
    setActiveTab('formulario');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      try {
        await deleteLancamento.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao excluir lançamento:', error);
      }
    }
  };

  const handleCancel = () => {
    resetForm();
    setActiveTab('lista');
  };

  const handleNewLancamento = () => {
    console.log('Clicando em Novo Lançamento');
    resetForm();
    setActiveTab('formulario');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-fluxo-black-900">Lançamentos Financeiros</h1>
          <p className="text-fluxo-black-600 mt-2">Controle de receitas e despesas</p>
        </div>
      </div>

      <LancamentosSummaryCards lancamentos={filteredLancamentos} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de Lançamentos</TabsTrigger>
          <TabsTrigger value="formulario" onClick={handleNewLancamento}>
            {editingLancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <LancamentosFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            tipoFilter={tipoFilter}
            setTipoFilter={setTipoFilter}
            categoriaFilter={categoriaFilter}
            setCategoriaFilter={setCategoriaFilter}
          />

          <LancamentosTable
            lancamentos={filteredLancamentos}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="formulario">
          <LancamentosForm
            formData={formData}
            setFormData={setFormData}
            editingLancamento={editingLancamento}
            loading={loading}
            clientes={clientes}
            fornecedores={fornecedores}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LancamentosFinanceiros;
