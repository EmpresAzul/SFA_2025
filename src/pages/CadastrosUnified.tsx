
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useCadastros } from '@/hooks/useCadastros';
import { useCadastroForm } from '@/hooks/useCadastroForm';
import { Edit, Trash2, Plus, Search, Users, Building, UserCheck, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import CadastroEditModal from '@/components/cadastro/CadastroEditModal';
import CadastroViewModal from '@/components/cadastro/CadastroViewModal';

const CadastrosUnified: React.FC = () => {
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

  const {
    formData,
    setFormData,
    loading: formLoading,
    handleSubmit,
    resetForm
  } = useCadastroForm('Cliente');

  // Combinar todos os dados - CORRIGINDO OS TIPOS
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

  if (loading) {
    return (
      <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-teal-50 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cadastros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-teal-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            👥 Cadastros Unificados
          </h1>
          <p className="text-gray-600 mt-2 text-xs sm:text-sm">Gestão completa de clientes, fornecedores e funcionários</p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="responsive-grid mb-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-colorful">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white/90" />
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-white/90">Total de Cadastros</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-colorful">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center">
              <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-white/90" />
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-white/90">Clientes</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.clientes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-colorful">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center">
              <Building className="h-6 w-6 sm:h-8 sm:w-8 text-white/90" />
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-white/90">Fornecedores</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.fornecedores}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-colorful">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white/90" />
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-white/90">Funcionários</p>
                <p className="text-xl sm:text-2xl font-bold">{stats.funcionarios}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg rounded-xl h-10 sm:h-12">
          <TabsTrigger 
            value="lista"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white font-semibold text-xs sm:text-sm py-2 sm:py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            📋 Lista de Cadastros
          </TabsTrigger>
          <TabsTrigger 
            value="formulario"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white font-semibold text-xs sm:text-sm py-2 sm:py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            ➕ Novo Cadastro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="responsive-margin mt-4 sm:mt-6">
          {/* Filtros */}
          <Card className="shadow-colorful border-0 bg-white/90 backdrop-blur-sm mb-4 sm:mb-6">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-base">🔍 Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <Input
                      placeholder="Nome ou e-mail..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 sm:pl-10 h-8 sm:h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Tipo</Label>
                  <Select value={tipoFilter} onValueChange={setTipoFilter}>
                    <SelectTrigger className="h-8 sm:h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="cliente">Clientes</SelectItem>
                      <SelectItem value="fornecedor">Fornecedores</SelectItem>
                      <SelectItem value="funcionário">Funcionários</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 sm:h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg text-xs sm:text-sm">
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
          <Card className="shadow-colorful border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-sm sm:text-base">📊 Lista de Cadastros ({filteredItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="responsive-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Nome</TableHead>
                      <TableHead className="text-xs sm:text-sm">Tipo</TableHead>
                      <TableHead className="mobile-hidden text-xs sm:text-sm">E-mail</TableHead>
                      <TableHead className="mobile-hidden text-xs sm:text-sm">Telefone</TableHead>
                      <TableHead className="text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={`${item.tipoDisplay}-${item.id}`}>
                        <TableCell className="font-medium text-xs sm:text-sm">{item.nome}</TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.tipoDisplay === 'Cliente' ? 'bg-blue-100 text-blue-800' :
                            item.tipoDisplay === 'Fornecedor' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {item.tipoDisplay === 'Cliente' ? '👤 Cliente' :
                             item.tipoDisplay === 'Fornecedor' ? '🏢 Fornecedor' :
                             '👨‍💼 Funcionário'}
                          </span>
                        </TableCell>
                        <TableCell className="mobile-hidden text-xs sm:text-sm">{item.email}</TableCell>
                        <TableCell className="mobile-hidden text-xs sm:text-sm">{item.telefone}</TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status === 'ativo' ? '✅ Ativo' : '❌ Inativo'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <CadastroViewModal cadastro={item} />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleStatus(item)}
                              className={`hover:bg-gray-50 h-6 w-6 sm:h-8 sm:w-8 p-0 ${
                                item.status === 'ativo' ? 'text-green-600' : 'text-red-600'
                              }`}
                              title={item.status === 'ativo' ? 'Desativar' : 'Ativar'}
                            >
                              {item.status === 'ativo' ? 
                                <ToggleRight className="h-2 w-2 sm:h-3 sm:w-3" /> : 
                                <ToggleLeft className="h-2 w-2 sm:h-3 sm:w-3" />
                              }
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                              className="hover:bg-blue-50 h-6 w-6 sm:h-8 sm:w-8 p-0"
                              title="Editar"
                            >
                              <Edit className="h-2 w-2 sm:h-3 sm:w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(item.id, item.nome)}
                              className="hover:bg-red-50 text-red-600 h-6 w-6 sm:h-8 sm:w-8 p-0"
                              title="Excluir"
                            >
                              <Trash2 className="h-2 w-2 sm:h-3 sm:w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 sm:py-8 text-gray-500">
                          <Users className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mb-3 sm:mb-4" />
                          <p className="text-xs sm:text-sm">Nenhum cadastro encontrado</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulario" className="mt-4 sm:mt-6">
          <Card className="shadow-colorful border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent text-sm sm:text-base">
                ➕ Novo Cadastro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <Plus className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mb-3 sm:mb-4" />
                <p className="text-xs sm:text-sm">Formulário de cadastro será implementado aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Edição */}
      <CadastroEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
        onSave={handleSaveEdit}
        loading={updateCadastro.isPending}
      />
    </div>
  );
};

export default CadastrosUnified;
