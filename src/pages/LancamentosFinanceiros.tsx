import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LancamentosSummaryCards from '@/components/lancamentos/LancamentosSummaryCards';
import LancamentosFilters from '@/components/lancamentos/LancamentosFilters';
import LancamentosTable from '@/components/lancamentos/LancamentosTable';
import LancamentosForm from '@/components/lancamentos/LancamentosForm';
import { useLancamentosPage } from '@/hooks/useLancamentosPage';
import { useLancamentosForm } from '@/hooks/useLancamentosForm';

const LancamentosFinanceiros: React.FC = () => {
  const {
    filteredLancamentos,
    loading,
    setLoading,
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
    createLancamento,
    updateLancamento,
    handleEdit,
    handleDelete,
    handleNewLancamento,
  } = useLancamentosPage();

  const {
    formData,
    setFormData,
    handleSubmit,
    handleCancel,
    loadFormData,
  } = useLancamentosForm({
    createLancamento,
    updateLancamento,
    editingLancamento,
    setLoading,
    setActiveTab,
    setEditingLancamento
  });

  // Load form data when editing
  useEffect(() => {
    if (editingLancamento) {
      console.log('Componente: Carregando dados para edição:', editingLancamento);
      loadFormData(editingLancamento);
    }
  }, [editingLancamento, loadFormData]);

  // Handle tab change - só chama handleNewLancamento se não estiver editando
  const handleTabChange = (value: string) => {
    console.log('Mudança de aba para:', value, 'editingLancamento:', !!editingLancamento);
    
    if (value === 'formulario' && !editingLancamento) {
      console.log('Indo para formulário - modo novo lançamento');
      handleNewLancamento();
    } else if (value === 'lista' && editingLancamento) {
      console.log('Saindo do modo de edição');
      setEditingLancamento(null);
    }
    
    setActiveTab(value);
  };

  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            💰 Lançamentos Financeiros
          </h1>
          <p className="text-gray-600 mt-2 text-sm">Controle completo de receitas e despesas</p>
        </div>
      </div>

      <LancamentosSummaryCards lancamentos={filteredLancamentos} />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg rounded-xl h-12 sm:h-14">
          <TabsTrigger 
            value="lista"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            📋 Lista de Lançamentos
          </TabsTrigger>
          <TabsTrigger 
            value="formulario"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            ➕ {editingLancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="responsive-margin mt-6 sm:mt-8">
          <LancamentosFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            tipoFilter={tipoFilter}
            setTipoFilter={setTipoFilter}
            categoriaFilter={categoriaFilter}
            setCategoriaFilter={setCategoriaFilter}
          />

          <LancamentosTable
            data={filteredLancamentos}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="formulario" className="mt-6 sm:mt-8">
          <LancamentosForm
            formData={formData}
            setFormData={setFormData}
            editingLancamento={editingLancamento}
            loading={loading}
            clientes={clientes || []}
            fornecedores={fornecedores || []}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LancamentosFinanceiros;
