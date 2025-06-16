
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, TrendingDown, DollarSign, BarChart3, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { useLancamentos, type Lancamento } from '@/hooks/useLancamentos';
import { useCadastros } from '@/hooks/useCadastros';

const categoriasReceita = ['Receita', 'Receita Não Operacional'];
const categoriasDespesa = ['Despesa fixa', 'Custo variável', 'Despesa não operacional', 'Salários', 'Investimentos'];

const LancamentosFinanceiros: React.FC = () => {
  const [filteredLancamentos, setFilteredLancamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [categoriaFilter, setCategoriaFilter] = useState('todas');
  const [activeTab, setActiveTab] = useState('lista');
  const [editingLancamento, setEditingLancamento] = useState<any>(null);
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
    
    let filtered = lancamentos;

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

    setLoading(true);

    try {
      const lancamentoData = {
        ...formData,
        valor: parseFloat(formData.valor),
        user_id: user!.id,
        status: 'ativo'
      };

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

  const handleEdit = (lancamento: any) => {
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

  const getTipoClasses = (tipo: string) => {
    return tipo === 'receita' 
      ? 'bg-emerald-100 text-emerald-800' 
      : 'bg-red-100 text-red-800';
  };

  const getTotalReceitas = () => {
    return filteredLancamentos
      .filter(l => l.tipo === 'receita')
      .reduce((sum, l) => sum + l.valor, 0);
  };

  const getTotalDespesas = () => {
    return filteredLancamentos
      .filter(l => l.tipo === 'despesa')
      .reduce((sum, l) => sum + l.valor, 0);
  };

  const getSaldo = () => {
    return getTotalReceitas() - getTotalDespesas();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-fluxo-black-900">Lançamentos Financeiros</h1>
          <p className="text-fluxo-black-600 mt-2">Controle de receitas e despesas</p>
        </div>
      </div>

      {/* Painéis de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-emerald-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-emerald-600">Total Receitas</p>
                <p className="text-2xl font-bold text-emerald-900">R$ {getTotalReceitas().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-red-600">Total Despesas</p>
                <p className="text-2xl font-bold text-red-900">R$ {getTotalDespesas().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${getSaldo() >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-orange-50 to-orange-100 border-orange-200'}`}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className={`h-8 w-8 ${getSaldo() >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              <div className="ml-4">
                <p className={`text-sm font-medium ${getSaldo() >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Saldo</p>
                <p className={`text-2xl font-bold ${getSaldo() >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                  R$ {getSaldo().toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Total Lançamentos</p>
                <p className="text-2xl font-bold text-purple-900">{filteredLancamentos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de Lançamentos</TabsTrigger>
          <TabsTrigger value="formulario">
            {editingLancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por categoria ou observação..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={tipoFilter} onValueChange={setTipoFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      {[...categoriasReceita, ...categoriasDespesa].map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela */}
          <Card>
            <CardHeader>
              <CardTitle>Lançamentos ({filteredLancamentos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Cliente/Fornecedor</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading && filteredLancamentos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500">
                        Nenhum lançamento encontrado
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredLancamentos.map((lancamento) => (
                    <TableRow key={lancamento.id}>
                      <TableCell>{format(new Date(lancamento.data), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <Badge className={getTipoClasses(lancamento.tipo)}>
                          {lancamento.tipo === 'receita' ? 'Receita' : 'Despesa'}
                        </Badge>
                      </TableCell>
                      <TableCell className={lancamento.tipo === 'receita' ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                        R$ {lancamento.valor.toFixed(2)}
                      </TableCell>
                      <TableCell>{lancamento.categoria}</TableCell>
                      <TableCell>{lancamento.cliente?.nome || lancamento.fornecedor?.nome || '-'}</TableCell>
                      <TableCell>{lancamento.observacoes || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(lancamento)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(lancamento.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulario">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingLancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data *</Label>
                    <Input
                      id="data"
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo *</Label>
                    <Select value={formData.tipo} onValueChange={(value: 'receita' | 'despesa') => 
                      setFormData({ ...formData, tipo: value, categoria: '', cliente_id: '', fornecedor_id: '' })
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="receita">Receita</SelectItem>
                        <SelectItem value="despesa">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor (R$) *</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      value={formData.valor}
                      onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.tipo === 'receita' && categoriasReceita.map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                        ))}
                        {formData.tipo === 'despesa' && categoriasDespesa.map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.tipo === 'receita' && clientes && (
                    <div className="space-y-2">
                      <Label htmlFor="cliente_id">Cliente</Label>
                      <Select value={formData.cliente_id} onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Nenhum</SelectItem>
                          {clientes.map((cliente) => (
                            <SelectItem key={cliente.id} value={cliente.id}>{cliente.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.tipo === 'despesa' && fornecedores && (
                    <div className="space-y-2">
                      <Label htmlFor="fornecedor_id">Fornecedor</Label>
                      <Select value={formData.fornecedor_id} onValueChange={(value) => setFormData({ ...formData, fornecedor_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um fornecedor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Nenhum</SelectItem>
                          {fornecedores.map((fornecedor) => (
                            <SelectItem key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    placeholder="Observações opcionais..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
                  >
                    {loading ? "Salvando..." : editingLancamento ? "Atualizar Lançamento" : "Cadastrar Lançamento"}
                  </Button>
                  {editingLancamento && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        setActiveTab('lista');
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LancamentosFinanceiros;
