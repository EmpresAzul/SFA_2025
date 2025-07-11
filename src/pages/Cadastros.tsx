import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, Building2, UserCog } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCadastros, type Cadastro } from "@/hooks/useCadastros";
import { useCadastroForm } from "@/hooks/useCadastroForm";
import { useParams } from "react-router-dom";
import { CadastroHeader } from "@/components/cadastro/CadastroHeader";
import { CadastroSummaryCards } from "@/components/cadastro/CadastroSummaryCards";
import { CadastroTable } from "@/components/cadastro/CadastroTable";
import { CadastroForm } from "@/components/cadastro/CadastroForm";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Cadastros: React.FC = () => {
  const { tipo } = useParams<{ tipo: string }>();
  const tipoCapitalized = (tipo?.charAt(0).toUpperCase() + tipo?.slice(1)) as
    | "Cliente"
    | "Fornecedor"
    | "Funcionário";

  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [filteredCadastros, setFilteredCadastros] = useState<Cadastro[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("lista");
  const { user } = useAuth();

  const { useQuery, useDelete } = useCadastros();
  const queryResult = useQuery();
  const allCadastros = queryResult.data || [];
  const cadastrosData = allCadastros.filter((item: any) => item.tipo === tipoCapitalized);
  const isLoading = queryResult.isLoading;
  const deleteCadastro = useDelete();

  const {
    formData,
    setFormData,
    editingCadastro,
    loading,
    handleSubmit,
    handleEdit,
    resetForm,
  } = useCadastroForm(tipoCapitalized);

  // Função para converter Cadastro para CadastroData
  const convertCadastroToFormData = (cadastro: Cadastro) => {
    return {
      nome: cadastro.nome,
      pessoa: (cadastro.pessoa as "Física" | "Jurídica") || "Física",
      cpf_cnpj: cadastro.cpf_cnpj,
      telefone: cadastro.telefone,
      email: cadastro.email,
      endereco: cadastro.endereco,
      numero: cadastro.numero,
      bairro: cadastro.bairro,
      cidade: cadastro.cidade,
      estado: cadastro.estado,
      cep: cadastro.cep,
      observacoes: cadastro.observacoes,
    };
  };

  useEffect(() => {
    if (cadastrosData) {
      console.log("Cadastros data received:", cadastrosData);
      setCadastros(cadastrosData);
    }
  }, [cadastrosData]);

  useEffect(() => {
    filterCadastros();
  }, [cadastros, searchTerm]);

  const filterCadastros = () => {
    let filtered = cadastros;

    if (searchTerm) {
      filtered = filtered.filter(
        (cadastro) =>
          cadastro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (cadastro.cpf_cnpj &&
            cadastro.cpf_cnpj
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (cadastro.email &&
            cadastro.email.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    setFilteredCadastros(filtered);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    console.log("Form submit triggered");
    const success = await handleSubmit(e);
    if (success) {
      console.log("Form submitted successfully, switching to lista tab");
      setActiveTab("lista");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cadastro?")) {
      try {
        await deleteCadastro.mutateAsync(id);
      } catch (error) {
        console.error("Erro ao excluir cadastro:", error);
      }
    }
  };

  const handleEditClick = (cadastro: Cadastro) => {
    handleEdit(cadastro);
    setActiveTab("formulario");
  };

  const handleCancelEdit = () => {
    resetForm();
    setActiveTab("lista");
  };

  const getDisplayName = (
    tipo: "Cliente" | "Fornecedor" | "Funcionário",
    plural: boolean = false,
  ) => {
    switch (tipo) {
      case "Cliente":
        return plural ? "Clientes" : "Cliente";
      case "Fornecedor":
        return plural ? "Fornecedores" : "Fornecedor";
      case "Funcionário":
        return plural ? "Funcionários" : "Funcionário";
      default:
        return plural ? "Cadastros" : "Cadastro";
    }
  };

  const getIcon = () => {
    switch (tipoCapitalized) {
      case "Cliente":
        return UserCheck;
      case "Fornecedor":
        return Building2;
      case "Funcionário":
        return UserCog;
      default:
        return UserCheck;
    }
  };

  const Icon = getIcon();

  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <CadastroHeader
        icon={Icon}
        title={getDisplayName(tipoCapitalized, true)}
        description={`Gerencie o cadastro de ${getDisplayName(tipoCapitalized, true).toLowerCase()}`}
        onNewClick={() => {
          resetForm();
          setActiveTab("formulario");
        }}
      />

      <CadastroSummaryCards
        cards={[
          {
            title: `Total de ${getDisplayName(tipoCapitalized, true)}`,
            value: filteredCadastros.length,
            icon: <Icon className="h-5 w-5" />,
          },
          {
            title: `${getDisplayName(tipoCapitalized)} Ativos`,
            value: filteredCadastros.filter(c => c.status === 'ativo').length,
            icon: <Icon className="h-5 w-5" />,
          },
          {
            title: `${getDisplayName(tipoCapitalized)} Inativos`,
            value: filteredCadastros.filter(c => c.status === 'inativo').length,
            icon: <Icon className="h-5 w-5" />,
          },
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl h-12 sm:h-14">
          <TabsTrigger
            value="lista"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            Lista de {getDisplayName(tipoCapitalized, true)}
          </TabsTrigger>
          <TabsTrigger
            value="formulario"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            {editingCadastro
              ? `Editar ${getDisplayName(tipoCapitalized)}`
              : `Novo ${getDisplayName(tipoCapitalized)}`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Filtros de Busca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por nome, CPF/CNPJ ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <CadastroTable
            cadastros={filteredCadastros}
            isLoading={isLoading}
            tipo={getDisplayName(tipoCapitalized, true)}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="formulario">
          <CadastroForm
            tipo={tipoCapitalized}
            formData={formData}
            setFormData={(data) => setFormData(data)}
            editingCadastro={editingCadastro ? convertCadastroToFormData(editingCadastro) : null}
            loading={loading}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cadastros;