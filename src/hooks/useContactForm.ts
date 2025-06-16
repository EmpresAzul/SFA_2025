
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Contact, ContactFormData } from '@/types/contact';
import { formatCPF, formatCNPJ, formatPhone } from '@/utils/formatters';

export const useContactForm = (
  createCadastroMutation: any,
  updateCadastroMutation: any,
  refetch: () => void,
  session: any
) => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  const [formData, setFormData] = useState<ContactFormData>({
    data: new Date().toISOString().split('T')[0],
    tipo: 'Cliente',
    pessoa: 'Física',
    nome: '',
    documento: '',
    endereco: '',
    numero: '',
    cidade: '',
    estado: '',
    email: '',
    telefone: '',
    observacoes: '',
    anexo_url: '',
    salario: 0,
    status: 'ativo'
  });

  const formatDocument = (value: string, pessoa: string) => {
    if (pessoa === 'Física') {
      return formatCPF(value);
    } else {
      return formatCNPJ(value);
    }
  };

  const formatTelefone = (value: string) => {
    return formatPhone(value);
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.nome?.trim()) {
      errors.push('Nome é obrigatório');
    }

    if (!formData.data) {
      errors.push('Data é obrigatória');
    }

    // Validar tipo
    const validTipos = ['Cliente', 'Fornecedor', 'Funcionário'];
    if (!validTipos.includes(formData.tipo)) {
      errors.push('Tipo deve ser Cliente, Fornecedor ou Funcionário');
    }

    // Validar pessoa
    const validPessoas = ['Física', 'Jurídica'];
    if (!validPessoas.includes(formData.pessoa)) {
      errors.push('Pessoa deve ser Física ou Jurídica');
    }

    if (errors.length > 0) {
      toast({
        title: "Erro de validação",
        description: errors.join(', '),
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('ContactForm - handleSubmit called');
    console.log('ContactForm - Session:', session);
    console.log('ContactForm - FormData:', formData);
    
    if (!session?.user?.id) {
      console.error('ContactForm - No authenticated user');
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      console.error('ContactForm - Form validation failed');
      return;
    }

    try {
      // Normalizar o tipo antes de enviar
      let tipoNormalizado = formData.tipo;
      if (formData.tipo === 'Funcionario') {
        tipoNormalizado = 'Funcionário';
      }

      const dataToSubmit = {
        user_id: session.user.id,
        data: formData.data,
        tipo: tipoNormalizado,
        pessoa: formData.pessoa,
        nome: formData.nome?.trim(),
        documento: formData.documento || null,
        endereco: formData.endereco || null,
        numero: formData.numero || null,
        cidade: formData.cidade || null,
        estado: formData.estado || null,
        email: formData.email || null,
        telefone: formData.telefone || null,
        observacoes: formData.observacoes || null,
        anexo_url: formData.anexo_url || null,
        salario: formData.salario || null,
        status: formData.status || 'ativo',
        ...(editingContact ? { id: editingContact.id } : {})
      };
      
      console.log('ContactForm - Data to submit:', dataToSubmit);
      
      if (editingContact) {
        console.log('ContactForm - Updating existing contact');
        await updateCadastroMutation.mutateAsync(dataToSubmit);
      } else {
        console.log('ContactForm - Creating new contact');
        await createCadastroMutation.mutateAsync(dataToSubmit);
      }
      
      console.log('ContactForm - Mutation completed successfully');
      resetForm();
      refetch();
    } catch (error: any) {
      console.error('ContactForm - Submit error:', error);
      toast({
        title: "Erro ao salvar",
        description: error?.message || "Erro ao salvar cadastro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (contact: Contact) => {
    console.log('ContactForm - Editing contact:', contact);
    
    setFormData({
      data: contact.data,
      tipo: contact.tipo,
      pessoa: contact.pessoa,
      nome: contact.nome,
      documento: contact.documento || '',
      endereco: contact.endereco || '',
      numero: contact.numero || '',
      cidade: contact.cidade || '',
      estado: contact.estado || '',
      email: contact.email || '',
      telefone: contact.telefone || '',
      observacoes: contact.observacoes || '',
      anexo_url: contact.anexo_url || '',
      salario: contact.salario || 0,
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

  const resetForm = () => {
    setFormData({
      data: new Date().toISOString().split('T')[0],
      tipo: 'Cliente',
      pessoa: 'Física',
      nome: '',
      documento: '',
      endereco: '',
      numero: '',
      cidade: '',
      estado: '',
      email: '',
      telefone: '',
      observacoes: '',
      anexo_url: '',
      salario: 0,
      status: 'ativo'
    });
    setShowForm(false);
    setEditingContact(null);
    setViewingContact(null);
  };

  return {
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
  };
};
