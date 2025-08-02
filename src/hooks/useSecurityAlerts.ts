import { useToast } from '@/hooks/use-toast';

export interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description?: string;
  user_id?: string;
  metadata?: any;
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
}

// Stub implementations for security alerts
export const useUserSecurityAlerts = () => ({
  data: [] as SecurityAlert[],
  loading: false,
  error: null,
});

export const useAllSecurityAlerts = () => ({
  data: [] as SecurityAlert[],
  loading: false,
  error: null,
});

export const useCreateSecurityAlert = () => ({
  mutateAsync: async (alertData: Partial<SecurityAlert>) => {
    console.log('Security alert created (stub):', alertData);
  },
  isPending: false,
});

export const useResolveSecurityAlert = () => {
  const { toast } = useToast();
  
  return {
    mutateAsync: async (id: string) => {
      console.log('Security alert resolved (stub):', id);
      toast({
        title: "Alerta Resolvido",
        description: "O alerta foi marcado como resolvido.",
      });
    },
    isPending: false,
  };
};

export const useUnresolvedAlertsCount = () => ({
  data: 0,
  loading: false,
});

export const createThreatAlert = async (
  title: string,
  description: string,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  userId?: string
) => {
  console.log('Threat alert created (stub):', { title, description, severity, userId });
  return { id: 'stub-alert-id' };
};

// Main hook that exports all alert functionality
export const useSecurityAlerts = () => ({
  alerts: [],
  loading: false,
  markAsRead: async () => {},
  dismissAlert: async () => {},
  useUserSecurityAlerts,
  useAllSecurityAlerts,
  useCreateSecurityAlert,
  useResolveSecurityAlert,
  useUnresolvedAlertsCount,
  createThreatAlert,
});