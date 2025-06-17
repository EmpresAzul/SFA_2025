
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import CadastrarHora from '@/components/precificacao/CadastrarHora';
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
    // Pode abrir modal de edição ou navegar para formulário de edição
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTipo('todos');
    setSelectedStatus('todos');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sistema de Precificação
            </h1>
            <p className="text-gray-600">
              Gerencie seus produtos, serviços e horas cadastrados
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="lista" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Lista de Itens
              </TabsTrigger>
              <TabsTrigger value="produto" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Cadastrar Produto
              </TabsTrigger>
              <TabsTrigger value="servico" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Cadastrar Serviço
              </TabsTrigger>
              <TabsTrigger value="hora" className="flex items-center gap-2">
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
                <h2 className="text-xl font-semibold mb-4">Cadastrar Produto</h2>
                <p className="text-gray-600">Formulário de cadastro de produto em desenvolvimento...</p>
              </div>
            </TabsContent>

            <TabsContent value="servico">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Cadastrar Serviço</h2>
                <p className="text-gray-600">Formulário de cadastro de serviço em desenvolvimento...</p>
              </div>
            </TabsContent>

            <TabsContent value="hora">
              <CadastrarHora />
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
      </div>
    </DashboardLayout>
  );
};

export default PrecificacaoPage;
