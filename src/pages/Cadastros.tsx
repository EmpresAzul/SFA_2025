
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

interface FormData {
  // Campos comuns
  nome: string;
  pessoa: 'Física' | 'Jurídica';
  telefone: string;
  email: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes: string;
  
  // Campos específicos por tipo
  cpf_cnpj: string;
  razao_social?: string;
  tipo_fornecedor?: string;
  cargo?: string;
  data_admissao?: string;
}

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

  // Função para obter formulário inicial baseado no tipo
  const getInitialFormData = (): FormData => {
    const baseForm: FormData = {
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
      observacoes: ''
    };

    switch (tipoCapitalized) {
      case 'Cliente':
        return baseForm;
      case 'Fornecedor':
        return {
          ...baseForm,
          pessoa: 'Jurídica',
          razao_social: '',
          tipo_fornecedor: ''
        };
      case 'Funcionário':
        return {
          ...baseForm,
          cargo: '',
          data_admissao: ''
        };
      default:
        return baseForm;
    }
  };

  const [formData, setFormData] = useState<FormData>(getInitialFormData());

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
    
    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!tipoCapitalized) {
      toast({
        title: "Erro",
        description: "Tipo de cadastro não identificado.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const cadastroData = {
        nome: formData.razao_social?.trim() || formData.nome.trim(),
        tipo: tipoCapitalized,
        pessoa: formData.pessoa,
        cpf_cnpj: formData.cpf_cnpj.trim() || undefined,
        telefone: formData.telefone.trim() || undefined,
        email: formData.email.trim() || undefined,
        endereco: formData.endereco.trim() || undefined,
        numero: formData.numero.trim() || undefined,
        bairro: formData.bairro.trim() || undefined,
        cidade: formData.cidade.trim() || undefined,
        estado: formData.estado.trim() || undefined,
        cep: formData.cep.trim() || undefined,
        observacoes: formData.observacoes.trim() || undefined,
        data: new Date().toISOString().split('T')[0],
        user_id: user!.id,
        status: 'ativo'
      };

      console.log('Dados do cadastro a serem salvos:', cadastroData);

      if (editingCadastro) {
        await updateCadastro.mutateAsync({ 
          id: editingCadastro.id, 
          ...cadastroData 
        });
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
    setFormData(getInitialFormData());
    setEditingCadastro(null);
  };

  const handleEdit = (cadastro: Cadastro) => {
    const editData: FormData = {
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
      observacoes: cadastro.observacoes || ''
    };

    // Adicionar campos específicos baseado no tipo
    if (tipoCapitalized === 'Fornecedor') {
      editData.razao_social = cadastro.nome;
      editData.tipo_fornecedor = '';
    } else if (tipoCapitalized === 'Funcionário') {
      editData.cargo = '';
      editData.data_admissao = '';
    }

    setFormData(editData);
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

  const getDisplayName = (tipo: 'Cliente' | 'Fornecedor' | 'Funcionário', plural: boolean = false) => {
    switch (tipo) {
      case 'Cliente':
        return plural ? 'Clientes' : 'Cliente';
      case 'Fornecedor':
        return plural ? 'Fornecedores' : 'Fornecedor';
      case 'Funcionário':
        return plural ? 'Funcionários' : 'Funcionário';
      default:
        return plural ? 'Cadastros' : 'Cadastro';
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

  const renderFormFields = () => {
    switch (tipoCapitalized) {
      case 'Cliente':
        return (
          <>
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
              <Label htmlFor="cpf_cnpj">{formData.pessoa === 'Física' ? 'CPF *' : 'CNPJ *'}</Label>
              <Input
                id="cpf_cnpj"
                value={formData.cpf_cnpj}
                onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                placeholder={formData.pessoa === 'Física' ? '000.000.000-00' : '00.000.000/0000-00'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                required
              />
            </div>
          </>
        );

      case 'Fornecedor':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="razao_social">Razão Social *</Label>
              <Input
                id="razao_social"
                value={formData.razao_social || ''}
                onChange={(e) => setFormData({ ...formData, razao_social: e.target.value, nome: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf_cnpj">CNPJ *</Label>
              <Input
                id="cpf_cnpj"
                value={formData.cpf_cnpj}
                onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_fornecedor">Tipo de Fornecedor</Label>
              <Select value={formData.tipo_fornecedor || ''} onValueChange={(value) => 
                setFormData({ ...formData, tipo_fornecedor: value })
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Produtos">Produtos</SelectItem>
                  <SelectItem value="Serviços">Serviços</SelectItem>
                  <SelectItem value="Matéria Prima">Matéria Prima</SelectItem>
                  <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                required
              />
            </div>
          </>
        );

      case 'Funcionário':
        return (
          <>
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
              <Label htmlFor="cpf_cnpj">CPF *</Label>
              <Input
                id="cpf_cnpj"
                value={formData.cpf_cnpj}
                onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo *</Label>
              <Input
                id="cargo"
                value={formData.cargo || ''}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_admissao">Data de Admissão *</Label>
              <Input
                id="data_admissao"
                type="date"
                value={formData.data_admissao || ''}
                onChange={(e) => setFormData({ ...formData, data_admissao: e.target.value })}
                required
              />
            </div>
          </>
        );

      default:
        return null;
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
              {getDisplayName(tipoCapitalized, true)}
            </h1>
          </div>
          <p className="text-fluxo-black-600 mt-2">
            Gerencie o cadastro de {getDisplayName(tipoCapitalized, true).toLowerCase()}
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
          Novo {getDisplayName(tipoCapitalized)}
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
          <TabsTrigger value="lista">Lista de {getDisplayName(tipoCapitalized, true)}</TabsTrigger>
          <TabsTrigger value="formulario">
            {editingCadastro ? `Editar ${getDisplayName(tipoCapitalized)}` : `Novo ${getDisplayName(tipoCapitalized)}`}
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
                {tipoCapitalized !== 'Funcionário' && (
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
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabela */}
          <Card>
            <CardHeader>
              <CardTitle>{getDisplayName(tipoCapitalized, true)} ({filteredCadastros.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    {tipoCapitalized !== 'Funcionário' && <TableHead>Tipo</TableHead>}
                    <TableHead>{tipoCapitalized === 'Funcionário' ? 'CPF' : 'CPF/CNPJ'}</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Data</TableHead>
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
                  {!isLoading && filteredCadastros.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500">
                        Nenhum cadastro encontrado
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredCadastros.map((cadastro) => (
                    <TableRow key={cadastro.id}>
                      <TableCell className="font-medium">{cadastro.nome}</TableCell>
                      {tipoCapitalized !== 'Funcionário' && (
                        <TableCell>
                          <Badge variant="outline">
                            {cadastro.pessoa}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell>{cadastro.cpf_cnpj || '-'}</TableCell>
                      <TableCell>{cadastro.telefone || '-'}</TableCell>
                      <TableCell>{cadastro.email || '-'}</TableCell>
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
                {editingCadastro ? `Editar ${getDisplayName(tipoCapitalized)}` : `Novo ${getDisplayName(tipoCapitalized)}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campos específicos por tipo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderFormFields()}
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="endereco">Logradouro *</Label>
                      <Input
                        id="endereco"
                        value={formData.endereco}
                        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                        placeholder="Rua, Avenida, etc."
                        required
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
                      <Label htmlFor="bairro">Bairro *</Label>
                      <Input
                        id="bairro"
                        value={formData.bairro}
                        onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                        placeholder="Nome do bairro"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                        placeholder="Nome da cidade"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado *</Label>
                      <Input
                        id="estado"
                        value={formData.estado}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                        placeholder="SP"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP *</Label>
                      <Input
                        id="cep"
                        value={formData.cep}
                        onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                        placeholder="00000-000"
                        required
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
                    {loading ? "Salvando..." : editingCadastro ? "Atualizar" : "Salvar"}
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
