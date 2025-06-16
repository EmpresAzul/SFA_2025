
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
  const [loading, setLoading] = useState(false);

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

    if (!formData.nome.trim()) {
      errors.push('Nome é obrigatório');
    }

    if (!formData.documento.trim()) {
      errors.push('Documento é obrigatório');
    }

    if (!formData.data) {
      errors.push('Data é obrigatória');
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

    setLoading(true);

    try {
      console.log('ContactForm - Submitting data:', formData);
      
      // Normalizar o tipo para evitar problemas de consistência
      let tipoNormalizado = formData.tipo;
      if (formData.tipo === 'Funcionário') {
        tipoNormalizado = 'Funcionario';
      }
      
      // Preparar dados seguindo o mesmo padrão do EstoqueForm
      const dataToSubmit = {
        user_id: session.user.id,
        data: formData.data,
        tipo: tipoNormalizado,
        pessoa: formData.pessoa,
        nome: formData.nome.trim(),
        documento: formData.documento?.replace(/\D/g, '') || null,
        endereco: formData.endereco?.trim() || null,
        numero: formData.numero?.trim() || null,
        cidade: formData.cidade?.trim() || null,
        estado: formData.estado?.trim().toUpperCase() || null,
        email: formData.email?.trim() || null,
        telefone: formData.telefone?.replace(/\D/g, '') || null,
        observacoes: formData.observacoes?.trim() || null,
        anexo_url: formData.anexo_url?.trim() || null,
        salario: formData.salario && formData.salario > 0 ? formData.salario : null,
        status: formData.status || 'ativo',
        ...(editingContact ? { id: editingContact.id } : {})
      };
      
      console.log('ContactForm - Final data to submit:', dataToSubmit);
      
      await createCadastroMutation.mutateAsync(dataToSubmit);
      
      console.log('ContactForm - Mutation completed successfully');
      
      toast({
        title: "Sucesso!",
        description: editingContact ? "Cadastro atualizado com sucesso!" : "Cadastro criado com sucesso!",
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
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    console.log('ContactForm - Editing contact:', contact);
    
    // Mapear o tipo corretamente para exibição no formulário
    let tipoParaFormulario = contact.tipo;
    if (contact.tipo === 'Funcionario') {
      tipoParaFormulario = 'Funcionário';
    }
    
    setFormData({
      data: contact.data,
      tipo: tipoParaFormulario,
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
    setLoading(false);
  };

  return {
    formData,
    setFormData,
    showForm,
    setShowForm,
    editingContact,
    viewingContact,
    loading,
    formatDocument,
    formatTelefone,
    handleSubmit,
    handleEdit,
    handleView,
    resetForm
  };
};
