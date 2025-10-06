import { useEffect, useCallback } from 'react';
import { useSecurity } from '@/hooks/useSecurity';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurityAlerts } from '@/hooks/useSecurityAlerts';

interface SecurityEvent {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata?: Record<string, unknown>;
}

export const useSecurityMonitoring = () => {
  const { user } = useAuth();
  const { logSuspiciousActivity } = useSecurity();
  const { createThreatAlert } = useSecurityAlerts();

  // Monitor for suspicious patterns with enhanced threat detection
  const monitorSuspiciousActivity = useCallback(async (event: SecurityEvent) => {
    // Log traditional security event
    await logSuspiciousActivity(event.type, event.severity, event.description, {
      ...event.metadata,
      user_id: user?.id,
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
      page_url: window.location.href,
    });
    
    // Create threat alert for high/critical severity events
    if (event.severity === 'high' || event.severity === 'critical') {
      await createThreatAlert(
        event.type,
        event.description,
        event.severity,
        user?.id
      );
    }
  }, [user?.id, logSuspiciousActivity, createThreatAlert]);

  // Monitor for rapid navigation
  useEffect(() => {
    if (!user) return;

    let navigationCount = 0;
    let navigationTimer: NodeJS.Timeout;
    let lastNavigationTime = Date.now();

    const handleNavigation = () => {
      navigationCount++;
      const now = Date.now();
      
      if (now - lastNavigationTime < 1000) { // Less than 1 second between navigations
        clearTimeout(navigationTimer);
        navigationTimer = setTimeout(() => {
          if (navigationCount > 5) {
            monitorSuspiciousActivity({
              type: 'rapid_navigation',
              severity: 'medium',
              description: 'Usuário navegando muito rapidamente entre páginas',
              metadata: { navigation_count: navigationCount }
            });
          }
          navigationCount = 0;
        }, 5000);
      }
      
      lastNavigationTime = now;
    };

    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      clearTimeout(navigationTimer);
    };
  }, [user, monitorSuspiciousActivity]);

  // Monitor for unusual form interactions
  useEffect(() => {
    if (!user) return;

    let formFillTime: Record<string, number> = {};
    let unusualBehaviorCount = 0;

    const handleFormFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const fieldId = target.id || target.name || 'unknown';
        formFillTime[fieldId] = Date.now();
      }
    };

    const handleFormBlur = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const fieldId = target.id || target.name || 'unknown';
        const startTime = formFillTime[fieldId];
        
        if (startTime) {
          const fillTime = Date.now() - startTime;
          
          // Detect suspiciously fast form filling (less than 100ms)
          if (fillTime < 100 && target.value.length > 5) {
            unusualBehaviorCount++;
            
            if (unusualBehaviorCount > 3) {
              monitorSuspiciousActivity({
                type: 'automated_form_filling',
                severity: 'high',
                description: 'Possível preenchimento automatizado de formulários detectado',
                metadata: { 
                  field_id: fieldId, 
                  fill_time: fillTime,
                  behavior_count: unusualBehaviorCount 
                }
              });
            }
          }
          
          delete formFillTime[fieldId];
        }
      }
    };

    document.addEventListener('focusin', handleFormFocus);
    document.addEventListener('focusout', handleFormBlur);

    return () => {
      document.removeEventListener('focusin', handleFormFocus);
      document.removeEventListener('focusout', handleFormBlur);
    };
  }, [user, monitorSuspiciousActivity]);

  // Monitor for tab visibility changes (potential session hijacking)
  useEffect(() => {
    if (!user) return;

    let hiddenTime = 0;
    let visibilityTimer: NodeJS.Timeout;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenTime = Date.now();
      } else if (hiddenTime > 0) {
        const timeHidden = Date.now() - hiddenTime;
        
        // If tab was hidden for more than 30 minutes, it might be suspicious
        if (timeHidden > 30 * 60 * 1000) {
          monitorSuspiciousActivity({
            type: 'long_session_hidden',
            severity: 'medium',
            description: 'Sessão ficou oculta por período prolongado',
            metadata: { hidden_duration: timeHidden }
          });
        }
        
        hiddenTime = 0;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(visibilityTimer);
    };
  }, [user, monitorSuspiciousActivity]);

  // Monitor for multiple failed API requests (potential attack)
  useEffect(() => {
    if (!user) return;

    let failedRequestCount = 0;
    let requestTimer: NodeJS.Timeout;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      if (!response.ok && response.status >= 400) {
        failedRequestCount++;
        
        clearTimeout(requestTimer);
        requestTimer = setTimeout(() => {
          if (failedRequestCount > 10) {
            monitorSuspiciousActivity({
              type: 'multiple_failed_requests',
              severity: 'high',
              description: 'Múltiplas requisições com falha detectadas',
              metadata: { 
                failed_count: failedRequestCount,
                last_status: response.status,
                url: args[0]?.toString().substring(0, 100)
              }
            });
          }
          failedRequestCount = 0;
        }, 60000); // Reset after 1 minute
      }
      
      return response;
    };

    return () => {
      window.fetch = originalFetch;
      clearTimeout(requestTimer);
    };
  }, [user, monitorSuspiciousActivity]);

  return {
    monitorSuspiciousActivity,
  };
};