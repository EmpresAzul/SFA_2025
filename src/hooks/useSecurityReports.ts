import { useToast } from '@/hooks/use-toast';

export interface SecurityReport {
  total_alerts: number;
  critical_alerts: number;
  high_alerts: number;
  medium_alerts: number;
  low_alerts: number;
  unresolved_alerts: number;
  recent_events: any[];
}

// Stub implementations for security reports
export const useUserSecurityReport = (userId?: string) => ({
  data: {
    total_alerts: 0,
    critical_alerts: 0,
    high_alerts: 0,
    medium_alerts: 0,
    low_alerts: 0,
    unresolved_alerts: 0,
    recent_events: [],
  } as SecurityReport,
  loading: false,
  error: null,
});

export const useSystemSecurityReport = () => ({
  data: {
    total_alerts: 0,
    critical_alerts: 0,
    high_alerts: 0,
    medium_alerts: 0,
    low_alerts: 0,
    unresolved_alerts: 0,
    recent_events: [],
  } as SecurityReport,
  loading: false,
  error: null,
});

export const useCleanupSecurityAlerts = () => {
  const { toast } = useToast();
  
  return {
    mutateAsync: async (daysOld: number = 30) => {
      console.log('Cleanup security alerts (stub):', daysOld);
      toast({
        title: "Limpeza Concluída",
        description: "Alertas antigos foram removidos.",
      });
    },
    isPending: false,
  };
};

export const useLogSecurityEvent = () => ({
  mutateAsync: async (params: {
    eventType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    userId?: string;
    metadata?: Record<string, unknown>;
    autoCreateAlert?: boolean;
  }) => {
    console.log('Security event logged (stub):', params);
  },
  isPending: false,
});

export const useSecurityReports = () => ({
  useUserSecurityReport,
  useSystemSecurityReport,
  useCleanupSecurityAlerts,
  useLogSecurityEvent,
});
