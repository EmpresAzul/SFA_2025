
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCadastros, type Cadastro } from '@/hooks/useCadastros';
import { Input } from '@/components/ui/input';
import { UnifiedCadastroForm } from '@/components/cadastro/UnifiedCadastroForm';
import { CadastroSummaryCards } from '@/components/cadastro/CadastroSummaryCards';
import { CadastroTable } from '@/components/cadastro/CadastroTable';

const CadastrosUnified: React.FC = () => {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [filteredCadastros, setFilteredCadastros] = useState<Cadastro[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('novo');
  const { user } = useAuth();

  const { useQuery, useDelete } = useCadastros();
  const { data: cadastrosData, isLoading } = useQuery();
  const deleteCadastro = useDelete();

  useEffect(() => {
    if (cadastrosData) {
      console.log('Cadastros data received:', cadastrosData);
      setCadastros(cadastrosData);
    }
  }, [cadastrosData]);

  useEffect(() => {
    filterCadastros();
  }, [cadastros, searchTerm]);

  const filterCadastros = () => {
    let filtered = cadastros;

    if (searchTerm) {
      filtered = filtered.filter(cadastro =>
        cadastro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cadastro.cpf_cnpj && cadastro.cpf_cnpj.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cadastro.email && cadastro.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        cadastro.tipo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCadastros(filtered);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cadastro?')) {
      try {
        await deleteCadastro.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao excluir cadastro:', error);
      }
    }
  };

  const handleEdit = (cadastro: Cadastro) => {
    // Para edição, redirecionamos para a aba específica do tipo
    window.location.href = `/dashboard/cadastros/${cadastro.tipo.toLowerCase()}s`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <UserCheck className="h-8 w-8 text-fluxo-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cadastros</h1>
          <p className="text-gray-600">Gerencie todos os cadastros do sistema</p>
        </div>
      </div>

      <CadastroSummaryCards
        cadastros={filteredCadastros}
        icon={UserCheck}
        tipo="Cadastros"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="novo">Novo Cadastro</TabsTrigger>
          <TabsTrigger value="lista">Lista de Cadastros</TabsTrigger>
        </TabsList>

        <TabsContent value="novo" className="space-y-4">
          <UnifiedCadastroForm />
        </TabsContent>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por nome, tipo, CPF/CNPJ ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <CadastroTable
            cadastros={filteredCadastros}
            isLoading={isLoading}
            tipo="Cadastros"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CadastrosUnified;
