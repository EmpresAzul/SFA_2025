// Enhanced security enforcement utilities
import { initializeClientSecurity } from './securityHeaders';

interface SecurityPolicy {
  enforceCSP: boolean;
  blockDevTools: boolean;
  preventRightClick: boolean;
  detectScreenRecording: boolean;
  rateLimitRequests: boolean;
}

class SecurityEnforcer {
  private static instance: SecurityEnforcer;
  private policy: SecurityPolicy;
  private isInitialized = false;

  private constructor() {
    this.policy = {
      enforceCSP: !import.meta.env.DEV, // Temporarily disable CSP enforcement in development
      blockDevTools: import.meta.env.PROD,
      preventRightClick: import.meta.env.PROD,
      detectScreenRecording: import.meta.env.PROD,
      rateLimitRequests: true
    };
  }

  public static getInstance(): SecurityEnforcer {
    if (!SecurityEnforcer.instance) {
      SecurityEnforcer.instance = new SecurityEnforcer();
    }
    return SecurityEnforcer.instance;
  }

  public initialize(customPolicy?: Partial<SecurityPolicy>): void {
    if (this.isInitialized) return;

    if (customPolicy) {
      this.policy = { ...this.policy, ...customPolicy };
    }

    console.log('FluxoAzul: Initializing Security Enforcer with policy:', this.policy);

    // Initialize base security
    initializeClientSecurity();

    // Apply enhanced security policies
    this.enforceContentSecurityPolicy();
    this.setupTamperDetection();
    this.initializeRequestRateLimiting();
    
    // Only apply restrictive measures in production
    if (import.meta.env.PROD) {
      this.setupDevToolsDetection();
      this.preventRightClick();
      this.detectScreenRecording();
    }

    this.isInitialized = true;
    console.log('FluxoAzul: Security Enforcer initialized successfully');
  }

  private enforceContentSecurityPolicy(): void {
    if (!this.policy.enforceCSP) return;

    try {
      // Add CSP meta tag if not present
      if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        const csp = document.createElement('meta');
        csp.httpEquiv = 'Content-Security-Policy';
        csp.content = `
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          img-src 'self' data: https: blob:;
          font-src 'self' data: https://fonts.gstatic.com;
          connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.ipify.org;
          frame-src 'none';
          object-src 'none';
        `.replace(/\s+/g, ' ').trim();
        document.head.appendChild(csp);
      }
    } catch (error) {
      console.warn('Failed to enforce CSP:', error);
    }
  }

  private setupDevToolsDetection(): void {
    if (!this.policy.blockDevTools) return;

    let devtools = { open: false, orientation: null };
    
    const threshold = 160;
    
    setInterval(() => {
      try {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        const orientation = widthThreshold ? 'vertical' : 'horizontal';

        if (!(heightThreshold && widthThreshold) &&
            (((window as any).Firebug && (window as any).Firebug.chrome && (window as any).Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)) {
          if (!devtools.open || devtools.orientation !== orientation) {
            devtools.open = true;
            devtools.orientation = orientation;
            
            // Log security event
            console.warn('FluxoAzul: Developer tools detected');
            this.logSecurityEvent('dev_tools_detected', 'medium', 'Developer tools opened');
          }
        } else {
          devtools.open = false;
          devtools.orientation = null;
        }
      } catch (error) {
        // Silently handle errors in dev tools detection
      }
    }, 500);
  }

  private preventRightClick(): void {
    if (!this.policy.preventRightClick) return;

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.logSecurityEvent('context_menu_blocked', 'low', 'Right-click context menu blocked');
    });

    // Prevent common key combinations
    document.addEventListener('keydown', (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        this.logSecurityEvent('dev_shortcuts_blocked', 'low', 'Developer shortcuts blocked');
      }
    });
  }

  private detectScreenRecording(): void {
    if (!this.policy.detectScreenRecording) return;

    // Basic screen recording detection
    let lastScreenCheck = Date.now();
    
    const checkScreenRecording = () => {
      try {
        const now = Date.now();
        const timeDiff = now - lastScreenCheck;
        
        // If time jumps significantly, might indicate screen recording
        if (timeDiff > 5000) {
          this.logSecurityEvent('possible_screen_recording', 'medium', 'Possible screen recording detected');
        }
        
        lastScreenCheck = now;
        
        // Check for common screen recording indicators
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          // This is a basic check - more sophisticated detection would be needed for production
          console.debug('FluxoAzul: Screen capture API available');
        }
      } catch (error) {
        console.debug('Screen recording detection error:', error);
      }
      
      setTimeout(checkScreenRecording, 3000);
    };
    
    checkScreenRecording();
  }

  private setupTamperDetection(): void {
    // Detect DOM tampering
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          Array.from(mutation.addedNodes).forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // Check for suspicious script injections
              if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-allowed')) {
                this.logSecurityEvent('script_injection_detected', 'high', 'Suspicious script injection detected');
                element.remove();
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private initializeRequestRateLimiting(): void {
    if (!this.policy.rateLimitRequests) return;

    const requestCounts = new Map<string, { count: number; resetTime: number }>();
    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      const now = Date.now();
      const windowMs = 60000; // 1 minute
      const maxRequests = 100; // Max requests per minute

      const key = url;
      const current = requestCounts.get(key) || { count: 0, resetTime: now + windowMs };

      if (now > current.resetTime) {
        current.count = 0;
        current.resetTime = now + windowMs;
      }

      current.count++;

      if (current.count > maxRequests) {
        this.logSecurityEvent('rate_limit_exceeded', 'high', `Rate limit exceeded for ${url}`);
        throw new Error('Rate limit exceeded');
      }

      requestCounts.set(key, current);
      return originalFetch(input, init);
    };
  }

  private logSecurityEvent(type: string, severity: string, description: string): void {
    // In a real implementation, this would send to your security logging service
    console.warn(`FluxoAzul Security: ${severity.toUpperCase()} - ${type}: ${description}`);
    
    // Dispatch custom event for security monitoring
    window.dispatchEvent(new CustomEvent('securityEvent', {
      detail: { type, severity, description, timestamp: Date.now() }
    }));
  }

  public updatePolicy(newPolicy: Partial<SecurityPolicy>): void {
    this.policy = { ...this.policy, ...newPolicy };
    console.log('FluxoAzul: Security policy updated:', this.policy);
  }

  public getPolicy(): SecurityPolicy {
    return { ...this.policy };
  }
}

// Export singleton instance
export const securityEnforcer = SecurityEnforcer.getInstance();

// Initialize on module load
export const initializeSecurity = (customPolicy?: Partial<SecurityPolicy>) => {
  securityEnforcer.initialize(customPolicy);
};

// Export types
export type { SecurityPolicy };