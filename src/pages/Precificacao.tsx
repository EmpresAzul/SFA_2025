import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CadastrarHora from "@/components/precificacao/CadastrarHora";
import CadastrarProduto from "@/components/precificacao/CadastrarProduto";
import CadastrarServico from "@/components/precificacao/CadastrarServico";
import PrecificacaoSummaryCards from "@/components/precificacao/PrecificacaoSummaryCards";
import PrecificacaoFilters from "@/components/precificacao/PrecificacaoFilters";
import PrecificacaoTable from "@/components/precificacao/PrecificacaoTable";
import PrecificacaoViewModal from "@/components/precificacao/PrecificacaoViewModal";
import { usePrecificacao } from "@/hooks/usePrecificacao";
import { List, Package, Wrench, Clock } from "lucide-react";


interface Precificacao {
  id: string;
  [key: string]: any;
}

const PrecificacaoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("lista");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("todos");
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [selectedItem, setSelectedItem] = useState<Precificacao | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Precificacao | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const { useQuery } = usePrecificacao();
  const { data: precificacaoData = [], isLoading } = useQuery();

  // Filtrar dados baseado nos filtros
  const filteredData = useMemo(() => {
    return precificacaoData.filter((item) => {
      const matchesSearch = item.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTipo =
        selectedTipo === "todos" || item.tipo === selectedTipo;
      const matchesStatus =
        selectedStatus === "todos" || item.status === selectedStatus;

      return matchesSearch && matchesTipo && matchesStatus;
    });
  }, [precificacaoData, searchTerm, selectedTipo, selectedStatus]);

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
  }, [searchTerm, selectedTipo, selectedStatus]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    console.log("📊 Calculando estatísticas de precificação:", precificacaoData.length, "itens");
    
    const total = precificacaoData.length;
    const produtos = precificacaoData.filter(
      (item) => item.tipo === "Produto",
    ).length;
    const servicos = precificacaoData.filter(
      (item) => item.tipo === "Serviço",
    ).length;
    const horas = precificacaoData.filter(
      (item) => item.tipo === "Hora",
    ).length;

    console.log("📈 Estatísticas:", { total, produtos, servicos, horas });
    return { total, produtos, servicos, horas };
  }, [precificacaoData]);

  const handleView = (item: Precificacao) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleEdit = (item: Precificacao) => {
    setEditingItem(item);

    // Redirecionar para a aba correta baseado no tipo
    switch (item.tipo) {
      case "Produto":
        setActiveTab("produto");
        break;
      case "Serviço":
        setActiveTab("servico");
        break;
      case "Hora":
        setActiveTab("hora");
        break;
      default:
        setActiveTab("produto");
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setActiveTab("lista");
  };

  const handleSaveSuccess = () => {
    setEditingItem(null);
    setActiveTab("lista");
  };

  return (
    <div className="fluxo-container fluxo-section bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen precificacao-container precificacao-responsive">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            📊 Sistema de Precificação
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie seus produtos, serviços e horas cadastrados
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <TabsList className="grid grid-cols-1 sm:grid-cols-4 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg rounded-xl h-auto sm:h-14 p-1">
            <TabsTrigger
              value="lista"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Lista de Itens</span>
              <span className="sm:hidden">Lista</span>
            </TabsTrigger>
            <TabsTrigger
              value="produto"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Cadastrar Produto</span>
              <span className="sm:hidden">Produto</span>
            </TabsTrigger>
            <TabsTrigger
              value="servico"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Cadastrar Serviço</span>
              <span className="sm:hidden">Serviço</span>
            </TabsTrigger>
            <TabsTrigger
              value="hora"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Cadastrar Hora</span>
              <span className="sm:hidden">Hora</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="lista" className="space-y-6">
          <PrecificacaoSummaryCards
            totalItens={stats.total}
            totalProdutos={stats.produtos}
            totalServicos={stats.servicos}
            totalHoras={stats.horas}
          />

          <PrecificacaoFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedTipo={selectedTipo}
            onTipoChange={setSelectedTipo}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Carregando itens...</span>
            </div>
          ) : (
            <>
              {console.log("🔍 Renderizando tabela de precificação com:", {
                paginatedData: paginatedData.length,
                filteredData: filteredData.length,
                precificacaoData: precificacaoData.length,
                isLoading
              })}
              <PrecificacaoTable
                data={paginatedData}
                totalItems={filteredData.length}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                onView={handleView}
                onEdit={handleEdit}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="produto">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <CadastrarProduto
              editingItem={editingItem?.tipo === "Produto" ? editingItem : null}
              onCancelEdit={handleCancelEdit}
              onSaveSuccess={handleSaveSuccess}
            />
          </div>
        </TabsContent>

        <TabsContent value="servico">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <CadastrarServico
              editingItem={editingItem?.tipo === "Serviço" ? editingItem : null}
              onCancelEdit={handleCancelEdit}
              onSaveSuccess={handleSaveSuccess}
            />
          </div>
        </TabsContent>

        <TabsContent value="hora">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <CadastrarHora
              editingItem={editingItem?.tipo === "Hora" ? editingItem : null}
              onCancelEdit={handleCancelEdit}
              onSaveSuccess={handleSaveSuccess}
            />
          </div>
        </TabsContent>
      </Tabs>

      <PrecificacaoViewModal
        item={selectedItem}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
};

export default PrecificacaoPage;
