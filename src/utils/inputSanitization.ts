// Input sanitization utilities for enhanced security

export const sanitizeString = (input: string): string => {
  if (!input) return '';
  
  // Remove HTML tags and encode special characters
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  // Basic email sanitization
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  const cleaned = email.toLowerCase().trim();
  
  return emailRegex.test(cleaned) ? cleaned : '';
};

export const sanitizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters except + at the beginning
  return phone.replace(/(?!^\+)[^\\d]/g, '');
};

export const sanitizeCurrency = (value: string): string => {
  if (!value) return '';
  
  // Keep only digits, decimal point, and comma
  return value.replace(/[^\\d.,]/g, '');
};

export const validateAndSanitizeInput = (
  input: string,
  type: 'text' | 'email' | 'phone' | 'currency' = 'text',
  maxLength = 255
): { sanitized: string; isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  let sanitized = '';
  
  if (!input) {
    errors.push('Campo obrigatório');
    return { sanitized: '', isValid: false, errors };
  }
  
  if (input.length > maxLength) {
    errors.push(`Máximo de ${maxLength} caracteres`);
  }
  
  switch (type) {
    case 'email':
      sanitized = sanitizeEmail(input);
      if (!sanitized) {
        errors.push('Email inválido');
      }
      break;
      
    case 'phone':
      sanitized = sanitizePhoneNumber(input);
      if (sanitized.length < 10) {
        errors.push('Telefone deve ter pelo menos 10 dígitos');
      }
      break;
      
    case 'currency':
      sanitized = sanitizeCurrency(input);
      if (!sanitized || isNaN(parseFloat(sanitized.replace(',', '.')))) {
        errors.push('Valor monetário inválido');
      }
      break;
      
    default:
      sanitized = sanitizeString(input);
      break;
  }
  
  return {
    sanitized,
    isValid: errors.length === 0,
    errors
  };
};

// SQL injection prevention for dynamic queries (should be used server-side)
export const escapeSQLString = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/"/g, '""') // Escape double quotes
    .replace(/\\\\/g, '\\\\\\\\') // Escape backslashes
    .replace(/\\x00/g, '\\\\0') // Escape null bytes
    .replace(/\\n/g, '\\\\n') // Escape newlines
    .replace(/\\r/g, '\\\\r') // Escape carriage returns
    .replace(/\\x1a/g, '\\\\Z'); // Escape ctrl+Z
};

// XSS prevention
export const encodeHTMLEntities = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Rate limiting utilities
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(identifier);
    
    if (!entry) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return false;
    }
    
    if (now > entry.resetTime) {
      // Reset the counter
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return false;
    }
    
    if (entry.count >= this.maxAttempts) {
      return true;
    }
    
    entry.count++;
    return false;
  }
  
  getRemainingAttempts(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry) return this.maxAttempts;
    
    const now = Date.now();
    if (now > entry.resetTime) {
      return this.maxAttempts;
    }
    
    return Math.max(0, this.maxAttempts - entry.count);
  }
  
  getResetTime(identifier: string): number | null {
    const entry = this.attempts.get(identifier);
    if (!entry) return null;
    
    const now = Date.now();
    if (now > entry.resetTime) {
      return null;
    }
    
    return entry.resetTime;
  }
}

// Global rate limiters
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const passwordResetRateLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour
export const apiRateLimiter = new RateLimiter(100, 60 * 1000); // 100 requests per minute

// Content Security Policy helpers
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
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  ...(nonce && {
    'Content-Security-Policy': `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.supabase.co;`
  })
});
