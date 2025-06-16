
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
  const [saldos, setSaldos] = useState<SaldoBancario[]>([]);
  const [filteredSaldos, setFilteredSaldos] = useState<SaldoBancario[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bancoFilter, setBancoFilter] = useState('todos');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const { user, session } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    data: '',
    banco: '',
    saldo: 0
  });

  console.log('SaldosBancarios - User:', user);
  console.log('SaldosBancarios - Session:', session);

  useEffect(() => {
    if (user && session) {
      fetchSaldos();
    }
  }, [user, session]);

  useEffect(() => {
    filterSaldos();
  }, [saldos, searchTerm, bancoFilter]);

  const fetchSaldos = async () => {
    if (!session?.user?.id) {
      console.log('SaldosBancarios - No user session available');
      return;
    }

    setLoading(true);
    try {
      console.log('SaldosBancarios - Fetching saldos for user:', session.user.id);
      const { data, error } = await supabase
        .from('saldos_bancarios')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('SaldosBancarios - Error fetching saldos:', error);
        throw error;
      }
      
      console.log('SaldosBancarios - Fetched saldos:', data);
      setSaldos(data || []);
    } catch (error: any) {
      console.error('SaldosBancarios - Fetch error:', error);
      toast({
        title: "Erro ao carregar saldos bancários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

    setLoading(true);

    try {
      console.log('SaldosBancarios - Submitting data:', formData);
      
      if (editingId) {
        const { error } = await supabase
          .from('saldos_bancarios')
          .update({
            data: formData.data,
            banco: formData.banco,
            saldo: formData.saldo,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId)
          .eq('user_id', session.user.id);

        if (error) throw error;

        toast({
          title: "Saldo bancário atualizado com sucesso!",
          description: `Saldo do ${formData.banco} atualizado.`,
        });
      } else {
        const { error } = await supabase
          .from('saldos_bancarios')
          .insert([{
            user_id: session.user.id,
            data: formData.data,
            banco: formData.banco,
            saldo: formData.saldo
          }]);

        if (error) throw error;

        toast({
          title: "Saldo bancário cadastrado com sucesso!",
          description: `Saldo do ${formData.banco} registrado.`,
        });
      }

      resetForm();
      fetchSaldos();
    } catch (error: any) {
      console.error('SaldosBancarios - Submit error:', error);
      toast({
        title: "Erro ao salvar saldo bancário",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      const { error } = await supabase
        .from('saldos_bancarios')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Saldo bancário excluído!",
        description: "O saldo foi removido com sucesso.",
      });

      fetchSaldos();
    } catch (error: any) {
      console.error('SaldosBancarios - Delete error:', error);
      toast({
        title: "Erro ao excluir saldo bancário",
        description: error.message,
        variant: "destructive",
      });
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-fluxo-black-900">Saldos Bancários</h1>
          <p className="text-fluxo-black-600 mt-2">Controle dos saldos em contas bancárias</p>
        </div>
      </div>

      {/* Painéis de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Banknote className="w-5 h-5 mr-2" />
              Saldos por Banco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(saldosPorBanco).map(([banco, saldo]) => (
                <div key={banco} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{banco}</span>
                  <span className="font-bold text-blue-600">{formatCurrency(saldo)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Saldo Total</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(getSaldoTotal())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Editar Saldo' : 'Cadastrar Novo Saldo'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="banco">Banco</Label>
                <Select value={formData.banco} onValueChange={(value) => setFormData({ ...formData, banco: value })}>
                  <SelectTrigger>
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
                <Label htmlFor="saldo">Saldo</Label>
                <CurrencyInput
                  id="saldo"
                  value={formData.saldo}
                  onChange={(value) => setFormData({ ...formData, saldo: value })}
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                {loading ? "Salvando..." : editingId ? "Atualizar Saldo" : "Cadastrar Saldo"}
              </Button>
              
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Buscar por Banco</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome do banco..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Filtrar por Banco</Label>
              <Select value={bancoFilter} onValueChange={setBancoFilter}>
                <SelectTrigger>
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
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Saldos ({filteredSaldos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Data de Registro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSaldos.map((saldo) => (
                <React.Fragment key={saldo.id}>
                  <TableRow className={viewingId === saldo.id ? "bg-blue-50" : ""}>
                    <TableCell>{format(new Date(saldo.data), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{saldo.banco}</TableCell>
                    <TableCell className="font-semibold text-blue-600">
                      {formatCurrency(saldo.saldo)}
                    </TableCell>
                    <TableCell>{format(new Date(saldo.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(saldo)}
                          className="hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(saldo)}
                          className="hover:bg-green-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(saldo.id, saldo.banco)}
                          className="hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {viewingId === saldo.id && (
                    <TableRow className="bg-blue-50">
                      <TableCell colSpan={5}>
                        <div className="p-4 space-y-2">
                          <h4 className="font-semibold text-blue-900">Detalhes do Saldo Bancário</h4>
                          <div className="grid grid-cols-2 gap-4">
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
                    <p>Nenhum saldo bancário encontrado</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaldosBancarios;
