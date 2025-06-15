
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Calendar,
  Filter
} from 'lucide-react';

interface Contact {
  id: string;
  type: 'Cliente' | 'Fornecedor' | 'Funcionário';
  date: string;
  name: string;
  document: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  salary?: string;
  observations: string;
  active: boolean;
}

const RegisterManagement: React.FC = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      type: 'Cliente',
      date: '2024-01-15',
      name: 'Maria Silva Santos',
      document: '123.456.789-00',
      address: 'Rua das Flores, 123',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      observations: 'Cliente VIP, desconto especial',
      active: true
    },
    {
      id: '2',
      type: 'Fornecedor',
      date: '2024-02-10',
      name: 'Distribuidora ABC Ltda',
      document: '12.345.678/0001-90',
      address: 'Av. Industrial, 456',
      number: '456',
      neighborhood: 'Industrial',
      city: 'Guarulhos',
      state: 'SP',
      observations: 'Prazo pagamento 30 dias',
      active: true
    },
    {
      id: '3',
      type: 'Funcionário',
      date: '2024-03-05',
      name: 'João Carlos Oliveira',
      document: '987.654.321-00',
      address: 'Rua do Trabalhador, 789',
      number: '789',
      neighborhood: 'Vila Nova',
      city: 'São Paulo',
      state: 'SP',
      salary: 'R$ 3.500,00',
      observations: 'Vendedor sênior',
      active: true
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const [formData, setFormData] = useState<Partial<Contact>>({
    type: 'Cliente',
    date: new Date().toISOString().split('T')[0],
    name: '',
    document: '',
    address: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    salary: '',
    observations: '',
    active: true
  });

  // Statistics
  const stats = {
    activeClients: contacts.filter(c => c.type === 'Cliente' && c.active).length,
    inactiveClients: contacts.filter(c => c.type === 'Cliente' && !c.active).length,
    activeSuppliers: contacts.filter(c => c.type === 'Fornecedor' && c.active).length,
    inactiveSuppliers: contacts.filter(c => c.type === 'Fornecedor' && !c.active).length,
    activeEmployees: contacts.filter(c => c.type === 'Funcionário' && c.active).length,
    inactiveEmployees: contacts.filter(c => c.type === 'Funcionário' && !c.active).length,
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

  const formatSalary = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseInt(numbers) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingContact) {
      setContacts(prev => prev.map(contact => 
        contact.id === editingContact.id 
          ? { ...contact, ...formData } as Contact
          : contact
      ));
      toast({
        title: "Cadastro atualizado!",
        description: "Os dados foram atualizados com sucesso.",
      });
    } else {
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData
      } as Contact;
      
      setContacts(prev => [...prev, newContact]);
      toast({
        title: "Cadastro realizado!",
        description: "Novo cadastro adicionado com sucesso.",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'Cliente',
      date: new Date().toISOString().split('T')[0],
      name: '',
      document: '',
      address: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      salary: '',
      observations: '',
      active: true
    });
    setShowForm(false);
    setEditingContact(null);
  };

  const handleEdit = (contact: Contact) => {
    setFormData(contact);
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleToggleActive = (id: string) => {
    setContacts(prev => prev.map(contact =>
      contact.id === id ? { ...contact, active: !contact.active } : contact
    ));
    toast({
      title: "Status atualizado!",
      description: "O status do cadastro foi alterado.",
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cadastro? Esta ação não pode ser desfeita.')) {
      setContacts(prev => prev.filter(contact => contact.id !== id));
      toast({
        title: "Cadastro excluído!",
        description: "O cadastro foi removido permanentemente.",
      });
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.document.includes(searchTerm);
    const matchesType = typeFilter === 'all' || contact.type === typeFilter;
    const matchesDate = !dateFilter || contact.date === dateFilter;
    
    return matchesSearch && matchesType && matchesDate;
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            
            <div>
              <Label htmlFor="dateFilter" className="text-fluxo-blue-900 font-medium">
                Data de Cadastro
              </Label>
              <Input
                id="dateFilter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setDateFilter('');
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
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value as Contact['type'] })}
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
                  <Label htmlFor="date" className="text-fluxo-blue-900 font-medium">
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="name" className="text-fluxo-blue-900 font-medium">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome completo"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="document" className="text-fluxo-blue-900 font-medium">
                    {formData.type === 'Fornecedor' ? 'CNPJ' : 'CPF'}
                  </Label>
                  <Input
                    id="document"
                    value={formData.document}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      document: formatDocument(e.target.value, formData.type || 'Cliente')
                    })}
                    placeholder={formData.type === 'Fornecedor' ? '00.000.000/0000-00' : '000.000.000-00'}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address" className="text-fluxo-blue-900 font-medium">
                    Endereço
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Rua, Avenida..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="number" className="text-fluxo-blue-900 font-medium">
                    Número
                  </Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="123"
                  />
                </div>
                
                <div>
                  <Label htmlFor="neighborhood" className="text-fluxo-blue-900 font-medium">
                    Bairro
                  </Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="Centro"
                  />
                </div>
                
                <div>
                  <Label htmlFor="city" className="text-fluxo-blue-900 font-medium">
                    Cidade
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="São Paulo"
                  />
                </div>
                
                <div>
                  <Label htmlFor="state" className="text-fluxo-blue-900 font-medium">
                    UF
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
                
                {formData.type === 'Funcionário' && (
                  <div>
                    <Label htmlFor="salary" className="text-fluxo-blue-900 font-medium">
                      Salário
                    </Label>
                    <Input
                      id="salary"
                      value={formData.salary}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        salary: formatSalary(e.target.value)
                      })}
                      placeholder="R$ 0,00"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="observations" className="text-fluxo-blue-900 font-medium">
                  Observações
                </Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="gradient-fluxo hover:gradient-fluxo-light text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {editingContact ? 'Atualizar' : 'Cadastrar'}
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
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-gray-50"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge 
                        variant={contact.type === 'Cliente' ? 'default' : 
                                contact.type === 'Fornecedor' ? 'secondary' : 'outline'}
                        className="gradient-fluxo text-white"
                      >
                        {contact.type}
                      </Badge>
                      <Badge 
                        variant={contact.active ? 'default' : 'destructive'}
                        className={contact.active ? 'bg-green-600' : ''}
                      >
                        {contact.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg text-gray-900">{contact.name}</h3>
                    <p className="text-gray-600">{contact.document}</p>
                    <p className="text-sm text-gray-500">
                      {contact.address && `${contact.address}, ${contact.number} - ${contact.neighborhood}, ${contact.city}/${contact.state}`}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Calendar className="mr-1 h-3 w-3" />
                      Cadastrado em: {new Date(contact.date).toLocaleDateString('pt-BR')}
                    </p>
                    {contact.salary && (
                      <p className="text-sm font-medium text-green-600">
                        Salário: {contact.salary}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="hover:bg-blue-50">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(contact)}
                      className="hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleToggleActive(contact.id)}
                      className={contact.active ? 'hover:bg-orange-50' : 'hover:bg-green-50'}
                    >
                      {contact.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(contact.id)}
                      className="hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {contact.observations && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-gray-700">
                    <strong>Observações:</strong> {contact.observations}
                  </div>
                )}
              </div>
            ))}
            
            {filteredContacts.length === 0 && (
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
