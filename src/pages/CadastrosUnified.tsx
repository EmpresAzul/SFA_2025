import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCadastrosUnified } from "@/hooks/useCadastrosUnified";
import CadastroEditModal from "@/components/cadastro/CadastroEditModal";
import CadastrosStats from "@/components/cadastro/CadastrosStats";
import CadastrosFilters from "@/components/cadastro/CadastrosFilters";
import CadastrosTable from "@/components/cadastro/CadastrosTable";
import { UnifiedCadastroForm } from "@/components/cadastro/UnifiedCadastroForm";

const CadastrosUnified: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    tipoFilter,
    setTipoFilter,
    statusFilter,
    setStatusFilter,
    activeTab,
    setActiveTab,
    editingItem,
    setEditingItem,
    isEditModalOpen,
    setIsEditModalOpen,
    filteredItems,
    stats,
    loading,
    updateCadastro,
    handleEdit,
    handleSaveEdit,
    handleToggleStatus,
    handleDelete,
  } = useCadastrosUnified();

  if (loading) {
    return (
      <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-teal-50 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cadastros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-teal-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            👥 Cadastros Unificados
          </h1>
          <p className="text-gray-600 mt-2 text-xs sm:text-sm">
            Gestão completa de clientes, fornecedores e funcionários
          </p>
        </div>
      </div>

      <CadastrosStats stats={stats} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg rounded-xl h-10 sm:h-12">
          <TabsTrigger
            value="lista"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white font-semibold text-xs sm:text-sm py-2 sm:py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            📋 Lista de Cadastros
          </TabsTrigger>
          <TabsTrigger
            value="formulario"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-600 data-[state=active]:text-white font-semibold text-xs sm:text-sm py-2 sm:py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            ➕ Novo Cadastro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="responsive-margin mt-4 sm:mt-6">
          <CadastrosFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            tipoFilter={tipoFilter}
            setTipoFilter={setTipoFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <CadastrosTable
            filteredItems={filteredItems}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="formulario" className="mt-4 sm:mt-6">
          <UnifiedCadastroForm onSuccess={() => setActiveTab("lista")} />
        </TabsContent>
      </Tabs>

      <CadastroEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
        onSave={handleSaveEdit}
        loading={updateCadastro.isPending}
      />
    </div>
  );
};

export default CadastrosUnified;
