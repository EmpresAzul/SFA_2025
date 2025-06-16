
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
  const [showForm, setShowForm] = useState(true);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  const [formData, setFormData] = useState<ContactFormData>({
    data: new Date().toISOString().split('T')[0],
    tipo: 'Cliente',
    pessoa: 'Fisica',
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
    if (pessoa === 'Fisica') {
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

    // Validar pessoa - garantir valores sem acentos
    if (!['Fisica', 'Juridica'].includes(formData.pessoa)) {
      errors.push('Pessoa deve ser Fisica ou Juridica');
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
    console.log('ContactForm - FormData before normalization:', formData);
    
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
      // Garantir normalização completa dos dados
      const tipoNormalizado = formData.tipo === 'Funcionario' ? 'Funcionário' : formData.tipo;
      
      // Garantir que pessoa esteja sempre sem acentos
      let pessoaNormalizada = formData.pessoa;
      if (formData.pessoa === 'Física' || formData.pessoa === 'física') {
        pessoaNormalizada = 'Fisica';
      } else if (formData.pessoa === 'Jurídica' || formData.pessoa === 'jurídica') {
        pessoaNormalizada = 'Juridica';
      }

      const dataToSubmit = {
        user_id: session.user.id,
        data: formData.data,
        tipo: tipoNormalizado,
        pessoa: pessoaNormalizada, // Sempre sem acentos
        nome: formData.nome?.trim(),
        documento: formData.documento ? formData.documento.replace(/\D/g, '') : null,
        endereco: formData.endereco?.trim() || null,
        numero: formData.numero?.trim() || null,
        cidade: formData.cidade?.trim() || null,
        estado: formData.estado?.trim()?.toUpperCase() || null,
        email: formData.email?.trim() || null,
        telefone: formData.telefone ? formData.telefone.replace(/\D/g, '') : null,
        observacoes: formData.observacoes?.trim() || null,
        salario: formData.salario && formData.salario > 0 ? formData.salario : null,
        status: formData.status || 'ativo',
        ...(editingContact ? { id: editingContact.id } : {})
      };
      
      console.log('ContactForm - Data to submit after normalization:', dataToSubmit);
      
      if (editingContact) {
        console.log('ContactForm - Updating existing contact');
        await updateCadastroMutation.mutateAsync(dataToSubmit);
        toast({
          title: "🎉 Atualização Realizada com Sucesso!",
          description: `${formData.tipo} atualizado com êxito! Todas as alterações foram salvas no sistema com segurança.`,
        });
      } else {
        console.log('ContactForm - Creating new contact');
        await createCadastroMutation.mutateAsync(dataToSubmit);
        toast({
          title: "🎉 Cadastro Realizado com Sucesso!",
          description: `${formData.tipo} cadastrado com êxito! Todos os dados foram salvos com sucesso no sistema.`,
        });
      }
      
      console.log('ContactForm - Mutation completed successfully');
      resetForm();
      refetch();
    } catch (error: any) {
      console.error('ContactForm - Submit error:', error);
      
      let errorMessage = "Erro ao salvar cadastro. Verifique os dados e tente novamente.";
      
      if (error?.message?.includes('pessoa_check')) {
        errorMessage = "Erro no campo Pessoa. O valor deve ser 'Fisica' ou 'Juridica' (sem acentos).";
      } else if (error?.message?.includes('tipo_check')) {
        errorMessage = "Erro no campo Tipo. Verifique se está selecionado corretamente.";
      } else if (error?.message?.includes('duplicate')) {
        errorMessage = "Já existe um cadastro com essas informações.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "❌ Erro ao Salvar",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (contact: Contact) => {
    console.log('ContactForm - Editing contact:', contact);
    
    // Garantir normalização ao editar
    let pessoaNormalizada = contact.pessoa;
    if (contact.pessoa === 'Física' || contact.pessoa === 'física') {
      pessoaNormalizada = 'Fisica';
    } else if (contact.pessoa === 'Jurídica' || contact.pessoa === 'jurídica') {
      pessoaNormalizada = 'Juridica';
    }
    
    setFormData({
      data: contact.data,
      tipo: contact.tipo,
      pessoa: pessoaNormalizada,
      nome: contact.nome,
      documento: contact.documento || '',
      endereco: contact.endereco || '',
      numero: contact.numero || '',
      cidade: contact.cidade || '',
      estado: contact.estado || '',
      email: contact.email || '',
      telefone: contact.telefone || '',
      observacoes: contact.observacoes || '',
      anexo_url: '',
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
  };

  const resetForm = () => {
    setFormData({
      data: new Date().toISOString().split('T')[0],
      tipo: 'Cliente',
      pessoa: 'Fisica', // Sempre sem acentos
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
    setShowForm(true);
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
