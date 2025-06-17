import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DespesaFixa {
  id: string;
  descricao: string;
  valor: string;
}

const CadastrarHora: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [horaData, setHoraData] = useState({
    nome: '',
    proLabore: '',
    diasTrabalhados: '',
    horasPorDia: '',
  });

  const [despesasFixas, setDespesasFixas] = useState<DespesaFixa[]>([
    { id: '1', descricao: '', valor: '' }
  ]);

  const adicionarDespesa = () => {
    if (despesasFixas.length < 50) {
      const novaDespesa: DespesaFixa = {
        id: Date.now().toString(),
        descricao: '',
        valor: ''
      };
      setDespesasFixas([...despesasFixas, novaDespesa]);
    }
  };

  const removerDespesa = (id: string) => {
    if (despesasFixas.length > 1) {
      setDespesasFixas(despesasFixas.filter(despesa => despesa.id !== id));
    }
  };

  const atualizarDespesa = (id: string, campo: 'descricao' | 'valor', valor: string) => {
    setDespesasFixas(despesasFixas.map(despesa => 
      despesa.id === id ? { ...despesa, [campo]: valor } : despesa
    ));
  };

  // Converter valores string para number para cálculos
  const parseValue = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
  };

  const totalCustosFixos = despesasFixas.reduce((total, despesa) => total + parseValue(despesa.valor), 0);
  const proLaboreNumerico = parseValue(horaData.proLabore);
  const diasTrabalhadosNumerico = parseFloat(horaData.diasTrabalhados) || 0;
  const horasPorDiaNumerico = parseFloat(horaData.horasPorDia) || 0;

  // Cálculos automáticos
  const horasTrabalhadasMes = diasTrabalhadosNumerico * horasPorDiaNumerico;
  const custoTotalMensal = proLaboreNumerico + totalCustosFixos;
  const valorHoraTrabalhada = horasTrabalhadasMes > 0 ? custoTotalMensal / horasTrabalhadasMes : 0;
  const valorDiaTrabalhado = horasPorDiaNumerico > 0 ? valorHoraTrabalhada * horasPorDiaNumerico : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!horaData.nome) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (diasTrabalhadosNumerico <= 0 || horasPorDiaNumerico <= 0) {
      toast({
        title: "Erro",
        description: "Dias trabalhados e horas por dia devem ser maiores que zero.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      toast({
        title: "Sucesso!",
        description: `Precificação de hora para "${horaData.nome}" foi cadastrada.`,
      });

      // Reset form
      setHoraData({
        nome: '',
        proLabore: '',
        diasTrabalhados: '',
        horasPorDia: '',
      });
      setDespesasFixas([{ id: '1', descricao: '', valor: '' }]);
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome-hora">Nome *</Label>
          <Input
            id="nome-hora"
            value={horaData.nome}
            onChange={(e) => setHoraData({ ...horaData, nome: e.target.value })}
            placeholder="Digite o nome"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pro-labore">Pró-labore *</Label>
          <CurrencyInput
            value={horaData.proLabore}
            onChange={(value) => setHoraData({ ...horaData, proLabore: value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dias-trabalhados">Qtde. dias trabalhados no mês *</Label>
          <Input
            id="dias-trabalhados"
            type="number"
            min="1"
            max="31"
            value={horaData.diasTrabalhados}
            onChange={(e) => setHoraData({ ...horaData, diasTrabalhados: e.target.value })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="horas-por-dia">Qtde. horas trabalhadas por dia *</Label>
          <Input
            id="horas-por-dia"
            type="number"
            min="1"
            max="24"
            step="0.5"
            value={horaData.horasPorDia}
            onChange={(e) => setHoraData({ ...horaData, horasPorDia: e.target.value })}
            placeholder="0"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Despesas Fixas</CardTitle>
            <Button
              type="button"
              onClick={adicionarDespesa}
              disabled={despesasFixas.length >= 50}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-600">
              <div className="col-span-6">Descrição dos Custos Fixos</div>
              <div className="col-span-4">Valor</div>
              <div className="col-span-2">Ação</div>
            </div>
            
            {despesasFixas.map((despesa) => (
              <div key={despesa.id} className="grid grid-cols-12 gap-2">
                <div className="col-span-6">
                  <Input
                    value={despesa.descricao}
                    onChange={(e) => atualizarDespesa(despesa.id, 'descricao', e.target.value)}
                    placeholder="Descrição do custo"
                  />
                </div>
                <div className="col-span-4">
                  <CurrencyInput
                    value={despesa.valor}
                    onChange={(value) => atualizarDespesa(despesa.id, 'valor', value)}
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    onClick={() => removerDespesa(despesa.id)}
                    disabled={despesasFixas.length <= 1}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-3">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Custos Fixos:</span>
                <span className="text-lg">R$ {totalCustosFixos.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo dos Cálculos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Quantidade de dias trabalhados no mês:</span>
                <span className="font-semibold">{horaData.diasTrabalhados} dias</span>
              </div>
              <div className="flex justify-between">
                <span>Quantidade de horas trabalhadas no mês:</span>
                <span className="font-semibold">{horasTrabalhadasMes} horas</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Valor da hora trabalhada:</span>
                <span className="font-semibold text-green-600">R$ {valorHoraTrabalhada.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Valor do dia trabalhado:</span>
                <span className="font-semibold text-green-600">R$ {valorDiaTrabalhado.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
      >
        <Plus className="w-4 h-4 mr-2" />
        {loading ? "Cadastrando..." : "Cadastrar Precificação de Hora"}
      </Button>
    </form>
  );
};

export default CadastrarHora;
