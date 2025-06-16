import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { 
  Users, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Filter
} from 'lucide-react';

interface Contact {
  id: string;
  tipo: string;
  nome: string;
  documento: string;
  endereco: string;
  cidade: string;
  estado: string;
  email?: string;
  telefone?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const RegisterManagement: React.FC = () => {
  const { toast } = useToast();
  const { user, session } = useAuth();
  const { useCadastros, useCreateCadastro, useDeleteCadastro } = useSupabaseQuery();
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [formData, setFormData] = useState({
    tipo: 'Cliente',
    nome: '',
    documento: '',
    endereco: '',
    cidade: '',
    estado: '',
    email: '',
    telefone: '',
    status: 'ativo'
  });

  console.log('RegisterManagement - User:', user);
  console.log('RegisterManagement - Session:', session);

  const { data: contacts = [], isLoading, refetch } = useCadastros();
  const createCadastroMutation = useCreateCadastro();
  const deleteCadastroMutation = useDeleteCadastro();

  // Statistics
  const stats = {
    activeClients: contacts.filter(c => c.tipo === 'Cliente' && c.status === 'ativo').length,
    inactiveClients: contacts.filter(c => c.tipo === 'Cliente' && c.status === 'inativo').length,
    activeSuppliers: contacts.filter(c => c.tipo === 'Fornecedor' && c.status === 'ativo').length,
    inactiveSuppliers: contacts.filter(c => c.tipo === 'Fornecedor' && c.status === 'inativo').length,
    activeEmployees: contacts.filter(c => c.tipo === 'Funcionário' && c.status === 'ativo').length,
    inactiveEmployees: contacts.filter(c => c.tipo === 'Funcionário' && c.status === 'inativo').length,
  };

  const formatDocument = (value: string, type: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (type === 'Cliente' || type === 'Funcionário') {
      // CPF format: 000.000.000-00
      if (numbers.length <= 11) {
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
    } else {
      // CNPJ format: 00.000.000/0000-00
      if (numbers.length <= 14) {
        return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }
    }
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('RegisterManagement - Submitting data:', formData);
      
      const dataToSubmit = editingContact ? { ...formData, id: editingContact.id } : formData;
      await createCadastroMutation.mutateAsync(dataToSubmit);
      
      resetForm();
      refetch();
    } catch (error: any) {
      console.error('RegisterManagement - Submit error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      tipo: 'Cliente',
      nome: '',
      documento: '',
      endereco: '',
      cidade: '',
      estado: '',
      email: '',
      telefone: '',
      status: 'ativo'
    });
    setShowForm(false);
    setEditingContact(null);
    setViewingContact(null);
  };

  const handleEdit = (contact: Contact) => {
    setFormData({
      tipo: contact.tipo,
      nome: contact.nome,
      documento: contact.documento,
      endereco: contact.endereco,
      cidade: contact.cidade,
      estado: contact.estado,
      email: contact.email || '',
      telefone: contact.telefone || '',
      status: contact.status
    });
    setEditingContact(contact);
    setShowForm(true);
    setViewingContact(null);
  };

  const handleView = (contact: Contact) => {
    setViewingContact(viewingContact?.id === contact.id ? null : contact);
    setEditingContact(null);
    setShowForm(false);
  };

  const handleToggleActive = async (contact: Contact) => {
    try {
      const newStatus = contact.status === 'ativo' ? 'inativo' : 'ativo';
      
      await createCadastroMutation.mutateAsync({
        ...contact,
        status: newStatus,
        id: contact.id
      });

      refetch();
    } catch (error: any) {
      console.error('RegisterManagement - Toggle status error:', error);
    }
  };

  const handleDelete = async (contact: Contact) => {
    if (!window.confirm(`Tem certeza que deseja excluir o cadastro de "${contact.nome}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await deleteCadastroMutation.mutateAsync(contact.id);
      refetch();
    } catch (error: any) {
      console.error('RegisterManagement - Delete error:', error);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.documento.includes(searchTerm);
    const matchesType = typeFilter === 'all' || contact.tipo === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-fluxo-text mb-2">
            Cadastros
          </h1>
          <p className="text-gray-600">
            Gerencie clientes, fornecedores e funcionários
          </p>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          className="gradient-fluxo hover:gradient-fluxo-light text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Cadastro
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeClients}</div>
            <div className="text-sm text-gray-600">Clientes Ativos</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.inactiveClients}</div>
            <div className="text-sm text-gray-600">Clientes Inativos</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeSuppliers}</div>
            <div className="text-sm text-gray-600">Fornecedores Ativos</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.inactiveSuppliers}</div>
            <div className="text-sm text-gray-600">Fornecedores Inativos</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeEmployees}</div>
            <div className="text-sm text-gray-600">Funcionários Ativos</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.inactiveEmployees}</div>
            <div className="text-sm text-gray-600">Funcionários Inativos</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search" className="text-fluxo-blue-900 font-medium">
                Buscar
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nome ou documento..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-fluxo-blue-900 font-medium">Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Cliente">Clientes</SelectItem>
                  <SelectItem value="Fornecedor">Fornecedores</SelectItem>
                  <SelectItem value="Funcionário">Funcionários</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                }}
                variant="outline"
                className="w-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="gradient-fluxo-text">
              {editingContact ? 'Editar Cadastro' : 'Novo Cadastro'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-fluxo-blue-900 font-medium">Tipo</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cliente">Cliente</SelectItem>
                      <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                      <SelectItem value="Funcionário">Funcionário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="nome" className="text-fluxo-blue-900 font-medium">
                    Nome
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome completo"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="documento" className="text-fluxo-blue-900 font-medium">
                    {formData.tipo === 'Fornecedor' ? 'CNPJ' : 'CPF'}
                  </Label>
                  <Input
                    id="documento"
                    value={formData.documento}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      documento: formatDocument(e.target.value, formData.tipo || 'Cliente')
                    })}
                    placeholder={formData.tipo === 'Fornecedor' ? '00.000.000/0000-00' : '000.000.000-00'}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="endereco" className="text-fluxo-blue-900 font-medium">
                    Endereço
                  </Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    placeholder="Rua, Avenida..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="cidade" className="text-fluxo-blue-900 font-medium">
                    Cidade
                  </Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    placeholder="São Paulo"
                  />
                </div>
                
                <div>
                  <Label htmlFor="estado" className="text-fluxo-blue-900 font-medium">
                    UF
                  </Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-fluxo-blue-900 font-medium">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="telefone" className="text-fluxo-blue-900 font-medium">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={createCadastroMutation.isPending}
                  className="gradient-fluxo hover:gradient-fluxo-light text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {createCadastroMutation.isPending ? 'Salvando...' : editingContact ? 'Atualizar' : 'Cadastrar'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="px-6"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Contacts List */}
      <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="gradient-fluxo-text flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Lista de Cadastros ({filteredContacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Carregando cadastros...</p>
              </div>
            ) : filteredContacts.map((contact) => (
              <React.Fragment key={contact.id}>
                <div className={`border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${viewingContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge 
                          variant={contact.tipo === 'Cliente' ? 'default' : 
                                  contact.tipo === 'Fornecedor' ? 'secondary' : 'outline'}
                          className="gradient-fluxo text-white"
                        >
                          {contact.tipo}
                        </Badge>
                        <Badge 
                          variant={contact.status === 'ativo' ? 'default' : 'destructive'}
                          className={contact.status === 'ativo' ? 'bg-green-600' : ''}
                        >
                          {contact.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-lg text-gray-900">{contact.nome}</h3>
                      <p className="text-gray-600">{contact.documento}</p>
                      <p className="text-sm text-gray-500">
                        {contact.endereco && `${contact.endereco}, ${contact.cidade}/${contact.estado}`}
                      </p>
                      {contact.email && (
                        <p className="text-sm text-gray-500">E-mail: {contact.email}</p>
                      )}
                      {contact.telefone && (
                        <p className="text-sm text-gray-500">Telefone: {contact.telefone}</p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleView(contact)}
                        className="hover:bg-blue-50"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(contact)}
                        className="hover:bg-green-50"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleToggleActive(contact)}
                        className={contact.status === 'ativo' ? 'hover:bg-orange-50' : 'hover:bg-green-50'}
                        title={contact.status === 'ativo' ? 'Desativar' : 'Ativar'}
                      >
                        {contact.status === 'ativo' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(contact)}
                        className="hover:bg-red-50 text-red-600"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {viewingContact?.id === contact.id && (
                  <div className="ml-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Detalhes Completos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium">ID:</span> {contact.id}</div>
                      <div><span className="font-medium">Cadastrado em:</span> {new Date(contact.created_at).toLocaleDateString('pt-BR')}</div>
                      <div><span className="font-medium">Última atualização:</span> {new Date(contact.updated_at).toLocaleDateString('pt-BR')}</div>
                      <div><span className="font-medium">Status:</span> {contact.status}</div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
            
            {!isLoading && filteredContacts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>Nenhum cadastro encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterManagement;
