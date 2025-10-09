import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEstoqueData } from "@/hooks/useEstoqueData";
import { useEstoqueForm } from "@/hooks/useEstoqueForm";
import { EstoqueSummaryCards } from "@/components/estoque/EstoqueSummaryCards";
import { EstoqueFilters } from "@/components/estoque/EstoqueFilters";
import { EstoqueTable } from "@/components/estoque/EstoqueTable";
import { EstoqueForm } from "@/components/estoque/EstoqueForm";
import { Estoque } from "@/types/estoque";

const EstoqueManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [filteredEstoques, setFilteredEstoques] = useState<Estoque[]>([]);
  const [editingItem, setEditingItem] = useState<Estoque | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const { estoques, loading, fetchEstoques, handleToggleStatus, handleDelete } =
    useEstoqueData();
  const {
    formData,
    setFormData,
    selectedEstoque,
    setSelectedEstoque,
    isEditMode,
    loading: formLoading,
    handleSubmit,
    handleEdit,
    resetForm,
  } = useEstoqueForm(fetchEstoques);

  // Filtrar dados baseado nos filtros
  const filteredData = useMemo(() => {
    return estoques.filter((estoque) => {
      const matchesSearch = estoque.nome_produto
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "todos" || estoque.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [estoques, searchTerm, statusFilter]);

  // Dados paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handlers de paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Resetar para primeira página
  };

  // Resetar página quando filtros mudarem
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Manter compatibilidade com o código existente
  useEffect(() => {
    setFilteredEstoques(filteredData);
  }, [filteredData]);

  return (
    <div className="fluxo-container fluxo-section bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen estoque-container estoque-responsive">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Gestão de Estoques
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Controle completo e inteligente do seu estoque
          </p>
        </div>
      </div>

      <EstoqueSummaryCards filteredEstoques={filteredData} />

      <Tabs defaultValue="lista" className="w-full">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <TabsList className="grid grid-cols-1 sm:grid-cols-2 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg rounded-xl h-auto sm:h-14 p-1">
            <TabsTrigger
              value="lista"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              📋 <span className="hidden sm:inline">Lista de Estoques</span><span className="sm:hidden">Lista</span>
            </TabsTrigger>
            <TabsTrigger
              value="formulario"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              ➕ <span className="hidden sm:inline">Cadastrar Item</span><span className="sm:hidden">Cadastrar</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="lista" className="space-y-6 mt-8">
          <EstoqueFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <EstoqueTable
            filteredEstoques={paginatedData}
            totalItems={filteredData.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            selectedEstoque={selectedEstoque}
            setSelectedEstoque={setSelectedEstoque}
            handleEdit={handleEdit}
            handleToggleStatus={(estoque: any) => handleToggleStatus(estoque.id)}
            handleDelete={(estoque: any) => handleDelete(estoque.id)}
          />
        </TabsContent>

        <TabsContent value="formulario" className="mt-8">
          <EstoqueForm
            formData={formData}
            setFormData={setFormData}
            loading={formLoading}
            isEditMode={isEditMode}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EstoqueManagement;
