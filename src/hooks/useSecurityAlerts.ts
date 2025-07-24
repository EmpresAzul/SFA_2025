import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  user_id?: string;
  metadata: Record<string, any>;
  is_resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

export const useSecurityAlerts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get security alerts for current user
  const useUserSecurityAlerts = () => {
    return useQuery({
      queryKey: ["user_security_alerts"],
      queryFn: async () => {
        if (!user?.id) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("security_alerts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        return data as SecurityAlert[];
      },
      enabled: !!user?.id,
    });
  };

  // Get all security alerts (admin only)
  const useAllSecurityAlerts = () => {
    return useQuery({
      queryKey: ["all_security_alerts"],
      queryFn: async () => {
        if (!user?.id) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("security_alerts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;
        return data as SecurityAlert[];
      },
      enabled: !!user?.id,
    });
  };

  // Create security alert
  const useCreateSecurityAlert = () => {
    return useMutation({
      mutationFn: async ({
        alertType,
        severity,
        title,
        description,
        userId,
        metadata = {}
      }: {
        alertType: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        title: string;
        description: string;
        userId?: string;
        metadata?: Record<string, any>;
      }) => {
        const { data, error } = await supabase.rpc("create_security_alert", {
          alert_type_param: alertType,
          severity_param: severity,
          title_param: title,
          description_param: description,
          user_id_param: userId || user?.id,
          metadata_param: metadata
        });

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user_security_alerts"] });
        queryClient.invalidateQueries({ queryKey: ["all_security_alerts"] });
      },
    });
  };

  // Resolve security alert (admin only)
  const useResolveSecurityAlert = () => {
    return useMutation({
      mutationFn: async (alertId: string) => {
        if (!user?.id) throw new Error("User not authenticated");

        const { error } = await supabase
          .from("security_alerts")
          .update({
            is_resolved: true,
            resolved_by: user.id,
            resolved_at: new Date().toISOString()
          })
          .eq("id", alertId);

        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user_security_alerts"] });
        queryClient.invalidateQueries({ queryKey: ["all_security_alerts"] });
        toast({
          title: "Alerta resolvido",
          description: "O alerta de segurança foi marcado como resolvido.",
        });
      },
      onError: (error) => {
        toast({
          title: "Erro",
          description: "Não foi possível resolver o alerta.",
          variant: "destructive",
        });
      },
    });
  };

  // Get unresolved alerts count
  const useUnresolvedAlertsCount = () => {
    return useQuery({
      queryKey: ["unresolved_alerts_count"],
      queryFn: async () => {
        if (!user?.id) throw new Error("User not authenticated");

        const { count, error } = await supabase
          .from("security_alerts")
          .select("*", { count: 'exact', head: true })
          .eq("user_id", user.id)
          .eq("is_resolved", false);

        if (error) throw error;
        return count || 0;
      },
      enabled: !!user?.id,
      refetchInterval: 30000, // Refresh every 30 seconds
    });
  };

  // Create threat detection alert
  const createThreatAlert = async (
    threatType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    metadata: Record<string, any> = {}
  ) => {
    return supabase.rpc("create_security_alert", {
      alert_type_param: `threat_${threatType}`,
      severity_param: severity,
      title_param: `Ameaça Detectada: ${threatType}`,
      description_param: description,
      user_id_param: user?.id,
      metadata_param: {
        ...metadata,
        timestamp: Date.now(),
        user_agent: navigator.userAgent,
        page_url: window.location.href
      }
    });
  };

  return {
    useUserSecurityAlerts,
    useAllSecurityAlerts,
    useCreateSecurityAlert,
    useResolveSecurityAlert,
    useUnresolvedAlertsCount,
    createThreatAlert,
  };
};