import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardMetrics {
  pontoEquilibrio: number;
  qtdeClientes: number;
  qtdeFornecedores: number;
  qtdeFuncionarios: number;
  qtdeProdutos: number;
  qtdeServicos: number;
  totalReceitasMes: number;
  totalDespesasMes: number;
  saldoBancario: number;
}

export const useDashboardMetrics = () => {
  const { session } = useAuth();

  return useQuery<DashboardMetrics>({
    queryKey: ["dashboard-metrics", session?.user?.id],
    queryFn: async (): Promise<DashboardMetrics> => {
      if (!session?.user?.id) throw new Error("User not authenticated");

      const userId = session.user.id;
      console.log("🔍 Buscando métricas do dashboard para usuário:", userId);

      // Datas do mês atual
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const startDate = startOfMonth.toISOString().split("T")[0];

      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);
      const endDate = endOfMonth.toISOString().split("T")[0];

      // Buscar clientes
      const clientesRes = await supabase
        .from("cadastros")
        .select("id")
        .eq("user_id", userId)
        .eq("tipo", "Cliente")
        .eq("status", "ativo");
      const clientes = clientesRes.data;

      // Buscar fornecedores
      const fornecedoresRes = await supabase
        .from("cadastros")
        .select("id")
        .eq("user_id", userId)
        .eq("tipo", "Fornecedor")
        .eq("status", "ativo");
      const fornecedores = fornecedoresRes.data;

      // Buscar funcionários
      const funcionariosRes = await supabase
        .from("cadastros")
        .select("id")
        .eq("user_id", userId)
        .eq("tipo", "Funcionário")
        .eq("status", "ativo");
      const funcionarios = funcionariosRes.data;

      // Buscar produtos
      const produtosRes = await supabase
        .from("estoques")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "ativo");
      const produtos = produtosRes.data;

      // Buscar serviços - Simplificado
      const servicosCount = 0; // Temporariamente fixo para evitar erro

      // Buscar receitas
      const receitasRes = await supabase
        .from("lancamentos")
        .select("valor")
        .eq("user_id", userId)
        .eq("tipo", "receita")
        .gte("data", startDate)
        .lte("data", endDate);
      const receitas = receitasRes.data;

      // Buscar despesas
      const despesasRes = await supabase
        .from("lancamentos")
        .select("valor")
        .eq("user_id", userId)
        .eq("tipo", "despesa")
        .gte("data", startDate)
        .lte("data", endDate);
      const despesas = despesasRes.data;

      // Buscar saldos
      const saldosRes = await supabase
        .from("saldos_bancarios")
        .select("saldo")
        .eq("user_id", userId);
      const saldos = saldosRes.data;

      const totalReceitas = receitas?.reduce((sum, r) => sum + (r.valor || 0), 0) || 0;
      const totalDespesas = despesas?.reduce((sum, d) => sum + (d.valor || 0), 0) || 0;
      const saldoBancario = saldos?.reduce((sum, s) => sum + (s.saldo || 0), 0) || 0;
      const pontoEquilibrio = totalDespesas > 0 ? totalDespesas / 0.4 : 0;

      const metrics: DashboardMetrics = {
        pontoEquilibrio,
        qtdeClientes: clientes?.length || 0,
        qtdeFornecedores: fornecedores?.length || 0,
        qtdeFuncionarios: funcionarios?.length || 0,
        qtdeProdutos: produtos?.length || 0,
        qtdeServicos: servicosCount,
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
