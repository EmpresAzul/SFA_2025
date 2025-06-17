
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CadastrarHora from '@/components/precificacao/CadastrarHora';
import CadastrarProduto from '@/components/precificacao/CadastrarProduto';
import CadastrarServico from '@/components/precificacao/CadastrarServico';
import PrecificacaoSummaryCards from '@/components/precificacao/PrecificacaoSummaryCards';
import PrecificacaoFilters from '@/components/precificacao/PrecificacaoFilters';
import PrecificacaoTable from '@/components/precificacao/PrecificacaoTable';
import PrecificacaoViewModal from '@/components/precificacao/PrecificacaoViewModal';
import { usePrecificacao } from '@/hooks/usePrecificacao';
import { List, Package, Wrench, Clock } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Precificacao = Database['public']['Tables']['precificacao']['Row'];

const PrecificacaoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('todos');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [selectedItem, setSelectedItem] = useState<Precificacao | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { useQuery } = usePrecificacao();
  const { data: precificacaoData = [], isLoading } = useQuery();

  // Filtrar dados baseado nos filtros
  const filteredData = useMemo(() => {
    return precificacaoData.filter((item) => {
      const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTipo = selectedTipo === 'todos' || item.tipo === selectedTipo;
      const matchesStatus = selectedStatus === 'todos' || item.status === selectedStatus;

      return matchesSearch && matchesTipo && matchesStatus;
    });
  }, [precificacaoData, searchTerm, selectedTipo, selectedStatus]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const total = precificacaoData.length;
    const produtos = precificacaoData.filter(item => item.tipo === 'Produto').length;
    const servicos = precificacaoData.filter(item => item.tipo === 'Serviço').length;
    const horas = precificacaoData.filter(item => item.tipo === 'Hora').length;

    return { total, produtos, servicos, horas };
  }, [precificacaoData]);

  const handleView = (item: Precificacao) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleEdit = (item: Precificacao) => {
    console.log('Editar item:', item);
    // TODO: Implementar lógica de edição
  };

  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📊 Sistema de Precificação
          </h1>
          <p className="text-gray-600 mt-2 text-sm">Gerencie seus produtos, serviços e horas cadastrados</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl h-12 sm:h-14">
          <TabsTrigger 
            value="lista" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <List className="h-4 w-4" />
            Lista de Itens
          </TabsTrigger>
          <TabsTrigger 
            value="produto" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Package className="h-4 w-4" />
            Cadastrar Produto
          </TabsTrigger>
          <TabsTrigger 
            value="servico" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Wrench className="h-4 w-4" />
            Cadastrar Serviço
          </TabsTrigger>
          <TabsTrigger 
            value="hora" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Clock className="h-4 w-4" />
            Cadastrar Hora
          </TabsTrigger>
        </TabsList>

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
            </div>
          ) : (
            <PrecificacaoTable
              data={filteredData}
              onView={handleView}
              onEdit={handleEdit}
            />
          )}
        </TabsContent>

        <TabsContent value="produto">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <CadastrarProduto />
          </div>
        </TabsContent>

        <TabsContent value="servico">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <CadastrarServico />
          </div>
        </TabsContent>

        <TabsContent value="hora">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <CadastrarHora />
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
