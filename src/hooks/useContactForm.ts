import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Contact, ContactFormData } from '@/types/contact';
import { formatCPF, formatCNPJ, formatPhone } from '@/utils/formatters';

export const useContactForm = (
  createCadastroMutation: any,
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
    if (!formData.nome.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome é obrigatório",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.documento.trim()) {
      toast({
        title: "Erro de validação", 
        description: "Documento é obrigatório",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('ContactForm - Starting submit process');
    console.log('ContactForm - Session check:', session);
    console.log('ContactForm - Form data:', formData);
    
    if (!session?.user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      console.log('ContactForm - Submitting data:', formData);
      
      const dataToSubmit = editingContact 
        ? { ...formData, id: editingContact.id } 
        : { ...formData };
      
      console.log('ContactForm - Data to submit:', dataToSubmit);
      
      await createCadastroMutation.mutateAsync(dataToSubmit);
      
      console.log('ContactForm - Mutation completed successfully');
      
      toast({
        title: "Sucesso!",
        description: editingContact 
          ? "Cadastro atualizado com sucesso!" 
          : "Cadastro realizado com sucesso!",
      });
      
      resetForm();
      refetch();
    } catch (error: any) {
      console.error('ContactForm - Submit error:', error);
      toast({
        title: "Erro",
        description: error?.message || "Erro ao salvar cadastro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (contact: Contact) => {
    setFormData({
      data: contact.data,
      tipo: contact.tipo,
      pessoa: contact.pessoa,
      nome: contact.nome,
      documento: contact.documento,
      endereco: contact.endereco,
      numero: contact.numero || '',
      cidade: contact.cidade,
      estado: contact.estado,
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
