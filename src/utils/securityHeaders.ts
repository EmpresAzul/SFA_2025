// Security headers and CSP utilities
export const generateCSPNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const getSecurityHeaders = (nonce?: string) => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  ...(nonce && {
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: blob:;
      font-src 'self' data: https://fonts.gstatic.com;
      connect-src 'self' https://*.supabase.co wss://*.supabase.co;
      frame-src 'none';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      upgrade-insecure-requests;
      block-all-mixed-content;
    `.replace(/\s+/g, ' ').trim()
  })
});

// Apply security headers to responses
export const applySecurityHeaders = (response: Response, nonce?: string): Response => {
  const headers = getSecurityHeaders(nonce);
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
};

// Client-side security measures - simplified for development stability
export const initializeClientSecurity = () => {
  try {
    console.log('FluxoAzul: Initializing client security...');
    
    // Only apply in production to avoid blocking development
    if (import.meta.env.PROD) {
      // Basic protection without aggressive blocking
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      console.log('FluxoAzul: Production security measures enabled');
    } else {
      console.log('FluxoAzul: Development mode - security features relaxed');
    }

    // Add basic security meta tags
    const addMetaTag = (name: string, content: string) => {
      try {
        if (!document.querySelector(`meta[name="${name}"]`)) {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          document.head.appendChild(meta);
        }
      } catch (error) {
        console.warn('Failed to add meta tag:', name, error);
      }
    };

    addMetaTag('referrer', 'strict-origin-when-cross-origin');
    
    console.log('FluxoAzul: Client security initialization complete');
  } catch (error) {
    console.error('FluxoAzul: Error initializing client security:', error);
  }
};

// Session security utilities
export const isSecureConnection = (): boolean => {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};

export const validateSessionIntegrity = (sessionData: any): boolean => {
  if (!sessionData || typeof sessionData !== 'object') return false;
  
  // Check for required session properties
  const requiredProps = ['access_token', 'user'];
  return requiredProps.every(prop => prop in sessionData);
};

// Input sanitization for security-critical operations
export const sanitizeSecurityInput = (input: string): string => {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[<>"'&]/g, (match) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match] || match;
    })
    .trim();
};