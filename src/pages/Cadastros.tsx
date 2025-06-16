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
import { Plus, Search, Users, UserCheck, Building2, UserCog, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { useCadastros, type Cadastro } from '@/hooks/useCadastros';
import { useParams } from 'react-router-dom';

const Cadastros: React.FC = () => {
  const { tipo } = useParams<{ tipo: string }>();
  const tipoCapitalized = tipo?.charAt(0).toUpperCase() + tipo?.slice(1) as 'Cliente' | 'Fornecedor' | 'Funcionário';
  
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [filteredCadastros, setFilteredCadastros] = useState<Cadastro[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pessoaFilter, setPessoaFilter] = useState('todas');
  const [activeTab, setActiveTab] = useState('lista');
  const [editingCadastro, setEditingCadastro] = useState<Cadastro | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { useQuery, useCreate, useUpdate, useDelete } = useCadastros();
  const { data: cadastrosData, isLoading } = useQuery(tipoCapitalized);
  const createCadastro = useCreate();
  const updateCadastro = useUpdate();
  const deleteCadastro = useDelete();

  const [formData, setFormData] = useState({
    nome: '',
    pessoa: 'Física' as 'Física' | 'Jurídica',
    cpf_cnpj: '',
    telefone: '',
    email: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    observacoes: '',
    salario: '',
    data: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (cadastrosData) {
      setCadastros(cadastrosData);
    }
  }, [cadastrosData]);

  useEffect(() => {
    filterCadastros();
  }, [cadastros, searchTerm, pessoaFilter]);

  const filterCadastros = () => {
    let filtered = cadastros;

    if (searchTerm) {
      filtered = filtered.filter(cadastro =>
        cadastro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cadastro.cpf_cnpj && cadastro.cpf_cnpj.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cadastro.email && cadastro.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (pessoaFilter !== 'todas') {
      filtered = filtered.filter(cadastro => cadastro.pessoa === pessoaFilter);
    }

    setFilteredCadastros(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pessoa) {
      toast({
        title: "Erro",
        description: "Por favor, selecione o tipo de pessoa.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const cadastroData = {
        ...formData,
        tipo: tipoCapitalized!,
        salario: formData.salario ? parseFloat(formData.salario) : undefined,
        user_id: user!.id,
        status: 'ativo'
      };

      if (editingCadastro) {
        await updateCadastro.mutateAsync({ id: editingCadastro.id, ...cadastroData });
        setEditingCadastro(null);
      } else {
        await createCadastro.mutateAsync(cadastroData);
      }

      resetForm();
      setActiveTab('lista');
    } catch (error: any) {
      console.error('Erro ao salvar cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      pessoa: 'Física',
      cpf_cnpj: '',
      telefone: '',
      email: '',
      endereco: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      observacoes: '',
      salario: '',
      data: new Date().toISOString().split('T')[0]
    });
    setEditingCadastro(null);
  };

  const handleEdit = (cadastro: Cadastro) => {
    setFormData({
      nome: cadastro.nome,
      pessoa: cadastro.pessoa,
      cpf_cnpj: cadastro.cpf_cnpj || '',
      telefone: cadastro.telefone || '',
      email: cadastro.email || '',
      endereco: cadastro.endereco || '',
      numero: cadastro.numero || '',
      bairro: cadastro.bairro || '',
      cidade: cadastro.cidade || '',
      estado: cadastro.estado || '',
      cep: cadastro.cep || '',
      observacoes: cadastro.observacoes || '',
      salario: cadastro.salario?.toString() || '',
      data: cadastro.data
    });
    setEditingCadastro(cadastro);
    setActiveTab('formulario');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cadastro?')) {
      try {
        await deleteCadastro.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao excluir cadastro:', error);
      }
    }
  };

  const getIcon = () => {
    switch (tipoCapitalized) {
      case 'Cliente': return UserCheck;
      case 'Fornecedor': return Building2;
      case 'Funcionário': return UserCog;
      default: return Users;
    }
  };

  const Icon = getIcon();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <Icon className="w-8 h-8 text-fluxo-blue-600" />
            <h1 className="text-3xl font-bold text-fluxo-black-900">
              {tipoCapitalized === 'Funcionário' ? 'Funcionários' : `${tipoCapitalized}s`}
            </h1>
          </div>
          <p className="text-fluxo-black-600 mt-2">
            Gerencie o cadastro de {tipoCapitalized === 'Funcionário' ? 'funcionários' : `${tipoCapitalized?.toLowerCase()}s`}
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setActiveTab('formulario');
          }}
          className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo {tipoCapitalized}
        </Button>
      </div>

      {/* Painéis de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Icon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Total</p>
                <p className="text-2xl font-bold text-blue-900">{filteredCadastros.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Pessoa Física</p>
                <p className="text-2xl font-bold text-green-900">
                  {filteredCadastros.filter(c => c.pessoa === 'Física').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Pessoa Jurídica</p>
                <p className="text-2xl font-bold text-purple-900">
                  {filteredCadastros.filter(c => c.pessoa === 'Jurídica').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de {tipoCapitalized === 'Funcionário' ? 'Funcionários' : `${tipoCapitalized}s`}</TabsTrigger>
          <TabsTrigger value="formulario">
            {editingCadastro ? `Editar ${tipoCapitalized}` : `Novo ${tipoCapitalized}`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por nome, CPF/CNPJ ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Pessoa</Label>
                  <Select value={pessoaFilter} onValueChange={setPessoaFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="Física">Pessoa Física</SelectItem>
                      <SelectItem value="Jurídica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela */}
          <Card>
            <CardHeader>
              <CardTitle>{tipoCapitalized === 'Funcionário' ? 'Funcionários' : `${tipoCapitalized}s`} ({filteredCadastros.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                    {tipoCapitalized === 'Funcionário' && <TableHead>Salário</TableHead>}
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={tipoCapitalized === 'Funcionário' ? 8 : 7} className="text-center text-gray-500">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading && filteredCadastros.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={tipoCapitalized === 'Funcionário' ? 8 : 7} className="text-center text-gray-500">
                        Nenhum cadastro encontrado
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredCadastros.map((cadastro) => (
                    <TableRow key={cadastro.id}>
                      <TableCell className="font-medium">{cadastro.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {cadastro.pessoa}
                        </Badge>
                      </TableCell>
                      <TableCell>{cadastro.cpf_cnpj || '-'}</TableCell>
                      <TableCell>{cadastro.telefone || '-'}</TableCell>
                      <TableCell>{cadastro.email || '-'}</TableCell>
                      {tipoCapitalized === 'Funcionário' && (
                        <TableCell>
                          {cadastro.salario ? `R$ ${cadastro.salario.toFixed(2)}` : '-'}
                        </TableCell>
                      )}
                      <TableCell>{format(new Date(cadastro.data), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(cadastro)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(cadastro.id)}
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
                {editingCadastro ? `Editar ${tipoCapitalized}` : `Novo ${tipoCapitalized}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pessoa">Tipo de Pessoa *</Label>
                    <Select value={formData.pessoa} onValueChange={(value: 'Física' | 'Jurídica') => 
                      setFormData({ ...formData, pessoa: value })
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Física">Pessoa Física</SelectItem>
                        <SelectItem value="Jurídica">Pessoa Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf_cnpj">{formData.pessoa === 'Física' ? 'CPF' : 'CNPJ'}</Label>
                    <Input
                      id="cpf_cnpj"
                      value={formData.cpf_cnpj}
                      onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                      placeholder={formData.pessoa === 'Física' ? '000.000.000-00' : '00.000.000/0000-00'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  {tipoCapitalized === 'Funcionário' && (
                    <div className="space-y-2">
                      <Label htmlFor="salario">Salário (R$)</Label>
                      <Input
                        id="salario"
                        type="number"
                        step="0.01"
                        value={formData.salario}
                        onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="data">Data de Cadastro</Label>
                    <Input
                      id="data"
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="endereco">Logradouro</Label>
                      <Input
                        id="endereco"
                        value={formData.endereco}
                        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                        placeholder="Rua, Avenida, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numero">Número</Label>
                      <Input
                        id="numero"
                        value={formData.numero}
                        onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                        placeholder="123"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input
                        id="bairro"
                        value={formData.bairro}
                        onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                        placeholder="Nome do bairro"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                        placeholder="Nome da cidade"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        value={formData.estado}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                        placeholder="SP"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        value={formData.cep}
                        onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    placeholder="Observações adicionais..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
                  >
                    {loading ? "Salvando..." : editingCadastro ? "Atualizar" : "Cadastrar"}
                  </Button>
                  {editingCadastro && (
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

export default Cadastros;
