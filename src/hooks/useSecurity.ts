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

export interface SecurityEventLog {
  id: string;
  user_id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user' | 'moderator';
  assigned_at: string;
  assigned_by?: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  ip_address?: string;
  user_agent?: string;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  last_activity: string;
}

export const useSecurity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Enhanced security event logging
  const logSecurityEvent = async (
    eventType: string, 
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low',
    description: string = '',
    metadata?: Record<string, unknown>
  ) => {
    try {
      const { error } = await supabase.from("security_events").insert({
        user_id: user?.id,
        event_type: eventType,
        severity,
        description,
        metadata: metadata || {},
        ip_address: null, // Would be populated by edge function in production
        user_agent: navigator.userAgent,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao registrar evento de segurança:", error);
    }
  };

  const logLoginAttempt = async (success: boolean, details?: Record<string, unknown>) => {
    await logSecurityEvent(
      success ? "login_success" : "login_failed",
      success ? "low" : "medium",
      success ? "Login realizado com sucesso" : "Falha na tentativa de login",
      { timestamp: new Date().toISOString(), ...details }
    );
  };

  const logLogout = async (details?: Record<string, unknown>) => {
    await logSecurityEvent(
      "logout",
      "low",
      "Usuário realizou logout",
      { timestamp: new Date().toISOString(), ...details }
    );
  };

  const logSuspiciousActivity = useCallback(async (
    activityType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    metadata?: Record<string, unknown>
  ) => {
    try {
      await logSecurityEvent("suspicious_activity", severity, description, {
        activity_type: activityType,
        ...metadata,
      });

      // Se a atividade for de alta severidade, notificar
      if (severity === "high" || severity === "critical") {
        console.warn("Atividade suspeita detectada:", { activityType, severity, description });
      }
    } catch (error) {
      console.error("Erro ao registrar atividade suspeita:", error);
    }
  }, [user?.id]);

  const logDataAccess = async (tableName: string, operation: string, recordId?: string) => {
    await logSecurityEvent(
      "data_access",
      "low",
      `Acesso a dados na tabela ${tableName}`,
      {
        table: tableName,
        operation,
        record_id: recordId,
        timestamp: new Date().toISOString(),
      }
    );
  };

  const logDataModification = async (tableName: string, operation: string, recordId?: string, changes?: Record<string, unknown>) => {
    await logSecurityEvent(
      "data_modification",
      "medium",
      `Modificação de dados na tabela ${tableName}`,
      {
        table: tableName,
        operation,
        record_id: recordId,
        changes,
        timestamp: new Date().toISOString(),
      }
    );
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

  // Role-based access control hooks
  const useUserRoles = () => {
    return useQuery({
      queryKey: ["user_roles"],
      queryFn: async () => {
        if (!user?.id) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;
        return data as UserRole[];
      },
      enabled: !!user?.id,
    });
  };

  const useCurrentUserRole = () => {
    return useQuery({
      queryKey: ["current_user_role"],
      queryFn: async () => {
        if (!user?.id) throw new Error("User not authenticated");

        const { data, error } = await supabase.rpc("get_current_user_role");

        if (error) throw error;
        return data as 'admin' | 'user' | 'moderator' | null;
      },
      enabled: !!user?.id,
    });
  };

  const useIsAdmin = () => {
    const { data: role } = useCurrentUserRole();
    return role === 'admin';
  };

  // Security events monitoring
  const useSecurityEvents = () => {
    return useQuery({
      queryKey: ["security_events"],
      queryFn: async () => {
        if (!user?.id) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("security_events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;
        return data as SecurityEventLog[];
      },
      enabled: !!user?.id,
    });
  };

  // Session management
  const useUserSessions = () => {
    return useQuery({
      queryKey: ["user_sessions"],
      queryFn: async () => {
        if (!user?.id) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("user_sessions")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("last_activity", { ascending: false });

        if (error) throw error;
        return data as UserSession[];
      },
      enabled: !!user?.id,
    });
  };

  const useRevokeSession = () => {
    return useMutation({
      mutationFn: async (sessionId: string) => {
        if (!user?.id) throw new Error("User not authenticated");

        const { error } = await supabase
          .from("user_sessions")
          .update({ is_active: false })
          .eq("id", sessionId)
          .eq("user_id", user.id);

        if (error) throw error;

        await logSecurityEvent(
          "session_revoked",
          "medium",
          "Sessão revogada pelo usuário",
          { session_id: sessionId }
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user_sessions"] });
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

  // Enhanced password security
  const useChangePassword = () => {
    return useMutation({
      mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
        if (!user?.id) throw new Error("User not authenticated");

        // First verify current password by trying to sign in
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: user.email!,
          password: currentPassword,
        });

        if (verifyError) throw new Error("Senha atual incorreta");

        // Update password
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) throw error;

        await logSecurityEvent(
          "password_change",
          "medium",
          "Senha alterada pelo usuário",
          { user_id: user.id }
        );
      },
      onSuccess: () => {
        toast({
          title: "Senha alterada",
          description: "Sua senha foi alterada com sucesso.",
        });
      },
      onError: (error) => {
        toast({
          title: "Erro",
          description: error instanceof Error ? error.message : "Erro ao alterar senha.",
          variant: "destructive",
        });
      },
    });
  };

  return {
    logSecurityEvent,
    logSuspiciousActivity,
    logDataAccess,
    logDataModification,
    logLoginAttempt,
    logLogout,
    useSecurityLogs,
    useUserConsents,
    useUpdateConsent,
    useRequestDataDeletion,
    useUserRoles,
    useCurrentUserRole,
    useIsAdmin,
    useSecurityEvents,
    useUserSessions,
    useRevokeSession,
    useChangePassword,
  };
};
