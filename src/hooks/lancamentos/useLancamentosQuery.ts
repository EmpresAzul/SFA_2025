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

      console.log("🔍 useLancamentosQuery: Iniciando busca de lançamentos para usuário:", session.user.id);

      // Primeiro, vamos buscar todos os lançamentos sem joins para debug
      const { data: allLancamentos, error: simpleError } = await supabase
        .from("lancamentos")
        .select("*")
        .eq("user_id", session.user.id);

      console.log("📊 useLancamentosQuery: Lançamentos simples encontrados:", allLancamentos?.length || 0);
      if (allLancamentos && allLancamentos.length > 0) {
        console.log("📋 useLancamentosQuery: Primeiros lançamentos:", allLancamentos.slice(0, 3));
      }

      // Buscar lançamentos sem joins por enquanto para garantir que funcionem
      const { data, error } = await supabase
        .from("lancamentos")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ useLancamentosQuery: Erro ao buscar lançamentos:", error);
        console.error("🔍 useLancamentosQuery: Detalhes do erro:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      console.log("✅ useLancamentosQuery: Lançamentos com joins encontrados:", data?.length || 0);
      if (data && data.length > 0) {
        console.log("📋 useLancamentosQuery: Primeiros 3 lançamentos com joins:", data.slice(0, 3));
      }

      return data as LancamentoComRelacoes[];
    },
    enabled: !!session?.user?.id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
