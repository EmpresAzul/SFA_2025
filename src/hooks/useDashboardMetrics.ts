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

      // Buscar contagem de clientes
      const { data: clientes } = await supabase
        .from("cadastros")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("tipo", "Cliente")
        .eq("status", "ativo");

      // Buscar contagem de fornecedores
      const { data: fornecedores } = await supabase
        .from("cadastros")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("tipo", "Fornecedor")
        .eq("status", "ativo");

      // Buscar contagem de funcionários
      const { data: funcionarios } = await supabase
        .from("cadastros")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("tipo", "Funcionário")
        .eq("status", "ativo");

      // Buscar contagem de produtos no estoque
      console.log("🔍 Buscando produtos no estoque...");
      
      // Primeiro tentar com status "ativo"
      let { data: produtos, error: estoqueError } = await supabase
        .from("estoques")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("status", "ativo");

      // Se não encontrar, tentar com status "A" (como mostrado na imagem)
      if (!produtos || produtos.length === 0) {
        console.log("🔄 Tentando com status 'A'...");
        const { data: produtosA } = await supabase
          .from("estoques")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("status", "A");
        produtos = produtosA;
      }

      // Se ainda não encontrar, tentar tabela no singular
      if (!produtos || produtos.length === 0) {
        console.log("🔄 Tentando tabela 'estoque' (singular)...");
        const { data: produtosSingular } = await supabase
          .from("estoques")
          .select("id")
          .eq("user_id", session.user.id);
        produtos = produtosSingular;
      }

      console.log("✅ Produtos finais encontrados:", produtos?.length || 0);

      // Buscar contagem de serviços na precificação
      const { data: servicos } = await supabase
        .from("precificacao")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("tipo", "Serviço")
        .eq("status", "ativo");

      // Buscar receitas do mês atual
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      const { data: receitas } = await supabase
        .from("lancamentos")
        .select("valor")
        .eq("user_id", session.user.id)
        .eq("tipo", "receita")
        .gte("data", startOfMonth.toISOString().split("T")[0])
        .lte("data", endOfMonth.toISOString().split("T")[0]);

      // Buscar despesas do mês atual
      const { data: despesas } = await supabase
        .from("lancamentos")
        .select("valor")
        .eq("user_id", session.user.id)
        .eq("tipo", "despesa")
        .gte("data", startOfMonth.toISOString().split("T")[0])
        .lte("data", endOfMonth.toISOString().split("T")[0]);

      // Buscar saldos bancários
      const { data: saldosBancarios } = await supabase
        .from("saldos_bancarios")
        .select("saldo")
        .eq("user_id", session.user.id);

      const totalReceitas =
        receitas?.reduce((total, item) => total + (item.valor || 0), 0) || 0;
      const totalDespesas =
        despesas?.reduce((total, item) => total + (item.valor || 0), 0) || 0;
      const saldoBancario =
        saldosBancarios?.reduce(
          (total, item) => total + (item.saldo || 0),
          0,
        ) || 0;

      // Buscar dados de ponto de equilíbrio se existir
        const { data: pontoEquilibrioData } = await supabase
          .from("ponto_equilibrio")
          .select("ponto_equilibrio_calculado")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(1);

      // Usar ponto de equilíbrio calculado ou estimar baseado nas despesas
      const pontoEquilibrio = pontoEquilibrioData?.[0]?.ponto_equilibrio_calculado || 
        (totalDespesas > 0 ? totalDespesas / 0.4 : 0);

      // Usar dados reais do sistema
      const metrics = {
        pontoEquilibrio,
        qtdeClientes: clientes?.length || 0,
        qtdeFornecedores: fornecedores?.length || 0,
        qtdeFuncionarios: funcionarios?.length || 0,
        qtdeProdutos: produtos?.length || 0,
        qtdeServicos: servicos?.length || 0,
        totalReceitasMes: totalReceitas,
        totalDespesasMes: totalDespesas,
        saldoBancario,
      };

      // Debug detalhado para produtos
      console.log("🔍 Debug detalhado dos produtos:");
      console.log("- Dados brutos produtos:", produtos);
      console.log("- Erro estoque:", estoqueError);
      
      // Tentar buscar todos os produtos sem filtro de status para debug
      const { data: todosProdutos } = await supabase
        .from("estoques")
        .select("*")
        .eq("user_id", session.user.id);
      
      console.log("- Todos os produtos (sem filtro status):", todosProdutos);
      console.log("- Total de produtos sem filtro:", todosProdutos?.length || 0);

      console.log("📊 Dados brutos encontrados:");
      console.log("- Clientes:", clientes?.length || 0);
      console.log("- Fornecedores:", fornecedores?.length || 0);
      console.log("- Funcionários:", funcionarios?.length || 0);
      console.log("- Produtos (estoque):", produtos?.length || 0);
      console.log("- Serviços:", servicos?.length || 0);
      console.log("- Receitas do mês:", totalReceitas);
      console.log("- Despesas do mês:", totalDespesas);
      console.log("- Saldo bancário:", saldoBancario);
      console.log("- Ponto de equilíbrio:", pontoEquilibrio);
      
      console.log("📊 Métricas finais:", metrics);
      return metrics;
    },
    enabled: !!session?.user?.id,
  });
};
