
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Package, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface Estoque {
  id: string;
  data: string;
  nome_produto: string;
  unidade_medida: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  quantidade_bruta: number;
  quantidade_liquida: number;
  status: string;
  created_at: string;
}

const unidadesMedida = [
  'KG', 'G', 'L', 'ML', 'UN', 'CX', 'PC', 'M', 'CM', 'M²', 'M³'
];

const EstoqueManagement: React.FC = () => {
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [filteredEstoques, setFilteredEstoques] = useState<Estoque[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    data: '',
    nome_produto: '',
    unidade_medida: '',
    quantidade: '',
    valor_unitario: '',
    valor_total: '',
    quantidade_bruta: '',
    quantidade_liquida: ''
  });

  useEffect(() => {
    if (user) {
      fetchEstoques();
    }
  }, [user]);

  useEffect(() => {
    filterEstoques();
  }, [estoques, searchTerm, statusFilter]);

  useEffect(() => {
    // Calcular valor total automaticamente
    const quantidade = parseFloat(formData.quantidade) || 0;
    const valorUnitario = parseFloat(formData.valor_unitario) || 0;
    const valorTotal = quantidade * valorUnitario;
    setFormData(prev => ({ ...prev, valor_total: valorTotal.toFixed(2) }));
  }, [formData.quantidade, formData.valor_unitario]);

  const fetchEstoques = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('estoques')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEstoques(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar estoques",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEstoques = () => {
    let filtered = estoques;

    if (searchTerm) {
      filtered = filtered.filter(estoque =>
        estoque.nome_produto.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'todos') {
      filtered = filtered.filter(estoque => estoque.status === statusFilter);
    }

    setFilteredEstoques(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('estoques')
        .insert([{
          user_id: user?.id,
          data: formData.data,
          nome_produto: formData.nome_produto,
          unidade_medida: formData.unidade_medida,
          quantidade: parseFloat(formData.quantidade),
          valor_unitario: parseFloat(formData.valor_unitario),
          valor_total: parseFloat(formData.valor_total),
          quantidade_bruta: parseFloat(formData.quantidade_bruta),
          quantidade_liquida: parseFloat(formData.quantidade_liquida)
        }]);

      if (error) throw error;

      toast({
        title: "Estoque cadastrado com sucesso!",
        description: "O item foi adicionado ao estoque.",
      });

      setFormData({
        data: '',
        nome_produto: '',
        unidade_medida: '',
        quantidade: '',
        valor_unitario: '',
        valor_total: '',
        quantidade_bruta: '',
        quantidade_liquida: ''
      });
      setShowForm(false);
      fetchEstoques();
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar estoque",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      ativo: 'bg-emerald-100 text-emerald-800',
      inativo: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTotalValue = () => {
    return filteredEstoques.reduce((sum, estoque) => sum + estoque.valor_total, 0);
  };

  const getTotalItems = () => {
    return filteredEstoques.reduce((sum, estoque) => sum + estoque.quantidade, 0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-fluxo-black-900">Gestão de Estoques</h1>
          <p className="text-fluxo-black-600 mt-2">Controle completo do seu estoque</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Item
        </Button>
      </div>

      {/* Painéis de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-emerald-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-emerald-600">Total de Itens</p>
                <p className="text-2xl font-bold text-emerald-900">{filteredEstoques.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Quantidade Total</p>
                <p className="text-2xl font-bold text-blue-900">{getTotalItems().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Valor Total</p>
                <p className="text-2xl font-bold text-purple-900">R$ {getTotalValue().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-600">Valor Médio</p>
                <p className="text-2xl font-bold text-orange-900">
                  R$ {filteredEstoques.length > 0 ? (getTotalValue() / filteredEstoques.length).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de Estoques</TabsTrigger>
          <TabsTrigger value="formulario">Cadastrar Item</TabsTrigger>
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
                  <Label>Buscar Produto</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Digite o nome do produto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela */}
          <Card>
            <CardHeader>
              <CardTitle>Itens do Estoque ({filteredEstoques.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor Unitário</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEstoques.map((estoque) => (
                    <TableRow key={estoque.id}>
                      <TableCell>{format(new Date(estoque.data), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="font-medium">{estoque.nome_produto}</TableCell>
                      <TableCell>{estoque.unidade_medida}</TableCell>
                      <TableCell>{estoque.quantidade}</TableCell>
                      <TableCell>R$ {estoque.valor_unitario.toFixed(2)}</TableCell>
                      <TableCell>R$ {estoque.valor_total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(estoque.status)}>
                          {estoque.status}
                        </Badge>
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
              <CardTitle>Cadastrar Novo Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nome_produto">Nome do Produto</Label>
                    <Input
                      id="nome_produto"
                      value={formData.nome_produto}
                      onChange={(e) => setFormData({ ...formData, nome_produto: e.target.value })}
                      placeholder="Digite o nome do produto"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unidade_medida">Unidade de Medida</Label>
                    <Select value={formData.unidade_medida} onValueChange={(value) => setFormData({ ...formData, unidade_medida: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {unidadesMedida.map((unidade) => (
                          <SelectItem key={unidade} value={unidade}>{unidade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      step="0.01"
                      value={formData.quantidade}
                      onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valor_unitario">Valor Unitário (R$)</Label>
                    <Input
                      id="valor_unitario"
                      type="number"
                      step="0.01"
                      value={formData.valor_unitario}
                      onChange={(e) => setFormData({ ...formData, valor_unitario: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valor_total">Valor Total (R$)</Label>
                    <Input
                      id="valor_total"
                      type="number"
                      step="0.01"
                      value={formData.valor_total}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantidade_bruta">Quantidade Bruta</Label>
                    <Input
                      id="quantidade_bruta"
                      type="number"
                      step="0.01"
                      value={formData.quantidade_bruta}
                      onChange={(e) => setFormData({ ...formData, quantidade_bruta: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantidade_liquida">Quantidade Líquida</Label>
                    <Input
                      id="quantidade_liquida"
                      type="number"
                      step="0.01"
                      value={formData.quantidade_liquida}
                      onChange={(e) => setFormData({ ...formData, quantidade_liquida: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
                >
                  {loading ? "Cadastrando..." : "Cadastrar Item"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EstoqueManagement;
