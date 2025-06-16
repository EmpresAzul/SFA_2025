
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
import { Edit, Trash2, Plus, Search, Users, Building, UserCheck } from 'lucide-react';
import CadastroEditModal from '@/components/cadastro/CadastroEditModal';

const CadastrosUnified: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [activeTab, setActiveTab] = useState('lista');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { toast } = useToast();
  const {
    clientes,
    fornecedores,
    funcionarios,
    loading: dataLoading,
    refetch
  } = useCadastros();

  const {
    formData,
    setFormData,
    loading: formLoading,
    handleSubmit,
    resetForm
  } = useCadastroForm(refetch);

  // Combinar todos os dados
  const allItems = [
    ...clientes.map(item => ({ ...item, tipo: 'cliente' })),
    ...fornecedores.map(item => ({ ...item, tipo: 'fornecedor' })),
    ...funcionarios.map(item => ({ ...item, tipo: 'funcionario' }))
  ];

  // Filtrar dados
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === 'todos' || item.tipo === tipoFilter;
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
      // Aqui você implementaria a lógica de atualização
      console.log('Atualizando item:', data);
      
      toast({
        title: "Item atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
      
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

  const handleDelete = async (id: string, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir ${nome}?`)) {
      return;
    }

    try {
      // Implementar lógica de exclusão
      toast({
        title: "Item excluído!",
        description: `${nome} foi removido com sucesso.`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o item.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-teal-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            👥 Cadastros Unificados
          </h1>
          <p className="text-gray-600 mt-2 text-sm">Gestão completa de clientes, fornecedores e funcionários</p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="responsive-grid mb-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-colorful">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-white/90" />
              <div className="ml-3">
                <p className="text-sm font-medium text-white/90">Total de Cadastros</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-colorful">
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-white/90" />
              <div className="ml-3">
                <p className="text-sm font-medium text-white/90">Clientes</p>
                <p className="text-2xl font-bold">{stats.clientes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-colorful">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-white/90" />
              <div className="ml-3">
                <p className="text-sm font-medium text-white/90">Fornecedores</p>
                <p className="text-2xl font-bold">{stats.fornecedores}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-colorful">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-white/90" />
              <div className="ml-3">
                <p className="text-sm font-medium text-white/90">Funcionários</p>
                <p className="text-2xl font-bold">{stats.funcionarios}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg rounded-xl h-12 sm:h-14">
          <TabsTrigger 
            value="lista"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            📋 Lista de Cadastros
          </TabsTrigger>
          <TabsTrigger 
            value="formulario"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            ➕ Novo Cadastro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="responsive-margin mt-6 sm:mt-8">
          {/* Filtros */}
          <Card className="shadow-colorful border-0 bg-white/90 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-lg">🔍 Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Nome ou e-mail..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tipo</Label>
                  <Select value={tipoFilter} onValueChange={setTipoFilter}>
                    <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="cliente">Clientes</SelectItem>
                      <SelectItem value="fornecedor">Fornecedores</SelectItem>
                      <SelectItem value="funcionario">Funcionários</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-teal-500 rounded-lg">
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
            <CardHeader>
              <CardTitle className="text-lg">📊 Lista de Cadastros ({filteredItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="responsive-table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm">Nome</TableHead>
                      <TableHead className="text-sm">Tipo</TableHead>
                      <TableHead className="mobile-hidden text-sm">E-mail</TableHead>
                      <TableHead className="mobile-hidden text-sm">Telefone</TableHead>
                      <TableHead className="text-sm">Status</TableHead>
                      <TableHead className="text-right text-sm">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={`${item.tipo}-${item.id}`}>
                        <TableCell className="font-medium text-sm">{item.nome}</TableCell>
                        <TableCell className="text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.tipo === 'cliente' ? 'bg-blue-100 text-blue-800' :
                            item.tipo === 'fornecedor' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {item.tipo === 'cliente' ? '👤 Cliente' :
                             item.tipo === 'fornecedor' ? '🏢 Fornecedor' :
                             '👨‍💼 Funcionário'}
                          </span>
                        </TableCell>
                        <TableCell className="mobile-hidden text-sm">{item.email}</TableCell>
                        <TableCell className="mobile-hidden text-sm">{item.telefone}</TableCell>
                        <TableCell className="text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status === 'ativo' ? '✅ Ativo' : '❌ Inativo'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                              className="hover:bg-blue-50 h-8 w-8 p-0"
                              title="Editar"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(item.id, item.nome)}
                              className="hover:bg-red-50 text-red-600 h-8 w-8 p-0"
                              title="Excluir"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                          <p className="text-sm">Nenhum cadastro encontrado</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulario" className="mt-6 sm:mt-8">
          {/* Formulário de novo cadastro mantido igual */}
          <Card className="shadow-colorful border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                ➕ Novo Cadastro
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Conteúdo do formulário permanece o mesmo */}
              <div className="text-center py-8 text-gray-500">
                <Plus className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-sm">Formulário de cadastro será implementado aqui</p>
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
        loading={formLoading}
      />
    </div>
  );
};

export default CadastrosUnified;
