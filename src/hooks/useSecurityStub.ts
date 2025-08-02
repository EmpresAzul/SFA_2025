// Temporary stub for security hooks until security tables are created
export const useSecurity = () => ({
  loading: false,
  error: null,
  logSecurityEvent: async () => {},
  getSecurityLogs: async () => [],
  getUserConsents: async () => [],
  recordConsent: async () => {},
  updateConsent: async () => {},
  generateSecurityReport: async () => ({}),
  checkComplianceStatus: async () => ({ status: 'disabled', issues: [] }),
  logLoginAttempt: async (...args: any[]) => {},
  logSuspiciousActivity: async (...args: any[]) => {},
  logDataModification: async (...args: any[]) => {},
  useSecurityEvents: () => ({ data: [], loading: false, error: null, isLoading: false }),
  useIsAdmin: () => false,
  useCurrentUserRole: () => 'user',
  useUserSessions: () => ({ data: [], loading: false }),
  useRevokeSession: () => ({ mutateAsync: async () => {}, mutate: () => {}, isPending: false }),
  useChangePassword: () => ({ mutateAsync: async () => {}, mutate: () => {}, isPending: false }),
  useUserConsents: () => ({ data: 'user', loading: false }),
  useUpdateConsent: () => ({ mutateAsync: async () => {}, mutate: () => {}, isPending: false }),
  useRequestDataDeletion: () => ({ mutateAsync: async () => {}, mutate: () => {}, isPending: false }),
});

export const useSecurityStub = () => ({
  ...useSecurity(),
});

export const useSecurityMonitoring = () => ({
  isMonitoring: false,
  events: [],
  alerts: [],
  startMonitoring: () => {},
  stopMonitoring: () => {},
});

export const useSecurityAlerts = () => ({
  alerts: [],
  loading: false,
  markAsRead: async () => {},
  dismissAlert: async () => {},
  useUserSecurityAlerts: () => ({ data: [], loading: false, error: null, isLoading: false }),
  useAllSecurityAlerts: () => ({ data: [], loading: false, error: null, isLoading: false }),
  useCreateSecurityAlert: () => ({ 
    mutateAsync: async () => {}, 
    mutate: () => {}, 
    isPending: false 
  }),
  useResolveSecurityAlert: () => ({ 
    mutateAsync: async () => {}, 
    mutate: () => {}, 
    isPending: false 
  }),
  useUnresolvedAlertsCount: () => ({ data: 0, loading: false }),
});

export const useSecurityReports = () => ({
  reports: [],
  loading: false,
  generateReport: async () => null,
  downloadReport: async () => {},
});

export const useSecurityScore = () => ({
  score: 0,
  loading: false,
  recommendations: [],
  updateScore: () => {},
});