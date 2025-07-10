import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSaldosBancarios } from "@/hooks/useSaldosBancarios";
import { CurrencyInput } from "@/components/ui/currency-input";
import SaldoBancarioSummaryCard from "@/components/saldos-bancarios/SaldoBancarioSummaryCard";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { parseStringToNumber, formatNumberToInput } from "@/utils/currency";

interface SaldoBancario {
  id: string;
  banco: string;
  saldo: number;
  data: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const SaldosBancarios: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("lista");
  const [editingSaldo, setEditingSaldo] = useState<SaldoBancario | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    useQuery: useSaldosQuery,
    useCreate,
    useUpdate,
    useDelete,
  } = useSaldosBancarios();
  const { data: saldos, isLoading } = useSaldosQuery();
  const createSaldo = useCreate();
  const updateSaldo = useUpdate();
  const deleteSaldo = useDelete();

  const [formData, setFormData] = useState({
    banco: "",
    saldo: "",
  });

  console.log("SaldosBancarios: FormData atual:", formData);
  console.log("SaldosBancarios: Editando saldo:", editingSaldo);

  useEffect(() => {
    if (editingSaldo) {
      console.log(
        "SaldosBancarios: Carregando dados para edição:",
        editingSaldo,
      );
      // Usar formatNumberToInput para garantir formato correto
      const saldoFormatado = formatNumberToInput(editingSaldo.saldo);
      console.log(
        "SaldosBancarios: Saldo formatado para edição:",
        saldoFormatado,
      );

      setFormData({
        banco: editingSaldo.banco,
        saldo: saldoFormatado,
      });
      setActiveTab("formulario");
    }
  }, [editingSaldo]);

  const resetForm = () => {
    console.log("SaldosBancarios: Resetando formulário");
    setFormData({
      banco: "",
      saldo: "",
    });
    setEditingSaldo(null);
  };

  const handleEdit = (saldo: SaldoBancario) => {
    console.log("SaldosBancarios: Editando saldo:", saldo);
    setEditingSaldo(saldo);
    setActiveTab("formulario");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este saldo bancário?")) {
      try {
        await deleteSaldo.mutateAsync(id);
        toast({
          title: "Sucesso!",
          description: "Saldo bancário excluído com sucesso.",
        });
      } catch (error) {
        console.error("SaldosBancarios: Erro ao excluir:", error);
        toast({
          title: "Erro ao excluir",
          description: error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("SaldosBancarios: Submetendo formulário:", formData);

    if (!formData.banco.trim()) {
      toast({
        title: "Erro",
        description: "Nome do banco é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.saldo || formData.saldo.trim() === "") {
      toast({
        title: "Erro",
        description: "Saldo é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const saldoNumerico = parseStringToNumber(formData.saldo);
    console.log("SaldosBancarios: Saldo numérico convertido:", saldoNumerico);

    if (isNaN(saldoNumerico)) {
      toast({
        title: "Erro",
        description: "Valor do saldo inválido.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const saldoData = {
      banco: formData.banco.trim(),
      saldo: saldoNumerico,
      data: new Date().toISOString().split("T")[0],
      user_id: user?.id || "",
    };

    console.log("SaldosBancarios: Dados para salvar:", saldoData);

    try {
      if (editingSaldo) {
        console.log("SaldosBancarios: Atualizando saldo existente");
        await updateSaldo.mutateAsync({ id: editingSaldo.id, data: saldoData });
        toast({
          title: "Sucesso!",
          description: "Saldo bancário atualizado com sucesso.",
        });
      } else {
        console.log("SaldosBancarios: Criando novo saldo");
        await createSaldo.mutateAsync(saldoData);
        toast({
          title: "Sucesso!",
          description: "Saldo bancário criado com sucesso.",
        });
      }

      resetForm();
      setActiveTab("lista");
    } catch (error) {
      console.error("SaldosBancarios: Erro ao salvar:", error);
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (value: string) => {
    console.log("SaldosBancarios: Valor da moeda alterado:", value);
    setFormData((prev) => ({ ...prev, saldo: value }));
  };

  return (
    <div className="container-responsive responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🏦 Saldos Bancários
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">
            Controle de saldos em suas contas bancárias
          </p>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <SaldoBancarioSummaryCard />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg rounded-xl h-10 sm:h-12 md:h-14">
          <TabsTrigger
            value="lista"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-xs sm:text-sm md:text-base py-2 sm:py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            📋 Lista de Saldos
          </TabsTrigger>
          <TabsTrigger
            value="formulario"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-xs sm:text-sm md:text-base py-2 sm:py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            {editingSaldo ? "✏️ Editar Saldo" : "➕ Novo Saldo"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="mt-4 sm:mt-6 md:mt-8">
          <Card className="responsive-card">
            <CardHeader className="responsive-card-header">
              <CardTitle className="text-base sm:text-lg md:text-xl">
                Lista de Saldos Bancários
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 md:p-6">
              <div className="responsive-table-container">
                <Table className="responsive-table">
                  <TableCaption className="text-xs sm:text-sm">
                    Seus saldos bancários atuais.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px] sm:w-[200px]">
                        Banco
                      </TableHead>
                      <TableHead>Saldo</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Data
                      </TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {saldos &&
                      saldos.map((saldo) => (
                        <TableRow key={saldo.id}>
                          <TableCell className="font-medium">
                            {saldo.banco}
                          </TableCell>
                          <TableCell className="font-mono text-green-600">
                            R${" "}
                            {saldo.saldo.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {new Date(saldo.data).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(saldo)}
                                className="h-6 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                <span className="hidden sm:inline">Editar</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(saldo.id)}
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                <span className="hidden sm:inline">
                                  Excluir
                                </span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-xs sm:text-sm"
                      >
                        {isLoading
                          ? "Carregando..."
                          : "Fim dos saldos bancários"}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulario" className="mt-4 sm:mt-6 md:mt-8">
          <Card className="responsive-card">
            <CardHeader className="responsive-card-header">
              <CardTitle className="text-base sm:text-lg md:text-xl">
                {editingSaldo ? "Editar Saldo Bancário" : "Novo Saldo Bancário"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="responsive-form-grid">
                  <div className="space-y-2">
                    <Label htmlFor="banco" className="text-xs sm:text-sm">
                      Banco *
                    </Label>
                    <Input
                      id="banco"
                      value={formData.banco}
                      onChange={(e) =>
                        setFormData({ ...formData, banco: e.target.value })
                      }
                      placeholder="Nome do banco"
                      className="responsive-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saldo" className="text-xs sm:text-sm">
                      Saldo *
                    </Label>
                    <CurrencyInput
                      id="saldo"
                      value={formData.saldo}
                      onChange={handleCurrencyChange}
                      placeholder="R$ 0,00"
                      className="responsive-input"
                    />
                  </div>
                </div>
                <div className="responsive-form-actions">
                  <Button
                    variant="ghost"
                    onClick={resetForm}
                    className="responsive-button mobile-full"
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="responsive-button mobile-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {loading
                      ? "Salvando..."
                      : editingSaldo
                        ? "Atualizar Saldo"
                        : "Salvar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SaldosBancarios;
