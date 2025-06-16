
import React from 'react';
import { useContactData } from '@/hooks/useContactData';
import { useContactForm } from '@/hooks/useContactForm';
import { ContactEnhancedForm } from '@/components/cadastro/ContactEnhancedForm';

const NovoCliente: React.FC = () => {
  const {
    createCadastroMutation,
    updateCadastroMutation,
    refetch,
    session
  } = useContactData();

  const {
    formData,
    setFormData,
    formatDocument,
    formatTelefone,
    handleSubmit,
    resetForm
  } = useContactForm(createCadastroMutation, updateCadastroMutation, refetch, session);

  // Sempre definir tipo como Cliente
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, tipo: 'Cliente' }));
  }, [setFormData]);

  // Verificar se o usuário está autenticado
  if (!session?.user?.id) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold gradient-fluxo-text mb-2">
            Novo Cliente
          </h1>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para cadastrar clientes.
          </p>
          <p className="text-red-600">
            Por favor, faça login para continuar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-fluxo-text mb-2">
          🎯 Novo Cliente
        </h1>
        <p className="text-gray-600">
          Preencha os dados para cadastrar um novo cliente no sistema
        </p>
      </div>

      {/* Formulário de Cadastro */}
      <ContactEnhancedForm
        formData={formData}
        setFormData={setFormData}
        editingContact={null}
        formatDocument={formatDocument}
        formatTelefone={formatTelefone}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
        isLoading={createCadastroMutation.isPending}
        fixedType="Cliente"
      />
    </div>
  );
};

export default NovoCliente;
