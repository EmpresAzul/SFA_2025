
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePrecificacao } from '@/hooks/usePrecificacao';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { TaxaAdicional } from '@/components/precificacao/forms/TaxasAdicionaisManager';

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

  const [taxasAdicionais, setTaxasAdicionais] = useState<TaxaAdicional[]>([
    { id: '1', descricao: '', percentual: 0 }
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

      // Carregar taxas adicionais do JSON
      if (dados?.taxas_adicionais) {
        const taxasCarregadas = dados.taxas_adicionais.map((taxa: any) => ({
          id: taxa.id || Date.now().toString(),
          descricao: taxa.descricao,
          percentual: taxa.percentual
        }));
        setTaxasAdicionais(taxasCarregadas.length > 0 ? taxasCarregadas : [{ id: '1', descricao: '', percentual: 0 }]);
      }
    }
  }, [editingItem]);

  const resetForm = () => {
    console.log('🔄 Resetando formulário...');
    setHoraData({
      nome: '',
      proLabore: 0,
      diasTrabalhados: '',
      horasPorDia: '',
    });
    setDespesasFixas([{ id: '1', descricao: '', valor: 0 }]);
    setTaxasAdicionais([{ id: '1', descricao: '', percentual: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 INICIANDO handleSubmit...');
    console.log('📊 Dados do formulário:', horaData);
    console.log('💰 Despesas fixas:', despesasFixas);
    console.log('💸 Taxas adicionais:', taxasAdicionais);
    
    // Verificar autenticação primeiro
    console.log('🔐 Verificando autenticação...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('👤 Usuário atual:', user);
    console.log('❌ Erro de auth:', authError);
    
    if (!user) {
      console.log('🚫 ERRO: Usuário não autenticado!');
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para cadastrar uma precificação.",
        variant: "destructive",
      });
      return;
    }
    
    const diasTrabalhadosNumerico = parseFloat(horaData.diasTrabalhados) || 0;
    const horasPorDiaNumerico = parseFloat(horaData.horasPorDia) || 0;
    const totalCustosFixos = despesasFixas.reduce((total, despesa) => total + despesa.valor, 0);
    const totalTaxasPercentual = taxasAdicionais.reduce((total, taxa) => total + taxa.percentual, 0);
    const horasTrabalhadasMes = diasTrabalhadosNumerico * horasPorDiaNumerico;
    const custoTotalMensal = horaData.proLabore + totalCustosFixos;
    const valorHoraTrabalhada = horasTrabalhadasMes > 0 ? custoTotalMensal / horasTrabalhadasMes : 0;
    const valorTaxasHora = (valorHoraTrabalhada * totalTaxasPercentual) / 100;
    const valorHoraFinal = valorHoraTrabalhada + valorTaxasHora;
    const valorDiaTrabalhado = horasPorDiaNumerico > 0 ? valorHoraFinal * horasPorDiaNumerico : 0;

    console.log('📈 Cálculos realizados:', {
      diasTrabalhadosNumerico,
      horasPorDiaNumerico,
      totalCustosFixos,
      totalTaxasPercentual,
      horasTrabalhadasMes,
      custoTotalMensal,
      valorHoraTrabalhada,
      valorTaxasHora,
      valorHoraFinal,
      valorDiaTrabalhado
    });

    // Validações
    console.log('✅ Iniciando validações...');
    if (!horaData.nome) {
      console.log('❌ VALIDAÇÃO FALHOU: Nome vazio');
      toast({
        title: "Erro",
        description: "Nome é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (diasTrabalhadosNumerico <= 0 || horasPorDiaNumerico <= 0) {
      console.log('❌ VALIDAÇÃO FALHOU: Dias ou horas inválidos');
      toast({
        title: "Erro",
        description: "Dias trabalhados e horas por dia devem ser maiores que zero.",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ Todas as validações passaram!');

    setLoading(true);
    console.log('⏳ Loading state ativado');

    try {
      const despesasSerializadas = despesasFixas
        .filter(d => d.descricao && d.valor > 0)
        .map(despesa => ({
          id: despesa.id,
          descricao: despesa.descricao,
          valor: despesa.valor
        }));

      const taxasSerializadas = taxasAdicionais
        .filter(t => t.descricao && t.percentual > 0)
        .map(taxa => ({
          id: taxa.id,
          descricao: taxa.descricao,
          percentual: taxa.percentual
        }));

      console.log('💾 Despesas serializadas:', despesasSerializadas);
      console.log('💾 Taxas serializadas:', taxasSerializadas);

      const dadosPrecificacao = {
        nome: horaData.nome,
        categoria: 'Hora Trabalhada',
        tipo: 'Hora' as const,
        preco_final: valorHoraFinal,
        dados_json: JSON.parse(JSON.stringify({
          pro_labore: horaData.proLabore,
          dias_trabalhados: diasTrabalhadosNumerico,
          horas_por_dia: horasPorDiaNumerico,
          horas_trabalhadas_mes: horasTrabalhadasMes,
          despesas_fixas: despesasSerializadas,
          taxas_adicionais: taxasSerializadas,
          total_custos_fixos: totalCustosFixos,
          total_taxas_percentual: totalTaxasPercentual,
          custo_total_mensal: custoTotalMensal,
          valor_hora_trabalhada: valorHoraTrabalhada,
          valor_taxas_hora: valorTaxasHora,
          valor_hora_final: valorHoraFinal,
          valor_dia_trabalhado: valorDiaTrabalhado
        }))
      };

      console.log('📦 Dados para salvar:', dadosPrecificacao);

      if (editingItem) {
        console.log('✏️ Modo EDIÇÃO - atualizando item:', editingItem.id);
        await updatePrecificacao.mutateAsync({
          id: editingItem.id,
          data: dadosPrecificacao
        });
        console.log('✅ Atualização bem-sucedida!');
        toast({
          title: "Sucesso!",
          description: "Precificação de hora atualizada com êxito.",
        });
      } else {
        console.log('➕ Modo CRIAÇÃO - criando novo item');
        
        const dadosCompletos = {
          ...dadosPrecificacao,
          user_id: user.id,
        };

        console.log('📦 Dados completos para criar:', dadosCompletos);

        const resultado = await createPrecificacao.mutateAsync(dadosCompletos);
        console.log('✅ Criação bem-sucedida! Resultado:', resultado);
        
        toast({
          title: "Sucesso!",
          description: "Precificação de hora cadastrada com êxito.",
        });
      }

      console.log('🔄 Resetando formulário após sucesso...');
      resetForm();
      console.log('🎯 Chamando onSaveSuccess...');
      onSaveSuccess?.();
      
    } catch (error: any) {
      console.error('💥 ERRO ao salvar hora:', error);
      console.error('💥 Detalhes do erro:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      toast({
        title: "Erro ao salvar",
        description: error.message || "Erro desconhecido ao salvar",
        variant: "destructive",
      });
    } finally {
      console.log('🏁 Finalizando - desativando loading...');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('❌ Cancelando formulário...');
    resetForm();
    onCancelEdit?.();
  };

  return {
    horaData,
    setHoraData,
    despesasFixas,
    setDespesasFixas,
    taxasAdicionais,
    setTaxasAdicionais,
    loading,
    handleSubmit,
    handleCancel,
  };
};
