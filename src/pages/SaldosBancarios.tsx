import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSaldosBancarios } from "@/hooks/useSaldosBancarios";
import { useAuth } from "@/contexts/AuthContext";
import { SaldoBancarioData } from "@/types/saldosBancarios";
import SaldosBancariosSummary from "@/components/saldos-bancarios/SaldosBancariosSummary";
import SaldosBancariosForm from "@/components/saldos-bancarios/SaldosBancariosForm";
import SaldosBancariosList from "@/components/saldos-bancarios/SaldosBancariosList";

interface SaldoForm {
  banco: string;
  agencia: string;
  conta_tipo: string;
  cidade: string;
  pix: string;
  saldo: number;
  data: string;
}

const SaldosBancarios: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("lista");
  const [selectedSaldo, setSelectedSaldo] = useState<SaldoBancarioData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    loading,
    saldos,
    fetchSaldos,
    createSaldo,
    updateSaldo,
    deleteSaldo,
  } = useSaldosBancarios();

  useEffect(() => {
    fetchSaldos();
  }, [fetchSaldos]);

  const handleFormSubmit = async (formData: SaldoForm) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');
      if (isEditMode && selectedSaldo?.id) {
        await updateSaldo(selectedSaldo.id, formData);
      } else {
        await createSaldo(formData);
      }
      setActiveTab("lista");
      setSelectedSaldo(null);
      setIsEditMode(false);
    } catch (error) {
      let errorMsg = '';
      if (error && typeof error === 'object') {
        if ('message' in error) {
          errorMsg = (error as any).message;
        } else if ('error_description' in error) {
          errorMsg = (error as any).error_description;
        } else if ('statusText' in error) {
          errorMsg = (error as any).statusText;
        } else {
          errorMsg = JSON.stringify(error);
        }
      } else {
        errorMsg = String(error);
      }
      console.error('Erro ao salvar saldo bancário:', error);
      alert('Erro ao salvar saldo bancário: ' + errorMsg);
    }
  };

  const handleEditSaldo = (saldo: SaldoBancarioData) => {
    setSelectedSaldo(saldo);
    setIsEditMode(true);
    setActiveTab("formulario");
  };

  const handleFormCancel = () => {
    setActiveTab("lista");
    setSelectedSaldo(null);
    setIsEditMode(false);
  };

  const totalSaldo = saldos.reduce((total, saldo) => total + (saldo.saldo || saldo.valor || 0), 0);

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
            onEdit={handleEditSaldo}
          />
        </TabsContent>

        <TabsContent value="formulario">
          <SaldosBancariosForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={loading}
            initialData={selectedSaldo}
            isEditMode={isEditMode}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SaldosBancarios;