
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
  const { data: cadastrosData, isLoading } = useQuery();
  const deleteCadastro = useDelete();

  const {
    formData,
    setFormData,
    editingCadastro,
    loading,
    handleSubmit,
    handleEdit,
    resetForm,
  } = useCadastroForm();

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
    await handleSubmit(e);
    console.log("Form submitted successfully, switching to lista tab");
    setActiveTab("lista");
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
    <div className="p-6 space-y-6">
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
        cadastros={filteredCadastros}
        icon={Icon}
        tipo={getDisplayName(tipoCapitalized, true)}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">
            Lista de {getDisplayName(tipoCapitalized, true)}
          </TabsTrigger>
          <TabsTrigger value="formulario">
            {editingCadastro
              ? `Editar ${getDisplayName(tipoCapitalized)}`
              : `Novo ${getDisplayName(tipoCapitalized)}`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
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
                      className="pl-10"
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
            formData={formData as any}
            setFormData={setFormData as any}
            editingCadastro={editingCadastro as any}
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
