
import React from 'react';
import { useContactData } from '@/hooks/useContactData';
import { useContactForm } from '@/hooks/useContactForm';
import { useContactFilters } from '@/hooks/useContactFilters';
import { ContactStatsCards } from '@/components/cadastro/ContactStatsCards';
import { ContactAdvancedFilters } from '@/components/cadastro/ContactAdvancedFilters';
import { ContactEnhancedForm } from '@/components/cadastro/ContactEnhancedForm';
import { ContactList } from '@/components/cadastro/ContactList';

const FornecedoresManagement: React.FC = () => {
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

  // Filtrar apenas fornecedores
  const fornecedoresContacts = contacts.filter(contact => contact.tipo === 'Fornecedor');

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
  } = useContactFilters(fornecedoresContacts);

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

  // Sempre definir tipo como Fornecedor
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, tipo: 'Fornecedor' }));
  }, [setFormData]);

  // Verificar se o usuário está autenticado
  if (!session?.user?.id) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold gradient-fluxo-text mb-2">
            Cadastro de Fornecedores
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
      console.error('FornecedoresManagement - Toggle status error:', error);
    }
  };

  const handleDelete = async (contact: any) => {
    if (!window.confirm(`Tem certeza que deseja excluir o cadastro do fornecedor "${contact.nome}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await deleteCadastroMutation.mutateAsync(contact.id);
      refetch();
    } catch (error: any) {
      console.error('FornecedoresManagement - Delete error:', error);
    }
  };

  // Mostrar erros de carregamento se houver
  if (error) {
    console.error('FornecedoresManagement - Error loading contacts:', error);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-fluxo-text mb-2">
          Cadastro de Fornecedores
        </h1>
        <p className="text-gray-600">
          Gerencie seus fornecedores com facilidade
        </p>
      </div>

      {/* Formulário Enhanced - Sempre visível */}
      <ContactEnhancedForm
        formData={formData}
        setFormData={setFormData}
        editingContact={editingContact}
        formatDocument={formatDocument}
        formatTelefone={formatTelefone}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
        isLoading={createCadastroMutation.isPending || updateCadastroMutation.isPending}
        fixedType="Fornecedor"
      />

      {/* Quadrantes de Estatísticas Coloridos */}
      <ContactStatsCards contacts={fornecedoresContacts} />

      {/* Filtros Avançados */}
      <ContactAdvancedFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter="Fornecedor"
        setTypeFilter={setTypeFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        hideTypeFilter={true}
      />

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

export default FornecedoresManagement;
