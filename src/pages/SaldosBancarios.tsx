
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Banknote, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

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
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    data: '',
    banco: '',
    saldo: ''
  });

  useEffect(() => {
    if (user) {
      fetchSaldos();
    }
  }, [user]);

  useEffect(() => {
    filterSaldos();
  }, [saldos, searchTerm, bancoFilter]);

  const fetchSaldos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saldos_bancarios')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSaldos(data || []);
    } catch (error: any) {
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
    setLoading(true);

    try {
      const { error } = await supabase
        .from('saldos_bancarios')
        .insert([{
          user_id: user?.id,
          data: formData.data,
          banco: formData.banco,
          saldo: parseFloat(formData.saldo)
        }]);

      if (error) throw error;

      toast({
        title: "Saldo bancário cadastrado com sucesso!",
        description: `Saldo do ${formData.banco} registrado.`,
      });

      setFormData({
        data: '',
        banco: '',
        saldo: ''
      });
      fetchSaldos();
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar saldo bancário",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
                  <span className="font-bold text-blue-600">R$ {saldo.toFixed(2)}</span>
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
                <p className="text-2xl font-bold text-blue-900">R$ {getSaldoTotal().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Novo Saldo</CardTitle>
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
                <Label htmlFor="saldo">Saldo (R$)</Label>
                <Input
                  id="saldo"
                  type="number"
                  step="0.01"
                  value={formData.saldo}
                  onChange={(e) => setFormData({ ...formData, saldo: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              {loading ? "Cadastrando..." : "Cadastrar Saldo"}
            </Button>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSaldos.map((saldo) => (
                <TableRow key={saldo.id}>
                  <TableCell>{format(new Date(saldo.data), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{saldo.banco}</TableCell>
                  <TableCell className="font-semibold text-blue-600">
                    R$ {saldo.saldo.toFixed(2)}
                  </TableCell>
                  <TableCell>{format(new Date(saldo.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaldosBancarios;
