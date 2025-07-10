import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePrecificacao } from "@/hooks/usePrecificacao";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Precificacao = Database["public"]["Tables"]["precificacao"]["Row"];

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
  onSaveSuccess?: () => void,
) => {
  const { toast } = useToast();
  const { useCreate, useUpdate } = usePrecificacao();
  const createPrecificacao = useCreate();
  const updatePrecificacao = useUpdate();
  const [loading, setLoading] = useState(false);

  const [horaData, setHoraData] = useState<HoraFormData>({
    nome: "",
    proLabore: 0,
    diasTrabalhados: "",
    horasPorDia: "",
  });

  const [despesasFixas, setDespesasFixas] = useState<DespesaFixa[]>([
    { id: "1", descricao: "", valor: 0 },
  ]);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (editingItem && editingItem.tipo === "Hora") {
      const dados = editingItem.dados_json as Record<string, unknown>;

      setHoraData({
        nome: editingItem.nome,
        proLabore: (dados?.pro_labore as number) || 0,
        diasTrabalhados: (dados?.dias_trabalhados as string) || "",
        horasPorDia: (dados?.horas_por_dia as string) || "",
      });

      // Carregar despesas fixas do JSON
      if (dados?.despesas_fixas) {
        const despesasCarregadas = (dados.despesas_fixas as Array<Record<string, unknown>>).map((despesa) => ({
          id: (despesa.id as string) || Date.now().toString(),
          descricao: despesa.descricao as string,
          valor: despesa.valor as number,
        }));
        setDespesasFixas(
          despesasCarregadas.length > 0
            ? despesasCarregadas
            : [{ id: "1", descricao: "", valor: 0 }],
        );
      }
    }
  }, [editingItem]);

  const resetForm = () => {
    console.log("🔄 Resetando formulário...");
    setHoraData({
      nome: "",
      proLabore: 0,
      diasTrabalhados: "",
      horasPorDia: "",
    });
    setDespesasFixas([{ id: "1", descricao: "", valor: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 INICIANDO handleSubmit...");
    console.log("📊 Dados do formulário:", horaData);
    console.log("💰 Despesas fixas:", despesasFixas);

    // Verificar autenticação primeiro
    console.log("🔐 Verificando autenticação...");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    console.log("👤 Usuário atual:", user);
    console.log("❌ Erro de auth:", authError);

    if (!user) {
      console.log("🚫 ERRO: Usuário não autenticado!");
      toast({
        title: "Erro de Autenticação",
        description:
          "Você precisa estar logado para cadastrar uma precificação.",
        variant: "destructive",
      });
      return;
    }

    const diasTrabalhadosNumerico = parseFloat(horaData.diasTrabalhados) || 0;
    const horasPorDiaNumerico = parseFloat(horaData.horasPorDia) || 0;
    const totalCustosFixos = despesasFixas.reduce(
      (total, despesa) => total + despesa.valor,
      0,
    );
    const horasTrabalhadasMes = diasTrabalhadosNumerico * horasPorDiaNumerico;
    const custoTotalMensal = horaData.proLabore + totalCustosFixos;
    const valorHoraTrabalhada =
      horasTrabalhadasMes > 0 ? custoTotalMensal / horasTrabalhadasMes : 0;
    const valorDiaTrabalhado =
      horasPorDiaNumerico > 0 ? valorHoraTrabalhada * horasPorDiaNumerico : 0;

    console.log("📈 Cálculos realizados:", {
      diasTrabalhadosNumerico,
      horasPorDiaNumerico,
      totalCustosFixos,
      horasTrabalhadasMes,
      custoTotalMensal,
      valorHoraTrabalhada,
      valorDiaTrabalhado,
    });

    // Validações
    console.log("✅ Iniciando validações...");
    if (!horaData.nome) {
      console.log("❌ VALIDAÇÃO FALHOU: Nome vazio");
      toast({
        title: "Erro",
        description: "Nome é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (diasTrabalhadosNumerico <= 0 || horasPorDiaNumerico <= 0) {
      console.log("❌ VALIDAÇÃO FALHOU: Dias ou horas inválidos");
      toast({
        title: "Erro",
        description:
          "Dias trabalhados e horas por dia devem ser maiores que zero.",
        variant: "destructive",
      });
      return;
    }

    console.log("✅ Todas as validações passaram!");

    setLoading(true);
    console.log("⏳ Loading state ativado");

    try {
      const despesasSerializadas = despesasFixas
        .filter((d) => d.descricao && d.valor > 0)
        .map((despesa) => ({
          id: despesa.id,
          descricao: despesa.descricao,
          valor: despesa.valor,
        }));

      console.log("💾 Despesas serializadas:", despesasSerializadas);

      const dadosPrecificacao = {
        nome: horaData.nome,
        categoria: "Hora Trabalhada",
        tipo: "Hora" as const,
        preco_final: valorHoraTrabalhada,
        dados_json: JSON.parse(
          JSON.stringify({
            pro_labore: horaData.proLabore,
            dias_trabalhados: diasTrabalhadosNumerico,
            horas_por_dia: horasPorDiaNumerico,
            horas_trabalhadas_mes: horasTrabalhadasMes,
            despesas_fixas: despesasSerializadas,
            total_custos_fixos: totalCustosFixos,
            custo_total_mensal: custoTotalMensal,
            valor_hora_trabalhada: valorHoraTrabalhada,
            valor_dia_trabalhado: valorDiaTrabalhado,
          }),
        ),
      };

      console.log("📦 Dados para salvar:", dadosPrecificacao);

      if (editingItem) {
        console.log("✏️ Modo EDIÇÃO - atualizando item:", editingItem.id);
        await updatePrecificacao.mutateAsync({
          id: editingItem.id,
          data: dadosPrecificacao,
        });
        console.log("✅ Atualização bem-sucedida!");
        toast({
          title: "Sucesso!",
          description: "Precificação de hora atualizada com êxito.",
        });
      } else {
        console.log("➕ Modo CRIAÇÃO - criando novo item");

        const dadosCompletos = {
          ...dadosPrecificacao,
          user_id: user.id,
        };

        console.log("📦 Dados completos para criar:", dadosCompletos);

        const resultado = await createPrecificacao.mutateAsync(dadosCompletos);
        console.log("✅ Criação bem-sucedida! Resultado:", resultado);

        toast({
          title: "Sucesso!",
          description: "Precificação de hora cadastrada com êxito.",
        });
      }

      console.log("🔄 Resetando formulário após sucesso...");
      resetForm();
      console.log("🎯 Chamando onSaveSuccess...");
      onSaveSuccess?.();
    } catch (error: unknown) {
      console.error("💥 ERRO ao salvar hora:", error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error("💥 Detalhes do erro:", {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : 'N/A',
        name: error instanceof Error ? error.name : 'Unknown',
      });

      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      console.log("🏁 Finalizando - desativando loading...");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("❌ Cancelando formulário...");
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
