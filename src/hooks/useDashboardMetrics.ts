import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useDashboardMetrics = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["dashboard-metrics", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("User not authenticated");

      console.log("🔍 Buscando métricas do dashboard para usuário:", session.user.id);

      const userId = session.user.id;

      // Buscar clientes
      const { count: qtdeClientes } = await supabase
        .from("cadastros")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("tipo", "Cliente")
        .eq("status", "ativo");

      // Buscar fornecedores
      const { count: qtdeFornecedores } = await supabase
        .from("cadastros")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("tipo", "Fornecedor")
        .eq("status", "ativo");

      // Buscar funcionários
      const { count: qtdeFuncionarios } = await supabase
        .from("cadastros")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("tipo", "Funcionário")
        .eq("status", "ativo");

      // Buscar produtos
      const { count: qtdeProdutos } = await supabase
        .from("estoques")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "ativo");

      // Buscar serviços - hardcoded para evitar erro de tipo
      const qtdeServicos = 0;

      // Calcular datas do mês atual
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      // Buscar receitas
      const { data: receitasData } = await supabase
        .from("lancamentos")
        .select("valor")
        .eq("user_id", userId)
        .eq("tipo", "receita")
        .gte("data", startOfMonth.toISOString().split("T")[0])
        .lte("data", endOfMonth.toISOString().split("T")[0]);

      // Buscar despesas
      const { data: despesasData } = await supabase
        .from("lancamentos")
        .select("valor")
        .eq("user_id", userId)
        .eq("tipo", "despesa")
        .gte("data", startOfMonth.toISOString().split("T")[0])
        .lte("data", endOfMonth.toISOString().split("T")[0]);

      // Buscar saldos bancários
      const { data: saldosData } = await supabase
        .from("saldos_bancarios")
        .select("saldo")
        .eq("user_id", userId);

      // Buscar ponto de equilíbrio
      const { data: pontoEquilibrioData } = await supabase
        .from("ponto_equilibrio")
        .select("dados_json")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      const totalReceitas = receitasData?.reduce((total, item) => total + (item.valor || 0), 0) || 0;
      const totalDespesas = despesasData?.reduce((total, item) => total + (item.valor || 0), 0) || 0;
      const saldoBancario = saldosData?.reduce((total, item) => total + (item.saldo || 0), 0) || 0;

      const pontoEquilibrio = (pontoEquilibrioData?.[0]?.dados_json as any)?.pontoEquilibrio || 
        (totalDespesas > 0 ? totalDespesas / 0.4 : 0);

      const metrics = {
        pontoEquilibrio,
        qtdeClientes: qtdeClientes || 0,
        qtdeFornecedores: qtdeFornecedores || 0,
        qtdeFuncionarios: qtdeFuncionarios || 0,
        qtdeProdutos: qtdeProdutos || 0,
        qtdeServicos: qtdeServicos || 0,
        totalReceitasMes: totalReceitas,
        totalDespesasMes: totalDespesas,
        saldoBancario,
      };

      console.log("📊 Métricas finais:", metrics);
      return metrics;
    },
    enabled: !!session?.user?.id,
  });
};
