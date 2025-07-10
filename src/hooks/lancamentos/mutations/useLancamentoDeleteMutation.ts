import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLancamentoDeleteMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log("useLancamentoDeleteMutation: Excluindo lançamento:", id);

      const { error } = await supabase
        .from("lancamentos")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(
          "useLancamentoDeleteMutation: Erro ao excluir lançamento:",
          error,
        );
        throw error;
      }

      console.log("useLancamentoDeleteMutation: Lançamento excluído com sucesso");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lancamentos"] });
      toast({
        title: "Sucesso",
        description: "Lançamento excluído com sucesso!",
      });
    },
    onError: (error: unknown) => {
      console.error(
        "useLancamentoDeleteMutation: Erro ao excluir lançamento:",
        error,
      );
      const errorMessage = error instanceof Error ? error.message : "Erro ao excluir lançamento. Tente novamente.";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};