
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useContactData } from '@/hooks/useContactData';
import { useContactForm } from '@/hooks/useContactForm';
import { ContactStatsComponent } from '@/components/cadastro/ContactStats';
import { ContactFilters } from '@/components/cadastro/ContactFilters';
import { ContactForm } from '@/components/cadastro/ContactForm';
import { ContactList } from '@/components/cadastro/ContactList';

const RegisterManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const {
    contacts,
    isLoading,
    refetch,
    createCadastroMutation,
    deleteCadastroMutation,
    session
  } = useContactData();

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
  } = useContactForm(createCadastroMutation, refetch, session);

  const handleToggleActive = async (contact: any) => {
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

  const handleDelete = async (contact: any) => {
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

      <ContactStatsComponent contacts={contacts} />

      <ContactFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {showForm && (
        <ContactForm
          formData={formData}
          setFormData={setFormData}
          editingContact={editingContact}
          formatDocument={formatDocument}
          formatTelefone={formatTelefone}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
          isLoading={createCadastroMutation.isPending}
        />
      )}

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

export default RegisterManagement;
