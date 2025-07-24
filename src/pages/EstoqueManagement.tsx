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
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestão de Estoques
          </h1>
          <p className="text-gray-600 mt-2">
            Controle completo e inteligente do seu estoque
          </p>
        </div>
      </div>

      <EstoqueSummaryCards filteredEstoques={filteredData} />

      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg rounded-xl h-14">
          <TabsTrigger
            value="lista"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-lg py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            📋 Lista de Estoques
          </TabsTrigger>
          <TabsTrigger
            value="formulario"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-lg py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            ➕ {isEditMode ? "Editar Item" : "Cadastrar Item"}
          </TabsTrigger>
        </TabsList>

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
