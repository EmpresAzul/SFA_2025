import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCadastros, type Cadastro } from "@/hooks/useCadastros";
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  nome: string;
  pessoa: "Física" | "Jurídica";
  telefone?: string;
  email?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  cpf_cnpj?: string;
  razao_social?: string;
  tipo_fornecedor?: string;
  cargo?: string;
  data_admissao?: string;
}

export const useCadastroForm = (
  tipo: "Cliente" | "Fornecedor" | "Funcionário",
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { useCreate, useUpdate } = useCadastros();
  const createCadastro = useCreate();
  const updateCadastro = useUpdate();

  const [loading, setLoading] = useState(false);
  const [editingCadastro, setEditingCadastro] = useState<Cadastro | null>(null);

  const getInitialFormData = (): FormData => {
    const baseForm: FormData = {
      nome: "",
      pessoa: "Física",
      cpf_cnpj: "",
      telefone: "",
      email: "",
      endereco: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      observacoes: "",
    };

    switch (tipo) {
      case "Cliente":
        return baseForm;
      case "Fornecedor":
        return {
          ...baseForm,
          pessoa: "Jurídica",
          razao_social: "",
          tipo_fornecedor: "",
        };
      case "Funcionário":
        return {
          ...baseForm,
          cargo: "",
          data_admissao: "",
        };
      default:
        return baseForm;
    }
  };

  const [formData, setFormData] = useState<FormData>(getInitialFormData());

  const resetForm = () => {
    setFormData(getInitialFormData());
    setEditingCadastro(null);
  };

  const validateForm = (): boolean => {
    console.log("Validating form data:", formData);

    if (!formData.nome.trim() && !formData.razao_social?.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.cpf_cnpj?.trim()) {
      toast({
        title: "Erro de validação",
        description: `${formData.pessoa === "Física" ? "CPF" : "CNPJ"} é obrigatório.`,
        variant: "destructive",
      });
      return false;
    }

    if (tipo === "Funcionário") {
      if (!formData.cargo?.trim()) {
        toast({
          title: "Erro de validação",
          description: "Cargo é obrigatório.",
          variant: "destructive",
        });
        return false;
      }
      if (!formData.data_admissao?.trim()) {
        toast({
          title: "Erro de validação",
          description: "Data de admissão é obrigatória.",
          variant: "destructive",
        });
        return false;
      }
    }

    if (tipo === "Fornecedor" && !formData.razao_social?.trim()) {
      toast({
        title: "Erro de validação",
        description: "Razão Social é obrigatória.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    if (!validateForm()) {
      console.log("Form validation failed");
      return false;
    }

    setLoading(true);

    try {
      const cadastroData = {
        nome: formData.razao_social?.trim() || formData.nome.trim(),
        tipo,
        pessoa: formData.pessoa,
        cpf_cnpj: formData.cpf_cnpj?.trim() || undefined,
        telefone: formData.telefone?.trim() || undefined,
        email: formData.email?.trim() || undefined,
        endereco: formData.endereco?.trim() || undefined,
        numero: formData.numero?.trim() || undefined,
        bairro: formData.bairro?.trim() || undefined,
        cidade: formData.cidade?.trim() || undefined,
        estado: formData.estado?.trim() || undefined,
        cep: formData.cep?.trim() || undefined,
        observacoes: formData.observacoes?.trim() || undefined,
        user_id: user!.id,
        status: "ativo",
        data: new Date().toISOString().split("T")[0],
      };

      console.log("Sending cadastro data:", cadastroData);

      if (editingCadastro) {
        console.log("Updating cadastro:", editingCadastro.id);
        await updateCadastro.mutateAsync({
          id: editingCadastro.id,
          ...cadastroData,
        });
        toast({
          title: "Sucesso",
          description: `${tipo} atualizado com sucesso!`,
        });
        setEditingCadastro(null);
      } else {
        console.log("Creating new cadastro");
        await createCadastro.mutateAsync(cadastroData);
        toast({
          title: "Sucesso",
          description: `${tipo} cadastrado com sucesso!`,
        });
      }

      resetForm();
      return true;
    } catch (error) {
      console.error("Erro ao salvar cadastro:", error);
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cadastro: Cadastro) => {
    console.log("Editando cadastro:", cadastro);
    console.log("Tipo do cadastro:", tipo);

    // Mapeamento base comum para todos os tipos
    const editData: FormData = {
      nome: cadastro.nome,
      pessoa: cadastro.pessoa as "Física" | "Jurídica",
      cpf_cnpj: cadastro.cpf_cnpj || "",
      telefone: cadastro.telefone || "",
      email: cadastro.email || "",
      endereco: cadastro.endereco || "",
      numero: cadastro.numero || "",
      bairro: cadastro.bairro || "",
      cidade: cadastro.cidade || "",
      estado: cadastro.estado || "",
      cep: cadastro.cep || "",
      observacoes: cadastro.observacoes || "",
    };

    // Mapeamento específico por tipo
    if (tipo === "Fornecedor") {
      // Para fornecedor, usar o nome como razão social e limpar o nome
      editData.razao_social = cadastro.nome;
      editData.nome = "";
      editData.tipo_fornecedor = ""; // Campo opcional, deixar vazio se não houver dados específicos
    } else if (tipo === "Funcionário") {
      // Para funcionário, tentar extrair cargo das observações ou deixar vazio
      // Se houver um padrão específico nas observações, adaptar aqui
      editData.cargo = ""; // Campo obrigatório, mas pode estar vazio na edição
      editData.data_admissao = cadastro.data || ""; // Usar a data do cadastro como data de admissão
    }
    // Para Cliente, usar os dados como estão (já mapeados acima)

    console.log("Form data mapeado para edição:", editData);
    setFormData(editData);
    setEditingCadastro(cadastro);
  };

  return {
    formData,
    setFormData,
    editingCadastro,
    loading,
    handleSubmit,
    handleEdit,
    resetForm,
  };
};