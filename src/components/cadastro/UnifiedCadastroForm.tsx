
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCadastros } from '@/hooks/useCadastros';
import { useAuth } from '@/contexts/AuthContext';

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

interface FormData {
  data: string;
  tipo: 'Cliente' | 'Fornecedor' | 'Funcionário' | '';
  nome: string;
  endereco: string;
  numero: string;
  cidade: string;
  estado: string;
  observacoes: string;
}

export const UnifiedCadastroForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { useCreate } = useCadastros();
  const createCadastro = useCreate();

  const [formData, setFormData] = useState<FormData>({
    data: new Date().toISOString().split('T')[0],
    tipo: '',
    nome: '',
    endereco: '',
    numero: '',
    cidade: '',
    estado: '',
    observacoes: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.data.trim()) {
      toast({
        title: "Erro de validação",
        description: "Data é obrigatória.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.tipo) {
      toast({
        title: "Erro de validação",
        description: "Tipo é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.nome.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const cadastroData = {
        data: formData.data,
        nome: formData.nome.trim(),
        tipo: formData.tipo as 'Cliente' | 'Fornecedor' | 'Funcionário',
        pessoa: 'Física' as const,
        endereco: formData.endereco.trim() || undefined,
        numero: formData.numero.trim() || undefined,
        cidade: formData.cidade.trim() || undefined,
        estado: formData.estado || undefined,
        observacoes: formData.observacoes.trim() || undefined,
        user_id: user!.id,
        status: 'ativo',
        cpf_cnpj: undefined,
        telefone: undefined,
        email: undefined,
        bairro: undefined,
        cep: undefined,
        salario: undefined
      };

      await createCadastro.mutateAsync(cadastroData);
      
      toast({
        title: "Sucesso",
        description: "Cadastro salvo com sucesso!",
      });

      // Reset form
      setFormData({
        data: new Date().toISOString().split('T')[0],
        tipo: '',
        nome: '',
        endereco: '',
        numero: '',
        cidade: '',
        estado: '',
        observacoes: ''
      });
    } catch (error: any) {
      console.error('Erro ao salvar cadastro:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar cadastro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Cadastro</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => handleInputChange('data', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cliente">Cliente</SelectItem>
                  <SelectItem value="Fornecedor">Fornecedor</SelectItem>
                  <SelectItem value="Funcionário">Funcionário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                placeholder="Digite o endereço"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => handleInputChange('numero', e.target.value)}
                placeholder="Digite o número"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                placeholder="Digite a cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">UF</Label>
              <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
