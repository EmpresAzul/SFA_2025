import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface ActiveSession {
  id: string;
  user_id: string;
  session_token_hash: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
  is_active: boolean;
}

export const useSessionSecurity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's active sessions
  const useActiveSessions = () => {
    return useQuery({
      queryKey: ["active_sessions"],
      queryFn: async () => {
        if (!user?.id) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("active_sessions")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("last_activity", { ascending: false });

        if (error) throw error;
        return data as ActiveSession[];
      },
      enabled: !!user?.id,
      refetchInterval: 30000, // Refresh every 30 seconds
    });
  };

  // Revoke a specific session
  const useRevokeSession = () => {
    return useMutation({
      mutationFn: async (sessionId: string) => {
        if (!user?.id) throw new Error("User not authenticated");

        const { error } = await supabase
          .from("active_sessions")
          .update({ is_active: false })
          .eq("id", sessionId)
          .eq("user_id", user.id);

        if (error) throw error;

        // Log security event
        await supabase.rpc("create_security_alert", {
          alert_type_param: "session_revoked",
          severity_param: "medium",
          title_param: "Sessão Revogada",
          description_param: "Usuário revogou uma sessão ativa",
          user_id_param: user.id,
          metadata_param: { session_id: sessionId }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["active_sessions"] });
        toast({
          title: "Sessão revogada",
          description: "A sessão foi revogada com sucesso.",
        });
      },
      onError: (error) => {
        toast({
          title: "Erro",
          description: "Não foi possível revogar a sessão.",
          variant: "destructive",
        });
      },
    });
  };

  // Revoke all other sessions except current
  const useRevokeOtherSessions = () => {
    return useMutation({
      mutationFn: async () => {
        if (!user?.id) throw new Error("User not authenticated");

        // Get current session hash (simplified approach)
        const currentSession = await supabase.auth.getSession();
        const currentHash = currentSession.data.session?.access_token 
          ? btoa(currentSession.data.session.access_token.substring(0, 20))
          : '';

        const { error } = await supabase
          .from("active_sessions")
          .update({ is_active: false })
          .eq("user_id", user.id)
          .neq("session_token_hash", currentHash);

        if (error) throw error;

        // Log security event
        await supabase.rpc("create_security_alert", {
          alert_type_param: "bulk_session_revoked",
          severity_param: "high",
          title_param: "Todas as Outras Sessões Revogadas",
          description_param: "Usuário revogou todas as outras sessões ativas",
          user_id_param: user.id,
          metadata_param: { action: "revoke_all_others" }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["active_sessions"] });
        toast({
          title: "Sessões revogadas",
          description: "Todas as outras sessões foram revogadas com sucesso.",
        });
      },
      onError: (error) => {
        toast({
          title: "Erro",
          description: "Não foi possível revogar as sessões.",
          variant: "destructive",
        });
      },
    });
  };

  // Clean up expired sessions (admin function)
  const useCleanupSessions = () => {
    return useMutation({
      mutationFn: async () => {
        const { error } = await supabase.rpc("cleanup_expired_sessions");
        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["active_sessions"] });
        toast({
          title: "Limpeza concluída",
          description: "Sessões expiradas foram removidas.",
        });
      },
    });
  };

  return {
    useActiveSessions,
    useRevokeSession,
    useRevokeOtherSessions,
    useCleanupSessions,
  };
};