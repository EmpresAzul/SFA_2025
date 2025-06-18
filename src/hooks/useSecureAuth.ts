
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurity } from '@/hooks/useSecurity';

export const useSecureAuth = () => {
  const { user, session } = useAuth();
  const { logSecurityEvent } = useSecurity();

  useEffect(() => {
    if (user && session) {
      // Log successful login
      logSecurityEvent('login_success', {
        login_time: new Date().toISOString(),
        session_id: session.access_token.substring(0, 10) + '...'
      });

      // Log data access
      logSecurityEvent('data_access', {
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }
  }, [user, session, logSecurityEvent]);

  useEffect(() => {
    // Monitor for suspicious activity patterns
    const handleVisibilityChange = () => {
      if (document.hidden && user) {
        logSecurityEvent('data_access', {
          action: 'tab_hidden',
          timestamp: new Date().toISOString()
        });
      }
    };

    // Monitor for multiple tab usage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'supabase.auth.token' && user) {
        logSecurityEvent('suspicious_activity', {
          action: 'potential_multiple_sessions',
          timestamp: new Date().toISOString()
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, logSecurityEvent]);

  return {
    user,
    session,
    logSecurityEvent
  };
};
