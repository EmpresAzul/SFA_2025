import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSaldosBancarios } from "@/hooks/useSaldosBancarios";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/currency";
import SaldoBancarioSummaryCard from "@/components/saldos-bancarios/SaldoBancarioSummaryCard";

interface SaldoForm {
  banco: string;
  saldo: number;
  data: string;
}

const SaldosBancarios: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("lista");
  const [formData, setFormData] = useState<SaldoForm>({
    banco: "",
    saldo: 0,
    data: new Date().toISOString().split("T")[0],
  });

  const {
    loading,
    saldos,
    fetchSaldos,
    createSaldo,
    updateSaldo,
    deleteSaldo,
  } = useSaldosBancarios();

  // Mock implementations for compatibility
  const useCreate = () => ({ mutateAsync: async () => {} });
  const useUpdate = () => ({ mutateAsync: async () => {} });
  const useDelete = () => ({ mutateAsync: async () => {} });

  useEffect(() => {
    fetchSaldos();
  }, [fetchSaldos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSaldo({
        banco: formData.banco,
        saldo: formData.saldo,
        data: formData.data,
        user_id: user?.id || "",
        id: "",
      });
      
      setFormData({
        banco: "",
        saldo: 0,
        data: new Date().toISOString().split("T")[0],
      });
      
      setActiveTab("lista");
      toast({
        title: "Sucesso",
        description: "Saldo bancário cadastrado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao cadastrar saldo:", error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar saldo bancário.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este saldo?")) {
      try {
        await deleteSaldo(id);
        toast({
          title: "Sucesso",
          description: "Saldo excluído com sucesso!",
        });
      } catch (error) {
        console.error("Erro ao excluir saldo:", error);
        toast({
          title: "Erro",
          description: "Erro ao excluir saldo.",
          variant: "destructive",
        });
      }
    }
  };

  const totalSaldo = saldos.reduce((total, saldo) => total + saldo.saldo, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saldos Bancários</h1>
          <p className="text-gray-600 mt-2">
            Gerencie os saldos das suas contas bancárias
          </p>
        </div>
      </div>

      <div>Total: {formatCurrency(totalSaldo)}</div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de Saldos</TabsTrigger>
          <TabsTrigger value="formulario">Novo Saldo</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saldos Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Carregando...</div>
              ) : saldos.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Nenhum saldo cadastrado
                </div>
              ) : (
                <div className="space-y-2">
                  {saldos.map((saldo) => (
                    <div
                      key={saldo.id}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{saldo.banco}</h3>
                        <p className="text-sm text-gray-500">
                          Data: {new Date(saldo.data).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`font-semibold ${
                            saldo.saldo >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatCurrency(saldo.saldo)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(saldo.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulario">
          <Card>
            <CardHeader>
              <CardTitle>Cadastrar Novo Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="banco">Banco</Label>
                  <Input
                    id="banco"
                    value={formData.banco}
                    onChange={(e) =>
                      setFormData({ ...formData, banco: e.target.value })
                    }
                    placeholder="Nome do banco"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="saldo">Saldo</Label>
                  <Input
                    id="saldo"
                    type="number"
                    step="0.01"
                    value={formData.saldo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        saldo: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0,00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) =>
                      setFormData({ ...formData, data: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("lista")}
                  >
                    Cancelar
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