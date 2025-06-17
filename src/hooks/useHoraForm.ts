
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePrecificacao } from '@/hooks/usePrecificacao';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Precificacao = Database['public']['Tables']['precificacao']['Row'];

export interface DespesaFixa {
  id: string;
  descricao: string;
  valor: number;
}

interface HoraFormData {
  nome: string;
  proLabore: number;
  diasTrabalhados: string;
  horasPorDia: string;
}

export const useHoraForm = (
  editingItem?: Precificacao | null,
  onCancelEdit?: () => void,
  onSaveSuccess?: () => void
) => {
  const { toast } = useToast();
  const { useCreate, useUpdate } = usePrecificacao();
  const createPrecificacao = useCreate();
  const updatePrecificacao = useUpdate();
  const [loading, setLoading] = useState(false);

  const [horaData, setHoraData] = useState<HoraFormData>({
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

  const resetForm = () => {
    setHoraData({
      nome: '',
      proLabore: 0,
      diasTrabalhados: '',
      horasPorDia: '',
    });
    setDespesasFixas([{ id: '1', descricao: '', valor: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const diasTrabalhadosNumerico = parseFloat(horaData.diasTrabalhados) || 0;
    const horasPorDiaNumerico = parseFloat(horaData.horasPorDia) || 0;
    const totalCustosFixos = despesasFixas.reduce((total, despesa) => total + despesa.valor, 0);
    const horasTrabalhadasMes = diasTrabalhadosNumerico * horasPorDiaNumerico;
    const custoTotalMensal = horaData.proLabore + totalCustosFixos;
    const valorHoraTrabalhada = horasTrabalhadasMes > 0 ? custoTotalMensal / horasTrabalhadasMes : 0;
    const valorDiaTrabalhado = horasPorDiaNumerico > 0 ? valorHoraTrabalhada * horasPorDiaNumerico : 0;

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
        await updatePrecificacao.mutateAsync({
          id: editingItem.id,
          data: dadosPrecificacao
        });
        toast({
          title: "Sucesso!",
          description: "Precificação de hora atualizada com êxito.",
        });
      } else {
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

      resetForm();
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
    resetForm();
    onCancelEdit?.();
  };

  return {
    horaData,
    setHoraData,
    despesasFixas,
    setDespesasFixas,
    loading,
    handleSubmit,
    handleCancel,
  };
};
