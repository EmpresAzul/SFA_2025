import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSaldosBancarios } from "@/hooks/useSaldosBancarios";
import { useAuth } from "@/contexts/AuthContext";
import SaldosBancariosSummary from "@/components/saldos-bancarios/SaldosBancariosSummary";
import SaldosBancariosForm from "@/components/saldos-bancarios/SaldosBancariosForm";
import SaldosBancariosList from "@/components/saldos-bancarios/SaldosBancariosList";

interface SaldoForm {
  banco: string;
  saldo: number;
  data: string;
}

const SaldosBancarios: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("lista");

  const {
    loading,
    saldos,
    fetchSaldos,
    createSaldo,
    deleteSaldo,
  } = useSaldosBancarios();

  useEffect(() => {
    fetchSaldos();
  }, [fetchSaldos]);

  const handleFormSubmit = async (formData: SaldoForm) => {
    await createSaldo({
      banco: formData.banco,
      saldo: formData.saldo,
      data: formData.data,
      user_id: user?.id || "",
      id: "",
    });
    
    setActiveTab("lista");
  };

  const handleFormCancel = () => {
    setActiveTab("lista");
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

      <SaldosBancariosSummary totalSaldo={totalSaldo} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de Saldos</TabsTrigger>
          <TabsTrigger value="formulario">Novo Saldo</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <SaldosBancariosList 
            saldos={saldos}
            loading={loading}
            onDelete={deleteSaldo}
          />
        </TabsContent>

        <TabsContent value="formulario">
          <SaldosBancariosForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SaldosBancarios;