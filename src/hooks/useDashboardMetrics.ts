
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardMetrics = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['dashboard-metrics', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      
      console.log('🔍 Buscando métricas do dashboard...');
      
      // Buscar contagem de clientes
      const { data: clientes } = await supabase
        .from('cadastros')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('tipo', 'Cliente')
        .eq('status', 'ativo');

      // Buscar contagem de fornecedores
      const { data: fornecedores } = await supabase
        .from('cadastros')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('tipo', 'Fornecedor')
        .eq('status', 'ativo');

      // Buscar contagem de produtos
      const { data: produtos } = await supabase
        .from('precificacao')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('tipo', 'Produto')
        .eq('status', 'ativo');

      // Buscar contagem de serviços
      const { data: servicos } = await supabase
        .from('precificacao')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('tipo', 'Serviço')
        .eq('status', 'ativo');

      // Buscar receitas do mês atual
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      const { data: receitas } = await supabase
        .from('lancamentos')
        .select('valor')
        .eq('user_id', session.user.id)
        .eq('tipo', 'receita')
        .gte('data', startOfMonth.toISOString().split('T')[0])
        .lte('data', endOfMonth.toISOString().split('T')[0]);

      // Buscar despesas do mês atual
      const { data: despesas } = await supabase
        .from('lancamentos')
        .select('valor')
        .eq('user_id', session.user.id)
        .eq('tipo', 'despesa')
        .gte('data', startOfMonth.toISOString().split('T')[0])
        .lte('data', endOfMonth.toISOString().split('T')[0]);

      // Buscar saldos bancários
      const { data: saldosBancarios } = await supabase
        .from('saldos_bancarios')
        .select('saldo')
        .eq('user_id', session.user.id);

      const totalReceitas = receitas?.reduce((total, item) => total + (item.valor || 0), 0) || 0;
      const totalDespesas = despesas?.reduce((total, item) => total + (item.valor || 0), 0) || 0;
      const saldoBancario = saldosBancarios?.reduce((total, item) => total + (item.saldo || 0), 0) || 0;
      
      // Calcular ponto de equilíbrio simples (usando despesas como base de custos fixos)
      // Para um cálculo mais preciso, o usuário deve usar a página dedicada de Ponto de Equilíbrio
      const margemContribuicaoEstimada = 0.4; // 40% de margem estimada
      const pontoEquilibrio = totalDespesas > 0 ? totalDespesas / margemContribuicaoEstimada : 0;

      const metrics = {
        pontoEquilibrio,
        qtdeClientes: clientes?.length || 0,
        qtdeFornecedores: fornecedores?.length || 0,
        qtdeProdutos: produtos?.length || 0,
        qtdeServicos: servicos?.length || 0,
        totalReceitasMes: totalReceitas,
        totalDespesasMes: totalDespesas,
        saldoBancario
      };

      console.log('📊 Métricas calculadas:', metrics);
      return metrics;
    },
    enabled: !!session?.user?.id,
  });
};
