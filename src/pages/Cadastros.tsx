
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Building2, UserCog } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCadastros, type Cadastro } from '@/hooks/useCadastros';
import { useCadastroForm } from '@/hooks/useCadastroForm';
import { useParams } from 'react-router-dom';
import { CadastroHeader } from '@/components/cadastro/CadastroHeader';
import { CadastroSummaryCards } from '@/components/cadastro/CadastroSummaryCards';
import { ContactFilters } from '@/components/cadastro/ContactFilters';
import { CadastroTable } from '@/components/cadastro/CadastroTable';
import { CadastroForm } from '@/components/cadastro/CadastroForm';

const Cadastros: React.FC = () => {
  const { tipo } = useParams<{ tipo: string }>();
  const tipoCapitalized = tipo?.charAt(0).toUpperCase() + tipo?.slice(1) as 'Cliente' | 'Fornecedor' | 'Funcionário';
  
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [filteredCadastros, setFilteredCadastros] = useState<Cadastro[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('lista');
  const { user } = useAuth();

  const { useQuery, useDelete } = useCadastros();
  const { data: cadastrosData, isLoading } = useQuery(tipoCapitalized);
  const deleteCadastro = useDelete();

  const {
    formData,
    setFormData,
    editingCadastro,
    loading,
    handleSubmit,
    handleEdit,
    resetForm,
  } = useCadastroForm(tipoCapitalized);

  useEffect(() => {
    if (cadastrosData) {
      setCadastros(cadastrosData);
    }
  }, [cadastrosData]);

  useEffect(() => {
    filterCadastros();
  }, [cadastros, searchTerm, typeFilter]);

  const filterCadastros = () => {
    let filtered = cadastros;

    if (searchTerm) {
      filtered = filtered.filter(cadastro =>
        cadastro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cadastro.cpf_cnpj && cadastro.cpf_cnpj.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cadastro.email && cadastro.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(cadastro => cadastro.pessoa === typeFilter);
    }

    setFilteredCadastros(filtered);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success) {
      setActiveTab('lista');
    }
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

  const handleEditClick = (cadastro: Cadastro) => {
    handleEdit(cadastro);
    setActiveTab('formulario');
  };

  const handleCancelEdit = () => {
    resetForm();
    setActiveTab('lista');
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
      default: return UserCheck;
    }
  };

  const Icon = getIcon();

  return (
    <div className="p-6 space-y-6">
      <CadastroHeader
        icon={Icon}
        title={getDisplayName(tipoCapitalized, true)}
        description={`Gerencie o cadastro de ${getDisplayName(tipoCapitalized, true).toLowerCase()}`}
        onNewClick={() => {
          resetForm();
          setActiveTab('formulario');
        }}
      />

      <CadastroSummaryCards
        cadastros={filteredCadastros}
        icon={Icon}
        tipo={getDisplayName(tipoCapitalized, true)}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de {getDisplayName(tipoCapitalized, true)}</TabsTrigger>
          <TabsTrigger value="formulario">
            {editingCadastro ? `Editar ${getDisplayName(tipoCapitalized)}` : `Novo ${getDisplayName(tipoCapitalized)}`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <ContactFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />

          <CadastroTable
            cadastros={filteredCadastros}
            isLoading={isLoading}
            tipo={getDisplayName(tipoCapitalized, true)}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="formulario">
          <CadastroForm
            tipo={tipoCapitalized}
            formData={formData}
            setFormData={setFormData}
            editingCadastro={editingCadastro}
            loading={loading}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cadastros;
