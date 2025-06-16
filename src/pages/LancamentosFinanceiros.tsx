
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
  } = useLancamentosForm(
    createLancamento,
    updateLancamento,
    editingLancamento,
    setLoading,
    setActiveTab,
    setEditingLancamento
  );

  // Load form data when editing
  useEffect(() => {
    if (editingLancamento) {
      loadFormData(editingLancamento);
    }
  }, [editingLancamento]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-fluxo-black-900">Lançamentos Financeiros</h1>
          <p className="text-fluxo-black-600 mt-2">Controle de receitas e despesas</p>
        </div>
      </div>

      <LancamentosSummaryCards lancamentos={filteredLancamentos} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de Lançamentos</TabsTrigger>
          <TabsTrigger value="formulario" onClick={handleNewLancamento}>
            {editingLancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <LancamentosFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            tipoFilter={tipoFilter}
            setTipoFilter={setTipoFilter}
            categoriaFilter={categoriaFilter}
            setCategoriaFilter={setCategoriaFilter}
          />

          <LancamentosTable
            lancamentos={filteredLancamentos}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="formulario">
          <LancamentosForm
            formData={formData}
            setFormData={setFormData}
            editingLancamento={editingLancamento}
            loading={loading}
            clientes={clientes}
            fornecedores={fornecedores}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LancamentosFinanceiros;
