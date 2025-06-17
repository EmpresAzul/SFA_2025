
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSaldosBancarios } from '@/hooks/useSaldosBancarios';
import { CurrencyInput } from '@/components/ui/currency-input';
import SaldoBancarioSummaryCard from '@/components/saldos-bancarios/SaldoBancarioSummaryCard';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash2 } from 'lucide-react';

interface SaldoBancario {
  id: string;
  banco: string;
  saldo: number;
  data: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const SaldosBancarios: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('lista');
  const [editingSaldo, setEditingSaldo] = useState<SaldoBancario | null>(null);
  const [loading, setLoading] = useState(false);

  const { useQuery: useSaldosQuery, useCreate, useUpdate, useDelete } = useSaldosBancarios();
  const { data: saldos, isLoading } = useSaldosQuery();
  const createSaldo = useCreate();
  const updateSaldo = useUpdate();
  const deleteSaldo = useDelete();

  const [formData, setFormData] = useState({
    banco: '',
    saldo: '',
  });

  useEffect(() => {
    if (editingSaldo) {
      setFormData({
        banco: editingSaldo.banco,
        saldo: editingSaldo.saldo.toString(),
      });
      setActiveTab('formulario');
    }
  }, [editingSaldo]);

  const resetForm = () => {
    setFormData({
      banco: '',
      saldo: '',
    });
    setEditingSaldo(null);
  };

  const handleEdit = (saldo: SaldoBancario) => {
    setEditingSaldo(saldo);
    setActiveTab('formulario');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este saldo bancário?')) {
      try {
        await deleteSaldo.mutateAsync(id);
        toast({
          title: "Sucesso!",
          description: "Saldo bancário excluído com sucesso.",
        });
      } catch (error: any) {
        toast({
          title: "Erro ao excluir",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.banco) {
      toast({
        title: "Erro",
        description: "Nome do banco é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const saldoNumerico = parseFloat(formData.saldo.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;

    const saldoData = {
      banco: formData.banco,
      saldo: saldoNumerico,
      data: new Date().toISOString().split('T')[0],
      user_id: user?.id!,
    };

    try {
      if (editingSaldo) {
        await updateSaldo.mutateAsync({ id: editingSaldo.id, data: saldoData });
      } else {
        await createSaldo.mutateAsync(saldoData);
      }
      
      resetForm();
      setActiveTab('lista');
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🏦 Saldos Bancários
          </h1>
          <p className="text-gray-600 mt-2 text-sm">Controle de saldos em suas contas bancárias</p>
        </div>
      </div>

      {/* Painel Resumo dos Saldos */}
      <SaldoBancarioSummaryCard />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-lg rounded-xl h-12 sm:h-14">
          <TabsTrigger
            value="lista"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            📋 Lista de Saldos
          </TabsTrigger>
          <TabsTrigger
            value="formulario"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm sm:text-base py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            {editingSaldo ? '✏️ Editar Saldo' : '➕ Novo Saldo'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="responsive-margin mt-6 sm:mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Saldos Bancários</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Seus saldos bancários atuais.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Banco</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saldos && saldos.map((saldo) => (
                    <TableRow key={saldo.id}>
                      <TableCell className="font-medium">{saldo.banco}</TableCell>
                      <TableCell>R$ {saldo.saldo.toFixed(2)}</TableCell>
                      <TableCell>{new Date(saldo.data).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(saldo)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(saldo.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      {isLoading ? 'Carregando...' : 'Fim dos saldos bancários'}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulario" className="mt-6 sm:mt-8">
          <Card>
            <CardHeader>
              <CardTitle>{editingSaldo ? 'Editar Saldo Bancário' : 'Novo Saldo Bancário'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="banco">Banco *</Label>
                    <Input
                      id="banco"
                      value={formData.banco}
                      onChange={(e) => setFormData({ ...formData, banco: e.target.value })}
                      placeholder="Nome do banco"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saldo">Saldo *</Label>
                    <CurrencyInput
                      value={formData.saldo}
                      onChange={(value) => setFormData({ ...formData, saldo: value })}
                      placeholder="R$ 0,00"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SaldosBancarios;
