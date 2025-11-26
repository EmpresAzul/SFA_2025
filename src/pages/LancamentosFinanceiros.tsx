import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLancamentosPage } from "@/hooks/useLancamentosPage";
import LancamentosFilters from "@/components/lancamentos/LancamentosFilters";
import LancamentosTable from "@/components/lancamentos/LancamentosTable";
import LancamentosSummaryCards from "@/components/lancamentos/LancamentosSummaryCards";
import LancamentosForm from "@/components/lancamentos/LancamentosForm";
import LancamentosViewModal from "@/components/lancamentos/LancamentosViewModal";
import { List, Plus } from "lucide-react";
import type { Lancamento } from "@/hooks/useLancamentos";

// Função auxiliar para verificar se uma data está dentro do período selecionado
const isDateInPeriod = (dateString: string, period: string): boolean => {
  try {
    const itemDate = new Date(dateString + 'T00:00:00');
    if (isNaN(itemDate.getTime())) {
      console.warn('Data inválida encontrada:', dateString);
      return false;
    }

    const today = new Date();
    
    switch (period) {
      case "hoje":
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        return itemDate >= todayStart && itemDate <= todayEnd;
        
      case "semana":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59);
        return itemDate >= weekStart && itemDate <= weekEnd;
        
      case "mes":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        return itemDate >= monthStart && itemDate <= monthEnd;
        
      case "trimestre":
        const currentQuarter = Math.floor(today.getMonth() / 3);
        const quarterStart = new Date(today.getFullYear(), currentQuarter * 3, 1);
        const quarterEnd = new Date(today.getFullYear(), currentQuarter * 3 + 3, 0, 23, 59, 59);
        return itemDate >= quarterStart && itemDate <= quarterEnd;
        
      case "ano":
        const yearStart = new Date(today.getFullYear(), 0, 1);
        const yearEnd = new Date(today.getFullYear(), 11, 31, 23, 59, 59);
        return itemDate >= yearStart && itemDate <= yearEnd;
        
      default:
        return true;
    }
  } catch (error) {
    console.error('Erro ao processar filtro de período:', error, 'Data:', dateString);
    return false;
  }
};

const LancamentosFinanceiros: React.FC = () => {
  const [activeTab, setActiveTab] = useState("lista");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("todos");
  const [selectedCategoria, setSelectedCategoria] = useState("todos");
  const [selectedPeriodo, setSelectedPeriodo] = useState("todos");
  const [selectedItem, setSelectedItem] = useState<Lancamento | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Lancamento | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const {
    filteredLancamentos,
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

  // Filtrar dados baseado nos filtros
  const filteredData = useMemo(() => {
    const filtered = filteredLancamentos.filter((item) => {
      // Busca por descrição/observações
      const matchesSearch = searchTerm === "" || 
        item.observacoes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoria?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Busca por valor - aceita números com ou sem formatação
      const matchesValue = searchValue === "" || (() => {
        const searchNum = parseFloat(searchValue.replace(/[^\d,.-]/g, '').replace(',', '.'));
        if (isNaN(searchNum)) return false;
        return item.valor === searchNum || 
               item.valor.toString().includes(searchValue) ||
               item.valor.toFixed(2).includes(searchValue);
      })();
      
      // Filtro por tipo
      const matchesTipo = selectedTipo === "todos" || item.tipo === selectedTipo;
      
      // Filtro por categoria
      const matchesCategoria = selectedCategoria === "todos" || item.categoria === selectedCategoria;

      // Filtro por período
      const matchesPeriodo = selectedPeriodo === "todos" || isDateInPeriod(item.data, selectedPeriodo);

      return matchesSearch && matchesValue && matchesTipo && matchesCategoria && matchesPeriodo;
    });

    return filtered;
  }, [filteredLancamentos, searchTerm, searchValue, selectedTipo, selectedCategoria, selectedPeriodo]);

  // Dados paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  // Resetar página quando filtros mudarem
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
  }, [searchTerm, searchValue, selectedTipo, selectedCategoria, selectedPeriodo]);

  // Calcular estatísticas baseadas em TODOS os lançamentos, não apenas os filtrados
  const stats = useMemo(() => {
    console.log("📊 Calculando stats com filteredLancamentos:", filteredLancamentos.length);
    const total = filteredLancamentos.length;
    const receitas = filteredLancamentos
      .filter((item) => item.tipo === "receita")
      .reduce((sum, item) => sum + item.valor, 0);
    const despesas = filteredLancamentos
      .filter((item) => item.tipo === "despesa")
      .reduce((sum, item) => sum + item.valor, 0);
    const saldo = receitas - despesas;

    console.log("📈 Stats:", { total, receitas, despesas, saldo });
    return { total, receitas, despesas, saldo };
  }, [filteredLancamentos]);

  const handleView = (item: Lancamento) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleEditItem = (item: Lancamento) => {
    setEditingItem(item);
    setActiveTab("formulario");
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setActiveTab("lista");
  };

  const handleSaveSuccess = () => {
    setEditingItem(null);
    setActiveTab("lista");
  };

  const handleNewLancamentoClick = () => {
    setEditingItem(null);
    setActiveTab("formulario");
  };

  const handleDeleteLancamento = async (id: string) => {
    try {
      await deleteLancamento.mutateAsync(id);
    } catch (error) {
      console.error("Erro ao excluir lançamento:", error);
    }
  };

  return (
    <div className="fluxo-container fluxo-section bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div>
          <h1 className="fluxo-heading-lg">
            💰 Lançamentos Financeiros
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Gerencie receitas e despesas da sua empresa
          </p>
        </div>
        <button
          onClick={handleNewLancamentoClick}
          className="fluxo-btn-primary w-full lg:w-auto flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Lançamento
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl h-auto sm:h-14 gap-2 sm:gap-0 p-2">
          <TabsTrigger
            value="lista"
            className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl w-full"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Lista de Lançamentos</span>
            <span className="sm:hidden">Lista</span>
          </TabsTrigger>
          <TabsTrigger
            value="formulario"
            className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl w-full"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{editingItem ? "Editar Lançamento" : "Novo Lançamento"}</span>
            <span className="sm:hidden">{editingItem ? "Editar" : "Novo"}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          <LancamentosSummaryCards
            totalLancamentos={stats.total}
            totalReceitas={stats.receitas}
            totalDespesas={stats.despesas}
            saldoAtual={stats.saldo}
          />

          <LancamentosFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
            selectedTipo={selectedTipo}
            onTipoChange={setSelectedTipo}
            selectedCategoria={selectedCategoria}
            onCategoriaChange={setSelectedCategoria}
            selectedPeriodo={selectedPeriodo}
            onPeriodoChange={setSelectedPeriodo}
          />

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Carregando lançamentos...</span>
            </div>
          ) : (
            <LancamentosTable
              data={paginatedData}
              totalItems={filteredData.length}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              onView={handleView}
              onEdit={handleEditItem}
              onDelete={handleDeleteLancamento}
            />
          )}
        </TabsContent>

        <TabsContent value="formulario">
          <LancamentosForm
            editingLancamento={editingItem}
            onCancelEdit={handleCancelEdit}
            onSaveSuccess={handleSaveSuccess}
            clientes={clientes}
            fornecedores={fornecedores}
            createLancamento={createLancamentoMutation}
            updateLancamento={updateLancamentoMutation}
          />
        </TabsContent>
      </Tabs>

      <LancamentosViewModal
        lancamento={selectedItem}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
};

export default LancamentosFinanceiros;