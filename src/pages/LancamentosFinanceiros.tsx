import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLancamentosPage } from "@/hooks/useLancamentosPage";
import LancamentosFilters from "@/components/lancamentos/LancamentosFilters";
import LancamentosTable from "@/components/lancamentos/LancamentosTable";
import LancamentosSummaryCards from "@/components/lancamentos/LancamentosSummaryCards";
import LancamentosForm from "@/components/lancamentos/LancamentosForm";

const LancamentosFinanceiros: React.FC = () => {
  const {
    filteredLancamentos,
    searchTerm,
    setSearchTerm,
    tipoFilter,
    setTipoFilter,
    categoriaFilter,
    setCategoriaFilter,
    activeTab,
    setActiveTab,
    editingLancamento,
    setEditingLancamento,
    isLoading,
    clientes,
    fornecedores,
    createLancamento: createLancamentoMutation,
    updateLancamento: updateLancamentoMutation,
    deleteLancamento,
    handleEdit,
    handleDelete,
    handleNewLancamento,
  } = useLancamentosPage();

  // Simplified mutation wrappers
  const createLancamento = { 
    mutateAsync: async (data: any) => {
      return await createLancamentoMutation.mutateAsync(data);
    },
    isPending: (createLancamentoMutation as any).isPending || false
  };
  
  const updateLancamento = { 
    mutateAsync: async (data: any) => {
      return await updateLancamentoMutation.mutateAsync(data);
    },
    isPending: (updateLancamentoMutation as any).isPending || false
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lançamentos Financeiros</h1>
          <p className="text-gray-600 mt-2">
            Gerencie receitas e despesas da sua empresa
          </p>
        </div>
      </div>

      <div>Resumo: {filteredLancamentos.length} lançamentos</div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de Lançamentos</TabsTrigger>
          <TabsTrigger value="formulario">
            {editingLancamento ? "Editar Lançamento" : "Novo Lançamento"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          <LancamentosFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            tipoFilter={tipoFilter}
            setTipoFilter={setTipoFilter}
            categoriaFilter={categoriaFilter}
            setCategoriaFilter={setCategoriaFilter}
          />

          <div>
            <h3>Lançamentos ({filteredLancamentos.length})</h3>
            {filteredLancamentos.map((lancamento: any) => (
              <div key={lancamento.id} className="border p-2 mb-2">
                <p>{lancamento.categoria} - {lancamento.valor}</p>
                <button onClick={() => handleEdit(lancamento)}>Editar</button>
                <button onClick={() => handleDelete(lancamento.id)}>Excluir</button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="formulario">
          <div>
            <h3>{editingLancamento ? "Editar" : "Novo"} Lançamento</h3>
            <p>Formulário simplificado - Em desenvolvimento</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LancamentosFinanceiros;