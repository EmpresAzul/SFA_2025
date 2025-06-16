
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
import { Search, Package, TrendingUp, DollarSign, BarChart3, Eye, Pencil, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  const [selectedEstoque, setSelectedEstoque] = useState<Estoque | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
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
      if (isEditMode && selectedEstoque) {
        // Atualizar estoque existente
        const { error } = await supabase
          .from('estoques')
          .update({
            data: formData.data,
            nome_produto: formData.nome_produto,
            unidade_medida: formData.unidade_medida,
            quantidade: parseFloat(formData.quantidade),
            valor_unitario: parseFloat(formData.valor_unitario),
            valor_total: parseFloat(formData.valor_total),
            quantidade_bruta: parseFloat(formData.quantidade_bruta),
            quantidade_liquida: parseFloat(formData.quantidade_liquida),
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedEstoque.id)
          .eq('user_id', user?.id);

        if (error) throw error;

        toast({
          title: "Estoque atualizado com sucesso!",
          description: "As alterações foram salvas.",
        });
      } else {
        // Criar novo estoque
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
      }

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
      setSelectedEstoque(null);
      setIsEditMode(false);
      fetchEstoques();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar estoque",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (estoque: Estoque) => {
    setSelectedEstoque(estoque);
    setFormData({
      data: estoque.data,
      nome_produto: estoque.nome_produto,
      unidade_medida: estoque.unidade_medida,
      quantidade: estoque.quantidade.toString(),
      valor_unitario: estoque.valor_unitario.toString(),
      valor_total: estoque.valor_total.toString(),
      quantidade_bruta: estoque.quantidade_bruta.toString(),
      quantidade_liquida: estoque.quantidade_liquida.toString()
    });
    setIsEditMode(true);
  };

  const handleToggleStatus = async (estoque: Estoque) => {
    try {
      const newStatus = estoque.status === 'ativo' ? 'inativo' : 'ativo';
      const { error } = await supabase
        .from('estoques')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', estoque.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Status atualizado!",
        description: `Item ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso.`,
      });

      fetchEstoques();
    } catch (error: any) {
      toast({
        title: "Erro ao alterar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('estoques')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Item excluído!",
        description: "O item foi removido do estoque.",
      });

      fetchEstoques();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
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
    setSelectedEstoque(null);
    setIsEditMode(false);
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
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestão de Estoques
          </h1>
          <p className="text-gray-600 mt-2">Controle completo e inteligente do seu estoque</p>
        </div>
      </div>

      {/* Painéis de Resumo Reduzidos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total de Itens</p>
                <p className="text-xl font-bold">{filteredEstoques.length}</p>
              </div>
              <Package className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Quantidade Total</p>
                <p className="text-xl font-bold">{getTotalItems().toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Valor Total</p>
                <p className="text-xl font-bold">R$ {getTotalValue().toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-400 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Valor Médio</p>
                <p className="text-xl font-bold">
                  R$ {filteredEstoques.length > 0 ? (getTotalValue() / filteredEstoques.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg rounded-xl h-14">
          <TabsTrigger 
            value="lista" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-lg py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            📋 Lista de Estoques
          </TabsTrigger>
          <TabsTrigger 
            value="formulario"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-lg py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            ➕ {isEditMode ? 'Editar Item' : 'Cadastrar Item'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6 mt-8">
          {/* Filtros Melhorados */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
              <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🔍 Filtros de Pesquisa
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Buscar Produto</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Digite o nome do produto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="ativo">✅ Ativo</SelectItem>
                      <SelectItem value="inativo">❌ Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela Melhorada */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
              <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                📦 Itens do Estoque ({filteredEstoques.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50 hover:bg-gray-100">
                      <TableHead className="font-semibold text-gray-700">Data</TableHead>
                      <TableHead className="font-semibold text-gray-700">Produto</TableHead>
                      <TableHead className="font-semibold text-gray-700">Unidade</TableHead>
                      <TableHead className="font-semibold text-gray-700">Quantidade</TableHead>
                      <TableHead className="font-semibold text-gray-700">Valor Unitário</TableHead>
                      <TableHead className="font-semibold text-gray-700">Valor Total</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEstoques.map((estoque) => (
                      <TableRow key={estoque.id} className="hover:bg-blue-50 transition-colors duration-200">
                        <TableCell className="font-medium">{format(new Date(estoque.data), 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="font-semibold text-gray-800">{estoque.nome_produto}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {estoque.unidade_medida}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{estoque.quantidade}</TableCell>
                        <TableCell className="text-green-600 font-semibold">R$ {estoque.valor_unitario.toFixed(2)}</TableCell>
                        <TableCell className="text-green-700 font-bold">R$ {estoque.valor_total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(estoque.status)}>
                            {estoque.status === 'ativo' ? '✅ Ativo' : '❌ Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            {/* Botão Visualizar */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                                  onClick={() => setSelectedEstoque(estoque)}
                                >
                                  <Eye className="h-4 w-4 text-blue-600" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    📦 Detalhes do Item
                                  </DialogTitle>
                                </DialogHeader>
                                {selectedEstoque && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p className="font-medium text-gray-600">Produto:</p>
                                        <p className="font-semibold">{selectedEstoque.nome_produto}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-600">Data:</p>
                                        <p>{format(new Date(selectedEstoque.data), 'dd/MM/yyyy')}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-600">Quantidade:</p>
                                        <p>{selectedEstoque.quantidade} {selectedEstoque.unidade_medida}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-600">Valor Unit.:</p>
                                        <p className="text-green-600 font-semibold">R$ {selectedEstoque.valor_unitario.toFixed(2)}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-600">Quantidade Bruta:</p>
                                        <p>{selectedEstoque.quantidade_bruta}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-600">Quantidade Líquida:</p>
                                        <p>{selectedEstoque.quantidade_liquida}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <p className="font-medium text-gray-600">Valor Total:</p>
                                        <p className="text-green-700 font-bold text-lg">R$ {selectedEstoque.valor_total.toFixed(2)}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {/* Botão Editar */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-yellow-50 hover:border-yellow-300"
                              onClick={() => {
                                handleEdit(estoque);
                                // Switch to form tab
                                const tabTrigger = document.querySelector('[value="formulario"]') as HTMLElement;
                                if (tabTrigger) tabTrigger.click();
                              }}
                            >
                              <Pencil className="h-4 w-4 text-yellow-600" />
                            </Button>

                            {/* Botão Ativar/Desativar */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-purple-50 hover:border-purple-300"
                              onClick={() => handleToggleStatus(estoque)}
                            >
                              {estoque.status === 'ativo' ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>

                            {/* Botão Excluir */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza de que deseja excluir permanentemente o item "{estoque.nome_produto}"? 
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(estoque.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulario" className="mt-8">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
              <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isEditMode ? '✏️ Editar Item do Estoque' : '➕ Cadastrar Novo Item'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="data" className="text-gray-700 font-medium">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      required
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nome_produto" className="text-gray-700 font-medium">Nome do Produto</Label>
                    <Input
                      id="nome_produto"
                      value={formData.nome_produto}
                      onChange={(e) => setFormData({ ...formData, nome_produto: e.target.value })}
                      placeholder="Digite o nome do produto"
                      required
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unidade_medida" className="text-gray-700 font-medium">Unidade de Medida</Label>
                    <Select value={formData.unidade_medida} onValueChange={(value) => setFormData({ ...formData, unidade_medida: value })}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg">
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
                    <Label htmlFor="quantidade" className="text-gray-700 font-medium">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      step="0.01"
                      value={formData.quantidade}
                      onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                      placeholder="0.00"
                      required
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valor_unitario" className="text-gray-700 font-medium">Valor Unitário (R$)</Label>
                    <Input
                      id="valor_unitario"
                      type="number"
                      step="0.01"
                      value={formData.valor_unitario}
                      onChange={(e) => setFormData({ ...formData, valor_unitario: e.target.value })}
                      placeholder="0.00"
                      required
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valor_total" className="text-gray-700 font-medium">Valor Total (R$)</Label>
                    <Input
                      id="valor_total"
                      type="number"
                      step="0.01"
                      value={formData.valor_total}
                      readOnly
                      className="h-12 bg-green-50 border-2 border-green-200 rounded-lg font-semibold text-green-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantidade_bruta" className="text-gray-700 font-medium">Quantidade Bruta</Label>
                    <Input
                      id="quantidade_bruta"
                      type="number"
                      step="0.01"
                      value={formData.quantidade_bruta}
                      onChange={(e) => setFormData({ ...formData, quantidade_bruta: e.target.value })}
                      placeholder="0.00"
                      required
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantidade_liquida" className="text-gray-700 font-medium">Quantidade Líquida</Label>
                    <Input
                      id="quantidade_liquida"
                      type="number"
                      step="0.01"
                      value={formData.quantidade_liquida}
                      onChange={(e) => setFormData({ ...formData, quantidade_liquida: e.target.value })}
                      placeholder="0.00"
                      required
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? "Salvando..." : isEditMode ? "Atualizar Item" : "Cadastrar Item"}
                  </Button>
                  
                  {isEditMode && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="h-12 px-6 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-semibold"
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

export default EstoqueManagement;
