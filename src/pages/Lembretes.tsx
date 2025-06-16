
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Bell } from 'lucide-react';
import { useLembretes, type Lembrete } from '@/hooks/useLembretes';
import LembretesSummaryCards from '@/components/lembretes/LembretesSummaryCards';
import LembretesForm from '@/components/lembretes/LembretesForm';
import LembretesTable from '@/components/lembretes/LembretesTable';
import LembretesFilters from '@/components/lembretes/LembretesFilters';

const Lembretes: React.FC = () => {
  const { lembretes, isLoading } = useLembretes();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLembrete, setEditingLembrete] = useState<Lembrete | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredLembretes = useMemo(() => {
    return lembretes.filter(lembrete => {
      // Filtro de busca
      const matchesSearch = !searchTerm || 
        lembrete.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lembrete.descricao && lembrete.descricao.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro de status
      const matchesStatus = statusFilter === 'all' || lembrete.status === statusFilter;

      // Filtro de data
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const hoje = new Date();
        const dataLembrete = new Date(lembrete.data_lembrete + 'T00:00:00');
        
        switch (dateFilter) {
          case 'hoje':
            matchesDate = dataLembrete.toDateString() === hoje.toDateString();
            break;
          case 'amanha':
            const amanha = new Date(hoje);
            amanha.setDate(hoje.getDate() + 1);
            matchesDate = dataLembrete.toDateString() === amanha.toDateString();
            break;
          case 'esta-semana':
            const inicioSemana = new Date(hoje);
            inicioSemana.setDate(hoje.getDate() - hoje.getDay());
            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            matchesDate = dataLembrete >= inicioSemana && dataLembrete <= fimSemana;
            break;
          case 'vencidos':
            matchesDate = dataLembrete < hoje && lembrete.status === 'ativo';
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [lembretes, searchTerm, statusFilter, dateFilter]);

  const handleEdit = (lembrete: Lembrete) => {
    setEditingLembrete(lembrete);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLembrete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bell className="h-8 w-8 mr-3 text-blue-600" />
            Lembretes
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus lembretes importantes
          </p>
        </div>
        
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Lembrete
        </Button>
      </div>

      {/* Summary Cards */}
      <LembretesSummaryCards lembretes={lembretes} />

      {/* Filters */}
      <LembretesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      {/* Table */}
      <LembretesTable 
        lembretes={filteredLembretes}
        onEdit={handleEdit}
      />

      {/* Form Modal */}
      <LembretesForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editingLembrete={editingLembrete}
      />
    </div>
  );
};

export default Lembretes;
