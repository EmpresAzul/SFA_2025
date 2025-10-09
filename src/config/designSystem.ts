/**
 * SISTEMA DE DESIGN FLUXOAZUL - CONFIGURAÇÃO UNIFICADA
 * 
 * Este arquivo centraliza todas as configurações do design system
 * garantindo que todas as versões (Desktop, Mobile, App, PWA) 
 * mantenham a mesma identidade visual
 */

// CORES PRINCIPAIS - IDENTIDADE VISUAL FLUXOAZUL
export const colors = {
  // Cores primárias da marca
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Azul principal
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',  // Azul escuro principal
    950: '#172554'
  },
  
  // Cores secundárias
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',  // Cinza escuro
    900: '#0f172a',  // Preto profissional
    950: '#020617'
  },

  // Cores de status
  success: {
    500: '#10b981',
    600: '#059669',
    700: '#047857'
  },
  
  warning: {
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309'
  },
  
  danger: {
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c'
  },

  // Gradientes da marca
  gradients: {
    primary: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    secondary: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    accent: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    success: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    warning: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    danger: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
  }
};

// TIPOGRAFIA - HIERARQUIA VISUAL CONSISTENTE
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace']
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }]
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
};

// ESPAÇAMENTOS - SISTEMA CONSISTENTE
export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
  '4xl': '6rem'   // 96px
};

// BREAKPOINTS - RESPONSIVIDADE UNIFICADA
export const breakpoints = {
  mobile: '0px',
  tablet: '768px',
  desktop: '1024px',
  large: '1440px',
  xlarge: '1920px'
};

// SOMBRAS - PROFUNDIDADE VISUAL
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  
  // Sombras coloridas da marca
  colorful: '0 10px 25px -5px rgba(30, 58, 138, 0.1), 0 8px 10px -6px rgba(30, 58, 138, 0.05)',
  colorfulLg: '0 20px 25px -5px rgba(30, 58, 138, 0.15), 0 10px 10px -5px rgba(30, 58, 138, 0.08)'
};

// BORDAS E RAIOS
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px'
};

// COMPONENTES - CONFIGURAÇÕES PADRÃO
export const components = {
  button: {
    sizes: {
      sm: {
        padding: '0.5rem 0.75rem',
        fontSize: '0.875rem',
        minHeight: '2rem'
      },
      md: {
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        minHeight: '2.5rem'
      },
      lg: {
        padding: '1rem 1.5rem',
        fontSize: '1.125rem',
        minHeight: '3rem'
      }
    }
  },
  
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem'
    },
    borderRadius: '0.75rem',
    shadow: 'lg'
  },
  
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem'
    },
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem'
  }
};

// ANIMAÇÕES E TRANSIÇÕES
export const animations = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms'
  },
  
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out'
  }
};

// CONFIGURAÇÕES PWA
export const pwa = {
  safeArea: {
    top: 'env(safe-area-inset-top)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
    right: 'env(safe-area-inset-right)'
  },
  
  touchTarget: {
    minSize: '44px'
  },
  
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: 'no',
    viewportFit: 'cover'
  }
};

// EXPORTAR CONFIGURAÇÃO COMPLETA
export const designSystem = {
  colors,
  typography,
  spacing,
  breakpoints,
  shadows,
  borderRadius,
  components,
  animations,
  pwa
};

export default designSystem;