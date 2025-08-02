import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurity } from '@/hooks/useSecurity';
import { useSecurityAlerts } from '@/hooks/useSecurityAlerts';

interface DeviceFingerprint {
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  cookieEnabled: boolean;
  onlineStatus: boolean;
}

interface GeographicInfo {
  ip?: string;
  estimatedLocation?: string;
  timezone: string;
}

export const useAdvancedSecurity = () => {
  const { user } = useAuth();
  const { logSuspiciousActivity } = useSecurity();
  const { useCreateSecurityAlert } = useSecurityAlerts();
  const createAlert = useCreateSecurityAlert();

  // Generate device fingerprint
  const generateDeviceFingerprint = useCallback((): DeviceFingerprint => {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
    };
  }, []);

  // Detect geographic anomalies
  const detectGeographicAnomaly = useCallback(async () => {
    if (!user) return;

    try {
      const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const storedTimezone = localStorage.getItem('user_timezone');
      
      if (storedTimezone && storedTimezone !== currentTimezone) {
        const timezoneChanged = new Date().getTime() - parseInt(localStorage.getItem('timezone_last_check') || '0') > 24 * 60 * 60 * 1000;
        
        if (timezoneChanged) {
          logSuspiciousActivity(
            'geographic_anomaly',
            'medium',
            'Possível mudança de localização detectada',
            {
              previous_timezone: storedTimezone,
              current_timezone: currentTimezone,
              user_id: user.id,
              timestamp: Date.now()
            }
          );

          createAlert.mutateAsync({
            alert_type: 'geographic_anomaly',
            severity: 'medium',
            title: 'Mudança de Localização Detectada',
            description: `Login detectado de timezone diferente: ${currentTimezone} (anterior: ${storedTimezone})`,
            user_id: user.id,
            metadata: {
              previous_timezone: storedTimezone,
              current_timezone: currentTimezone,
              device_fingerprint: generateDeviceFingerprint()
            }
          });
        }
      }
      
      localStorage.setItem('user_timezone', currentTimezone);
      localStorage.setItem('timezone_last_check', Date.now().toString());
    } catch (error) {
      console.error('Error detecting geographic anomaly:', error);
    }
  }, [user, logSuspiciousActivity, createAlert, generateDeviceFingerprint]);

  // Monitor device fingerprint changes
  const monitorDeviceFingerprint = useCallback(() => {
    if (!user) return;

    try {
      const currentFingerprint = generateDeviceFingerprint();
      const storedFingerprint = localStorage.getItem('device_fingerprint');
      
      if (storedFingerprint) {
        const stored = JSON.parse(storedFingerprint);
        
        // Check for significant changes
        const significantChanges = [
          currentFingerprint.userAgent !== stored.userAgent,
          currentFingerprint.platform !== stored.platform,
          currentFingerprint.screenResolution !== stored.screenResolution
        ].filter(Boolean).length;

        if (significantChanges >= 2) {
          logSuspiciousActivity(
            'device_fingerprint_change',
            'high',
            'Mudança significativa detectada no dispositivo',
            {
              previous_fingerprint: stored,
              current_fingerprint: currentFingerprint,
              changes_count: significantChanges,
              user_id: user.id
            }
          );

          createAlert.mutateAsync({
            alert_type: 'device_change',
            severity: 'high',
            title: 'Dispositivo Diferente Detectado',
            description: 'Login de dispositivo com características diferentes do habitual',
            user_id: user.id,
            metadata: {
              previous_fingerprint: stored,
              current_fingerprint: currentFingerprint,
              changes_count: significantChanges
            }
          });
        }
      }
      
      localStorage.setItem('device_fingerprint', JSON.stringify(currentFingerprint));
    } catch (error) {
      console.error('Error monitoring device fingerprint:', error);
    }
  }, [user, logSuspiciousActivity, createAlert, generateDeviceFingerprint]);

  // Monitor for suspicious patterns
  const monitorSuspiciousPatterns = useCallback(() => {
    if (!user) return;

    let rapidActionCount = 0;
    let lastActionTime = Date.now();
    
    const handleUserAction = (event: Event) => {
      const now = Date.now();
      const timeDiff = now - lastActionTime;
      
      if (timeDiff < 100) { // Less than 100ms between actions
        rapidActionCount++;
        
        if (rapidActionCount > 15) { // More than 15 rapid actions
          logSuspiciousActivity(
            'rapid_actions',
            'medium',
            'Padrão de ações muito rápidas detectado',
            {
              action_count: rapidActionCount,
              time_window: '10 seconds',
              user_id: user.id,
              event_type: event.type
            }
          );
          
          rapidActionCount = 0; // Reset counter
        }
      } else {
        rapidActionCount = 0; // Reset if actions are not rapid
      }
      
      lastActionTime = now;
    };

    // Monitor clicks and key presses
    document.addEventListener('click', handleUserAction);
    document.addEventListener('keydown', handleUserAction);
    
    return () => {
      document.removeEventListener('click', handleUserAction);
      document.removeEventListener('keydown', handleUserAction);
    };
  }, [user, logSuspiciousActivity]);

  // Monitor IP address changes (basic client-side detection)
  const monitorIPChanges = useCallback(async () => {
    if (!user) return;

    try {
      // This is a basic implementation - in production you'd want to use a more reliable IP detection service
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      const currentIP = data.ip;
      
      const storedIP = localStorage.getItem('user_ip');
      
      if (storedIP && storedIP !== currentIP) {
        logSuspiciousActivity(
          'ip_address_change',
          'low',
          'Mudança de endereço IP detectada',
          {
            previous_ip: storedIP,
            current_ip: currentIP,
            user_id: user.id,
            timestamp: Date.now()
          }
        );
      }
      
      localStorage.setItem('user_ip', currentIP);
    } catch (error) {
      console.error('Error monitoring IP changes:', error);
    }
  }, [user, logSuspiciousActivity]);

  // Initialize advanced security monitoring
  useEffect(() => {
    if (!user) return;

    const initializeAdvancedSecurity = async () => {
      try {
        await Promise.all([
          detectGeographicAnomaly(),
          monitorDeviceFingerprint(),
          monitorIPChanges()
        ]);
        
        const cleanupPatterns = monitorSuspiciousPatterns();
        
        return cleanupPatterns;
      } catch (error) {
        console.error('Error initializing advanced security:', error);
      }
    };

    const cleanup = initializeAdvancedSecurity();
    
    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
    };
  }, [user, detectGeographicAnomaly, monitorDeviceFingerprint, monitorIPChanges, monitorSuspiciousPatterns]);

  // Periodic security checks
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      await Promise.all([
        detectGeographicAnomaly(),
        monitorIPChanges()
      ]);
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [user, detectGeographicAnomaly, monitorIPChanges]);

  return {
    generateDeviceFingerprint,
    detectGeographicAnomaly,
    monitorDeviceFingerprint,
    monitorSuspiciousPatterns,
    monitorIPChanges
  };
};