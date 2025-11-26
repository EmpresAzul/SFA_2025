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
        console.log("⚠️ Usuário não autenticado");
        return [];
      }

      console.log("🔍 Buscando lançamentos para user_id:", session.user.id);

      try {
        // Buscar lançamentos sem joins para evitar problemas de performance
        const { data, error } = await supabase
          .from("lancamentos")
          .select("*")
          .eq("user_id", session.user.id)
          .order("data", { ascending: false });

        if (error) {
          console.error("❌ Erro ao buscar lançamentos:", error.message);
          console.error("Código:", error.code);
          console.error("Detalhes:", error.details);
          return [];
        }

        console.log("✅ Lançamentos encontrados:", data?.length || 0);
        
        // Retornar dados sem joins por enquanto
        return (data || []) as LancamentoComRelacoes[];
      } catch (err) {
        console.error("❌ Erro inesperado:", err);
        return [];
      }
    },
    enabled: !!session?.user?.id,
    retry: 1,
    retryDelay: 1000,
    staleTime: 30000, // 30 segundos
    gcTime: 300000, // 5 minutos
  });
};
