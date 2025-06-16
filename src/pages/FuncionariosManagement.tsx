
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useContactData } from '@/hooks/useContactData';
import { useContactForm } from '@/hooks/useContactForm';
import { useContactFilters } from '@/hooks/useContactFilters';
import { ContactStatsCards } from '@/components/cadastro/ContactStatsCards';
import { ContactAdvancedFilters } from '@/components/cadastro/ContactAdvancedFilters';
import { ContactEnhancedForm } from '@/components/cadastro/ContactEnhancedForm';
import { ContactList } from '@/components/cadastro/ContactList';

const FuncionariosManagement: React.FC = () => {
  const {
    contacts,
    isLoading,
    refetch,
    createCadastroMutation,
    updateCadastroMutation,
    deleteCadastroMutation,
    session,
    error
  } = useContactData();

  // Filtrar apenas funcionários (incluindo ambas as variações)
  const funcionariosContacts = contacts.filter(contact => 
    contact.tipo === 'Funcionário' || contact.tipo === 'Funcionario'
  );

  const {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredContacts
  } = useContactFilters(funcionariosContacts);

  const {
    formData,
    setFormData,
    showForm,
    setShowForm,
    editingContact,
    viewingContact,
    formatDocument,
    formatTelefone,
    handleSubmit,
    handleEdit,
    handleView,
    resetForm
  } = useContactForm(createCadastroMutation, updateCadastroMutation, refetch, session);

  // Verificar se o usuário está autenticado
  if (!session?.user?.id) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold gradient-fluxo-text mb-2">
            Cadastro de Funcionários
          </h1>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para acessar os cadastros.
          </p>
          <p className="text-red-600">
            Por favor, faça login para continuar.
          </p>
        </div>
      </div>
    );
  }

  const handleToggleActive = async (contact: any) => {
    try {
      const newStatus = contact.status === 'ativo' ? 'inativo' : 'ativo';
      
      await updateCadastroMutation.mutateAsync({
        ...contact,
        status: newStatus,
        id: contact.id
      });

      refetch();
    } catch (error: any) {
      console.error('FuncionariosManagement - Toggle status error:', error);
    }
  };

  const handleDelete = async (contact: any) => {
    if (!window.confirm(`Tem certeza que deseja excluir o cadastro do funcionário "${contact.nome}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await deleteCadastroMutation.mutateAsync(contact.id);
      refetch();
    } catch (error: any) {
      console.error('FuncionariosManagement - Delete error:', error);
    }
  };

  const handleNewEmployee = () => {
    setFormData(prev => ({ ...prev, tipo: 'Funcionário' }));
    setShowForm(true);
  };

  // Mostrar erros de carregamento se houver
  if (error) {
    console.error('FuncionariosManagement - Error loading contacts:', error);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-fluxo-text mb-2">
            Cadastro de Funcionários
          </h1>
          <p className="text-gray-600">
            Gerencie seus funcionários
          </p>
        </div>
        
        <Button
          onClick={handleNewEmployee}
          className="gradient-fluxo hover:gradient-fluxo-light text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="mr-2 h-5 w-5" />
          Novo Funcionário
        </Button>
      </div>

      {/* Quadrantes de Estatísticas Coloridos */}
      <ContactStatsCards contacts={funcionariosContacts} />

      {/* Filtros Avançados */}
      <ContactAdvancedFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter="Funcionário"
        setTypeFilter={setTypeFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        hideTypeFilter={true}
      />

      {/* Formulário Enhanced */}
      {showForm && (
        <ContactEnhancedForm
          formData={formData}
          setFormData={setFormData}
          editingContact={editingContact}
          formatDocument={formatDocument}
          formatTelefone={formatTelefone}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
          isLoading={createCadastroMutation.isPending || updateCadastroMutation.isPending}
          fixedType="Funcionário"
        />
      )}

      {/* Lista de Contatos */}
      <ContactList
        filteredContacts={filteredContacts}
        isLoading={isLoading}
        viewingContact={viewingContact}
        handleView={handleView}
        handleEdit={handleEdit}
        handleToggleActive={handleToggleActive}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default FuncionariosManagement;
