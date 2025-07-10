import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export interface SecurityLog {
  id: string;
  user_id: string;
  event_type:
    | "login_success"
    | "login_failed"
    | "logout"
    | "password_change"
    | "data_access"
    | "suspicious_activity";
  ip_address?: string;
  user_agent?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface UserConsent {
  id: string;
  user_id: string;
  consent_type: "data_processing" | "marketing" | "analytics";
  consent_given: boolean;
  consent_date?: string;
  ip_address?: string;
  version: string;
  created_at: string;
  updated_at: string;
}

export interface DataDeletionRequest {
  id: string;
  user_id: string;
  status: "pending" | "processing" | "completed" | "rejected";
  reason?: string;
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
}

export interface SecurityEvent {
  type: string;
  table?: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
}

export interface SuspiciousActivity {
  type: string;
  threshold: number;
  severity?: string;
  details?: Record<string, unknown>;
}

export const useSecurity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Log de evento de segurança
  const logSecurityEvent = async (eventType: string, details?: Record<string, unknown>) => {
    try {
      await supabase.from("security_logs").insert({
        user_id: user?.id,
        event_type: eventType,
        details: details as any, // Cast to Json type
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao registrar evento de segurança:", error);
    }
  };

  const logLoginAttempt = async (success: boolean, details?: Record<string, unknown>) => {
    await logSecurityEvent("login_attempt", {
      success,
      timestamp: new Date().toISOString(),
      ...details,
    });
  };

  const logLogout = async (details?: Record<string, unknown>) => {
    await logSecurityEvent("logout", {
      timestamp: new Date().toISOString(),
      ...details,
    });
  };

  const checkSuspiciousActivity = useCallback(async (activity: SuspiciousActivity) => {
    try {
      const { data, error } = await supabase
        .from("security_logs")
        .insert({
          user_id: user?.id,
          event_type: "suspicious_activity",
          details: {
            activity_type: activity.type,
            severity: activity.severity,
            details: activity.details,
            timestamp: new Date().toISOString(),
          } as any,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Se a atividade for de alta severidade, notificar
      if (activity.severity === "high") {
        console.warn("Atividade suspeita detectada:", activity);
        // Aqui você pode implementar notificações para administradores
      }
    } catch (error) {
      console.error("Erro ao registrar atividade suspeita:", error);
    }
  }, [user?.id]);

  const logDataAccess = async (tableName: string, operation: string, recordId?: string) => {
    await logSecurityEvent("data_access", {
      table: tableName,
      operation,
      record_id: recordId,
      timestamp: new Date().toISOString(),
    });
  };

  const logDataModification = async (tableName: string, operation: string, recordId?: string, changes?: Record<string, unknown>) => {
    await logSecurityEvent("data_modification", {
      table: tableName,
      operation,
      record_id: recordId,
      changes,
      timestamp: new Date().toISOString(),
    });
  };

  // Query para logs de segurança do usuário
  const useSecurityLogs = () => {
    return useQuery({
      queryKey: ["security_logs"],
      queryFn: async () => {
        if (!user?.id) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("security_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        return data as SecurityLog[];
      },
      enabled: !!user?.id,
    });
  };

  // Query para consentimentos do usuário
  const useUserConsents = () => {
    return useQuery({
      queryKey: ["user_consents"],
      queryFn: async () => {
        if (!user?.id) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("user_consents")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;
        return data as UserConsent[];
      },
      enabled: !!user?.id,
    });
  };

  // Mutation para atualizar consentimento
  const useUpdateConsent = () => {
    return useMutation({
      mutationFn: async ({
        consentType,
        consentGiven,
      }: {
        consentType: UserConsent["consent_type"];
        consentGiven: boolean;
      }) => {
        if (!user?.id) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("user_consents")
          .upsert({
            user_id: user.id,
            consent_type: consentType,
            consent_given: consentGiven,
            consent_date: consentGiven ? new Date().toISOString() : null,
            version: "1.0",
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user_consents"] });
        toast({
          title: "Consentimento atualizado",
          description: "Suas preferências de privacidade foram salvas.",
        });
      },
      onError: (error) => {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o consentimento.",
          variant: "destructive",
        });
      },
    });
  };

  // Mutation para solicitar exclusão de dados
  const useRequestDataDeletion = () => {
    return useMutation({
      mutationFn: async (reason?: string) => {
        if (!user?.id) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("data_deletion_requests")
          .insert({
            user_id: user.id,
            reason,
            status: "pending",
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["data_deletion_requests"] });
        toast({
          title: "Solicitação enviada",
          description:
            "Sua solicitação de exclusão de dados foi registrada e será processada em até 30 dias.",
        });
      },
      onError: (error) => {
        toast({
          title: "Erro",
          description: "Erro ao solicitar exclusão: " + (error instanceof Error ? error.message : "Erro desconhecido"),
          variant: "destructive",
        });
      },
    });
  };

  return {
    logSecurityEvent,
    useSecurityLogs,
    useUserConsents,
    useUpdateConsent,
    useRequestDataDeletion,
  };
};
