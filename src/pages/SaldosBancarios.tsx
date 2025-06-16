
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Banknote, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/formatters';

interface SaldoBancario {
  id: string;
  data: string;
  banco: string;
  saldo: number;
  created_at: string;
  updated_at: string;
}

const bancos = [
  'Banco do Brasil',
  'Bradesco',
  'Caixa Econômica Federal',
  'Itaú',
  'Santander',
  'Nubank',
  'Inter',
  'C6 Bank',
  'PicPay',
  'Sicoob',
  'Sicredi',
  'Outros'
];

const SaldosBancarios: React.FC = () => {
  const [filteredSaldos, setFilteredSaldos] = useState<SaldoBancario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bancoFilter, setBancoFilter] = useState('todos');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const { user, session } = useAuth();
  const { toast } = useToast();

  const { useSaldosBancarios, useCreateSaldoBancario, useDeleteSaldoBancario } = useSupabaseQuery();
  const { data: saldos = [], isLoading, refetch } = useSaldosBancarios();
  const createSaldoBancarioMutation = useCreateSaldoBancario();
  const deleteSaldoBancarioMutation = useDeleteSaldoBancario();

  const [formData, setFormData] = useState({
    data: '',
    banco: '',
    saldo: 0
  });

  console.log('SaldosBancarios - User:', user);
  console.log('SaldosBancarios - Session:', session);

  useEffect(() => {
    filterSaldos();
  }, [saldos, searchTerm, bancoFilter]);

  const filterSaldos = () => {
    let filtered = saldos;

    if (searchTerm) {
      filtered = filtered.filter(saldo =>
        saldo.banco.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (bancoFilter !== 'todos') {
      filtered = filtered.filter(saldo => saldo.banco === bancoFilter);
    }

    setFilteredSaldos(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('SaldosBancarios - Submitting data:', formData);
      
      const dataToSubmit = editingId ? { ...formData, id: editingId } : formData;
      await createSaldoBancarioMutation.mutateAsync(dataToSubmit);

      resetForm();
      refetch();
    } catch (error: any) {
      console.error('SaldosBancarios - Submit error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      data: '',
      banco: '',
      saldo: 0
    });
    setEditingId(null);
    setViewingId(null);
  };

  const handleEdit = (saldo: SaldoBancario) => {
    setFormData({
      data: saldo.data,
      banco: saldo.banco,
      saldo: saldo.saldo
    });
    setEditingId(saldo.id);
    setViewingId(null);
  };

  const handleView = (saldo: SaldoBancario) => {
    setViewingId(viewingId === saldo.id ? null : saldo.id);
    setEditingId(null);
  };

  const handleDelete = async (id: string, banco: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir este saldo bancário do ${banco}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    if (!session?.user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteSaldoBancarioMutation.mutateAsync(id);
      refetch();
    } catch (error: any) {
      console.error('SaldosBancarios - Delete error:', error);
    }
  };

  const getSaldoTotalPorBanco = () => {
    const saldosPorBanco: { [key: string]: number } = {};
    
    filteredSaldos.forEach(saldo => {
      if (!saldosPorBanco[saldo.banco]) {
        saldosPorBanco[saldo.banco] = 0;
      }
      saldosPorBanco[saldo.banco] += saldo.saldo;
    });

    return saldosPorBanco;
  };

  const getSaldoTotal = () => {
    return filteredSaldos.reduce((sum, saldo) => sum + saldo.saldo, 0);
  };

  const saldosPorBanco = getSaldoTotalPorBanco();

  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-green-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            🏦 Saldos Bancários
          </h1>
          <p className="text-gray-600 mt-2 text-sm">Controle inteligente dos saldos em contas bancárias</p>
        </div>
      </div>

      {/* Painéis de Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <Card className="lg:col-span-2 shadow-colorful border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Banknote className="w-5 h-5 mr-2 text-green-600" />
              💳 Saldos por Banco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(saldosPorBanco).map(([banco, saldo]) => (
                <div key={banco} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl shadow-sm">
                  <span className="font-medium text-gray-700 text-sm">{banco}</span>
                  <span className="font-bold text-blue-600 text-sm">{formatCurrency(saldo)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-blue-600 text-white border-0 shadow-colorful">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-white/90" />
              <div className="ml-4">
                <p className="text-sm font-medium text-white/90">💰 Saldo Total</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(getSaldoTotal())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário */}
      <Card className="shadow-colorful border-0 bg-white/90 backdrop-blur-sm mb-6">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {editingId ? '✏️ Editar Saldo' : '➕ Cadastrar Novo Saldo'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data" className="text-sm font-medium">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  required
                  className="h-10 border-2 border-gray-200 focus:border-green-500 rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="banco" className="text-sm font-medium">Banco</Label>
                <Select value={formData.banco} onValueChange={(value) => setFormData({ ...formData, banco: value })}>
                  <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-green-500 rounded-lg">
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {bancos.map((banco) => (
                      <SelectItem key={banco} value={banco}>{banco}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="saldo" className="text-sm font-medium">Saldo</Label>
                <CurrencyInput
                  id="saldo"
                  value={formData.saldo}
                  onChange={(value) => setFormData({ ...formData, saldo: value })}
                  required
                  className="h-10 border-2 border-gray-200 focus:border-green-500 rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                type="submit"
                disabled={createSaldoBancarioMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg h-10"
              >
                <Plus className="w-4 h-4 mr-2" />
                {createSaldoBancarioMutation.isPending ? "Salvando..." : editingId ? "Atualizar Saldo" : "Cadastrar Saldo"}
              </Button>
              
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-2 border-gray-300 hover:bg-gray-50 rounded-lg h-10"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card className="shadow-colorful border-0 bg-white/90 backdrop-blur-sm mb-6">
        <CardHeader>
          <CardTitle className="text-lg">🔍 Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Buscar por Banco</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome do banco..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 border-2 border-gray-200 focus:border-green-500 rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filtrar por Banco</Label>
              <Select value={bancoFilter} onValueChange={setBancoFilter}>
                <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-green-500 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Bancos</SelectItem>
                  {bancos.map((banco) => (
                    <SelectItem key={banco} value={banco}>{banco}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card className="shadow-colorful border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">📊 Histórico de Saldos ({filteredSaldos.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="responsive-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm">Data</TableHead>
                  <TableHead className="text-sm">Banco</TableHead>
                  <TableHead className="text-sm">Saldo</TableHead>
                  <TableHead className="mobile-hidden text-sm">Data de Registro</TableHead>
                  <TableHead className="text-right text-sm">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSaldos.map((saldo) => (
                  <React.Fragment key={saldo.id}>
                    <TableRow className={viewingId === saldo.id ? "bg-blue-50" : ""}>
                      <TableCell className="text-sm">{format(new Date(saldo.data), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="text-sm">{saldo.banco}</TableCell>
                      <TableCell className="font-semibold text-green-600 text-sm">
                        {formatCurrency(saldo.saldo)}
                      </TableCell>
                      <TableCell className="mobile-hidden text-sm">{format(new Date(saldo.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(saldo)}
                            className="hover:bg-blue-50 h-8 w-8 p-0"
                            title="Visualizar"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(saldo)}
                            className="hover:bg-green-50 h-8 w-8 p-0"
                            title="Editar"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(saldo.id, saldo.banco)}
                            className="hover:bg-red-50 text-red-600 h-8 w-8 p-0"
                            title="Excluir"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {viewingId === saldo.id && (
                      <TableRow className="bg-blue-50">
                        <TableCell colSpan={5}>
                          <div className="p-4 space-y-2">
                            <h4 className="font-semibold text-blue-900 text-sm">Detalhes do Saldo Bancário</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">ID:</span> {saldo.id}
                              </div>
                              <div>
                                <span className="font-medium">Última Atualização:</span> {format(new Date(saldo.updated_at), 'dd/MM/yyyy HH:mm:ss')}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
                
                {filteredSaldos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      <Banknote className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-sm">Nenhum saldo bancário encontrado</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaldosBancarios;
