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

  // Monitor for suspicious patterns
  useEffect(() => {
    if (!user) return;

    let rapidClickCount = 0;
    let rapidClickTimer: NodeJS.Timeout;

    const handleRapidClicks = () => {
      rapidClickCount++;
      
      clearTimeout(rapidClickTimer);
      rapidClickTimer = setTimeout(() => {
        if (rapidClickCount > 10) {
          security.logSuspiciousActivity(
            'rapid_clicking',
            'medium',
            'Usuário realizando cliques excessivos',
            { click_count: rapidClickCount, user_id: user.id }
          );
        }
        rapidClickCount = 0;
      }, 5000);
    };

    // Monitor for console access attempts
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('auth') || message.includes('token') || message.includes('password')) {
        security.logSuspiciousActivity(
          'console_access',
          'high',
          'Tentativa de acesso a informações sensíveis via console',
          { message: message.substring(0, 100), user_id: user.id }
        );
      }
      originalConsoleLog.apply(console, args);
    };

    // Monitor for DevTools
    let devtools = { open: false, orientation: null };
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        if (!devtools.open) {
          devtools.open = true;
          security.logSuspiciousActivity(
            'devtools_opened',
            'medium',
            'DevTools detectado como aberto',
            { user_id: user.id, timestamp: Date.now() }
          );
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    document.addEventListener('click', handleRapidClicks);

    return () => {
      document.removeEventListener('click', handleRapidClicks);
      console.log = originalConsoleLog;
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