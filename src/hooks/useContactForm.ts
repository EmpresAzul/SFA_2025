
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Contact, ContactFormData } from '@/types/contact';

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
    tipo: 'Cliente',
    nome: '',
    documento: '',
    endereco: '',
    cidade: '',
    estado: '',
    email: '',
    telefone: '',
    status: 'ativo'
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('ContactForm - Submitting data:', formData);
      
      const dataToSubmit = editingContact ? { ...formData, id: editingContact.id } : formData;
      await createCadastroMutation.mutateAsync(dataToSubmit);
      
      resetForm();
      refetch();
    } catch (error: any) {
      console.error('ContactForm - Submit error:', error);
    }
  };

  const handleEdit = (contact: Contact) => {
    setFormData({
      tipo: contact.tipo,
      nome: contact.nome,
      documento: contact.documento,
      endereco: contact.endereco,
      cidade: contact.cidade,
      estado: contact.estado,
      email: contact.email || '',
      telefone: contact.telefone || '',
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
      tipo: 'Cliente',
      nome: '',
      documento: '',
      endereco: '',
      cidade: '',
      estado: '',
      email: '',
      telefone: '',
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
    handleSubmit,
    handleEdit,
    handleView,
    resetForm
  };
};
