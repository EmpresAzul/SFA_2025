import { useQuery as useReactQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { LancamentoComRelacoes } from "@/types/lancamentos";

export const useLancamentosQuery = () => {
  const { session } = useAuth();

  return useReactQuery({
    queryKey: ["lancamentos", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("Usuário não autenticado");
      }

      console.log("🔍 Buscando lançamentos para user_id:", session.user.id);

      // Primeiro, buscar lançamentos sem joins para verificar se existem
      const { data: simpleData, error: simpleError } = await supabase
        .from("lancamentos")
        .select("*")
        .eq("user_id", session.user.id);

      console.log("📊 Lançamentos encontrados (sem joins):", simpleData?.length || 0);
      if (simpleData && simpleData.length > 0) {
        console.log("📋 Primeiro lançamento:", simpleData[0]);
      }

      // Buscar lançamentos com joins opcionais para clientes e fornecedores
      const { data, error } = await supabase
        .from("lancamentos")
        .select(`
          *,
          cliente:cadastros!cliente_id(id, nome),
          fornecedor:cadastros!fornecedor_id(id, nome)
        `)
        .eq("user_id", session.user.id)
        .order("data", { ascending: false });

      if (error) {
        console.error("❌ Erro ao buscar lançamentos:", error.message);
        console.error("Detalhes:", error);
        throw error;
      }

      console.log("✅ Lançamentos com joins:", data?.length || 0);
      return data as LancamentoComRelacoes[];
    },
    enabled: !!session?.user?.id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
