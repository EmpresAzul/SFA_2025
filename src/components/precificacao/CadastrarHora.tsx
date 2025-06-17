
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCurrencyInput } from '@/components/ui/enhanced-currency-input';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePrecificacao } from '@/hooks/usePrecificacao';
import { supabase } from '@/integrations/supabase/client';
import { formatNumberToDisplay } from '@/utils/currency';
import type { Database } from '@/integrations/supabase/types';

type Precificacao = Database['public']['Tables']['precificacao']['Row'];

interface DespesaFixa {
  id: string;
  descricao: string;
  valor: number;
}

interface CadastrarHoraProps {
  editingItem?: Precificacao | null;
  onCancelEdit?: () => void;
  onSaveSuccess?: () => void;
}

const CadastrarHora: React.FC<CadastrarHoraProps> = ({
  editingItem,
  onCancelEdit,
  onSaveSuccess,
}) => {
  const { toast } = useToast();
  const { useCreate, useUpdate } = usePrecificacao();
  const createPrecificacao = useCreate();
  const updatePrecificacao = useUpdate();
  const [loading, setLoading] = useState(false);

  const [horaData, setHoraData] = useState({
    nome: '',
    proLabore: 0,
    diasTrabalhados: '',
    horasPorDia: '',
  });

  const [despesasFixas, setDespesasFixas] = useState<DespesaFixa[]>([
    { id: '1', descricao: '', valor: 0 }
  ]);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (editingItem && editingItem.tipo === 'Hora') {
      const dados = editingItem.dados_json as any;
      
      setHoraData({
        nome: editingItem.nome,
        proLabore: dados?.pro_labore || 0,
        diasTrabalhados: dados?.dias_trabalhados?.toString() || '',
        horasPorDia: dados?.horas_por_dia?.toString() || '',
      });

      // Carregar despesas fixas do JSON
      if (dados?.despesas_fixas) {
        const despesasCarregadas = dados.despesas_fixas.map((despesa: any) => ({
          id: despesa.id || Date.now().toString(),
          descricao: despesa.descricao,
          valor: despesa.valor
        }));
        setDespesasFixas(despesasCarregadas.length > 0 ? despesasCarregadas : [{ id: '1', descricao: '', valor: 0 }]);
      }
    }
  }, [editingItem]);

  const adicionarDespesa = () => {
    if (despesasFixas.length < 50) {
      const novaDespesa: DespesaFixa = {
        id: Date.now().toString(),
        descricao: '',
        valor: 0
      };
      setDespesasFixas([...despesasFixas, novaDespesa]);
    }
  };

  const removerDespesa = (id: string) => {
    if (despesasFixas.length > 1) {
      setDespesasFixas(despesasFixas.filter(despesa => despesa.id !== id));
    }
  };

  const atualizarDespesa = (id: string, campo: 'descricao' | 'valor', valor: string | number) => {
    setDespesasFixas(despesasFixas.map(despesa => 
      despesa.id === id ? { ...despesa, [campo]: valor } : despesa
    ));
  };

  const totalCustosFixos = despesasFixas.reduce((total, despesa) => total + despesa.valor, 0);
  const diasTrabalhadosNumerico = parseFloat(horaData.diasTrabalhados) || 0;
  const horasPorDiaNumerico = parseFloat(horaData.horasPorDia) || 0;

  // Cálculos automáticos
  const horasTrabalhadasMes = diasTrabalhadosNumerico * horasPorDiaNumerico;
  const custoTotalMensal = horaData.proLabore + totalCustosFixos;
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
      const despesasSerializadas = despesasFixas
        .filter(d => d.descricao && d.valor > 0)
        .map(despesa => ({
          id: despesa.id,
          descricao: despesa.descricao,
          valor: despesa.valor
        }));

      const dadosPrecificacao = {
        nome: horaData.nome,
        categoria: 'Hora Trabalhada',
        tipo: 'Hora' as const,
        preco_final: valorHoraTrabalhada,
        dados_json: JSON.parse(JSON.stringify({
          pro_labore: horaData.proLabore,
          dias_trabalhados: diasTrabalhadosNumerico,
          horas_por_dia: horasPorDiaNumerico,
          horas_trabalhadas_mes: horasTrabalhadasMes,
          despesas_fixas: despesasSerializadas,
          total_custos_fixos: totalCustosFixos,
          custo_total_mensal: custoTotalMensal,
          valor_hora_trabalhada: valorHoraTrabalhada,
          valor_dia_trabalhado: valorDiaTrabalhado
        }))
      };

      if (editingItem) {
        // Atualizar item existente
        await updatePrecificacao.mutateAsync({
          id: editingItem.id,
          data: dadosPrecificacao
        });
        toast({
          title: "Sucesso!",
          description: "Precificação de hora atualizada com êxito.",
        });
      } else {
        // Criar novo item
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Usuário não autenticado');
        }

        await createPrecificacao.mutateAsync({
          ...dadosPrecificacao,
          user_id: user.id,
        });
        toast({
          title: "Sucesso!",
          description: "Precificação de hora cadastrada com êxito.",
        });
      }

      // Reset form
      setHoraData({
        nome: '',
        proLabore: 0,
        diasTrabalhados: '',
        horasPorDia: '',
      });
      setDespesasFixas([{ id: '1', descricao: '', valor: 0 }]);
      
      // Chamar callback de sucesso
      onSaveSuccess?.();
    } catch (error: any) {
      console.error('Erro ao salvar hora:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setHoraData({
      nome: '',
      proLabore: 0,
      diasTrabalhados: '',
      horasPorDia: '',
    });
    setDespesasFixas([{ id: '1', descricao: '', valor: 0 }]);
    
    onCancelEdit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {editingItem && (
        <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancelar Edição
          </Button>
          <div>
            <h3 className="font-semibold text-orange-800">Editando: {editingItem.nome}</h3>
            <p className="text-sm text-orange-600">Modifique os campos e clique em "Salvar Alterações"</p>
          </div>
        </div>
      )}

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
          <EnhancedCurrencyInput
            id="pro-labore"
            value={horaData.proLabore}
            onChange={(numericValue) => setHoraData({ ...horaData, proLabore: numericValue })}
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
                  <EnhancedCurrencyInput
                    value={despesa.valor}
                    onChange={(numericValue) => atualizarDespesa(despesa.id, 'valor', numericValue)}
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
                <span className="text-lg">{formatNumberToDisplay(totalCustosFixos)}</span>
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
                <span className="font-semibold text-green-600">{formatNumberToDisplay(valorHoraTrabalhada)}</span>
              </div>
              <div className="flex justify-between">
                <span>Valor do dia trabalhado:</span>
                <span className="font-semibold text-green-600">{formatNumberToDisplay(valorDiaTrabalhado)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600"
        >
          {editingItem ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {loading ? "Salvando..." : editingItem ? "Salvar Alterações" : "Cadastrar Precificação de Hora"}
        </Button>
        
        {editingItem && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default CadastrarHora;
