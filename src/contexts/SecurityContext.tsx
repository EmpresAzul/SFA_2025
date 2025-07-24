import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSecurity as useSecurityHook } from '@/hooks/useSecurity';
import { loginRateLimiter, validateAndSanitizeInput } from '@/utils/inputSanitization';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityContextType {
  isRateLimited: (identifier: string) => boolean;
  getRemainingAttempts: (identifier: string) => number;
  getResetTime: (identifier: string) => number | null;
  sanitizeInput: typeof validateAndSanitizeInput;
  logSuspiciousActivity: (
    activityType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    metadata?: Record<string, unknown>
  ) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const security = useSecurityHook();

  // Simplified monitoring for stability
  useEffect(() => {
    if (!user || !import.meta.env.PROD) return;

    console.log('FluxoAzul: Security monitoring initialized for user:', user.id);

    // Minimal monitoring in development, full monitoring in production
    let rapidClickCount = 0;
    let rapidClickTimer: NodeJS.Timeout;

    const handleRapidClicks = () => {
      rapidClickCount++;
      
      clearTimeout(rapidClickTimer);
      rapidClickTimer = setTimeout(() => {
        if (rapidClickCount > 20) { // Increased threshold
          security.logSuspiciousActivity(
            'rapid_clicking',
            'low', // Reduced severity
            'Usuário realizando cliques excessivos',
            { click_count: rapidClickCount, user_id: user.id }
          );
        }
        rapidClickCount = 0;
      }, 10000); // Increased window
    };

    document.addEventListener('click', handleRapidClicks);

    return () => {
      document.removeEventListener('click', handleRapidClicks);
      clearTimeout(rapidClickTimer);
    };
  }, [user, security]);

  const isRateLimited = (identifier: string) => {
    return loginRateLimiter.isRateLimited(identifier);
  };

  const getRemainingAttempts = (identifier: string) => {
    return loginRateLimiter.getRemainingAttempts(identifier);
  };

  const getResetTime = (identifier: string) => {
    return loginRateLimiter.getResetTime(identifier);
  };

  const value = {
    isRateLimited,
    getRemainingAttempts,
    getResetTime,
    sanitizeInput: validateAndSanitizeInput,
    logSuspiciousActivity: security.logSuspiciousActivity,
  };

  return <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>;
};