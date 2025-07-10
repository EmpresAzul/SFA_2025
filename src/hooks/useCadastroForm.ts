import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCadastros, type Cadastro, type CadastroFormData } from '@/hooks/useCadastros';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  nome: string;
  tipo: string;
  pessoa: 'Física' | 'Jurídica';
  cpf_cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes: string;
  salario: string;
  status: string;
  data: string;
}

const initialFormData: FormData = {
  nome: '',
  tipo: '',
  pessoa: 'Física',
  cpf_cnpj: '',
  telefone: '',
  email: '',
  endereco: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  observacoes: '',
  salario: '',
  status: 'ativo',
  data: new Date().toISOString().split('T')[0],
};

export const useCadastroForm = (editingCadastro?: Cadastro) => {
  const { user } = useAuth();
  const { createCadastro, useUpdate } = useCadastros();
  const updateCadastro = useUpdate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePessoaChange = (value: 'Física' | 'Jurídica') => {
    setFormData(prev => ({
      ...prev,
      pessoa: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Usuário não autenticado',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const cadastroData: CadastroFormData = {
        nome: formData.nome,
        tipo: formData.tipo,
        pessoa: formData.pessoa,
        cpf_cnpj: formData.cpf_cnpj || undefined,
        telefone: formData.telefone || undefined,
        email: formData.email || undefined,
        endereco: formData.endereco || undefined,
        numero: formData.numero || undefined,
        bairro: formData.bairro || undefined,
        cidade: formData.cidade || undefined,
        estado: formData.estado || undefined,
        cep: formData.cep || undefined,
        observacoes: formData.observacoes || undefined,
        salario: formData.salario ? parseFloat(formData.salario) : undefined,
        status: formData.status,
        data: formData.data,
        user_id: user.id,
      };

      if (editingCadastro) {
        await updateCadastro.mutateAsync({
          id: editingCadastro.id,
          data: cadastroData
        });
        toast({
          title: 'Sucesso',
          description: 'Cadastro atualizado com sucesso!',
        });
      } else {
        await createCadastro(cadastroData);
        toast({
          title: 'Sucesso',
          description: 'Cadastro criado com sucesso!',
        });
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error('Erro ao salvar cadastro:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar cadastro. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load editing data
  useEffect(() => {
    if (editingCadastro) {
      setFormData({
        nome: editingCadastro.nome,
        tipo: editingCadastro.tipo,
        pessoa: editingCadastro.pessoa as 'Física' | 'Jurídica',
        cpf_cnpj: editingCadastro.cpf_cnpj || '',
        telefone: editingCadastro.telefone || '',
        email: editingCadastro.email || '',
        endereco: editingCadastro.endereco || '',
        numero: editingCadastro.numero || '',
        bairro: editingCadastro.bairro || '',
        cidade: editingCadastro.cidade || '',
        estado: editingCadastro.estado || '',
        cep: editingCadastro.cep || '',
        observacoes: editingCadastro.observacoes || '',
        salario: editingCadastro.salario?.toString() || '',
        status: editingCadastro.status,
        data: editingCadastro.data,
      });
    }
  }, [editingCadastro]);

  return {
    formData,
    setFormData,
    loading,
    handleSubmit,
  };
};
