import type { PWAConfig } from '@/types/pwa';

export const PWA_CONFIG: PWAConfig = {
  name: 'FluxoAzul - Gestão Financeira PME',
  shortName: 'FluxoAzul',
  description: 'Sistema completo de gestão financeira para pequenas e médias empresas',
  themeColor: '#3b82f6',
  backgroundColor: '#1e293b',
  display: 'standalone',
  orientation: 'portrait',
  startUrl: '/',
  scope: '/',
  categories: ['business', 'finance', 'productivity'],
  icons: [
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    },
    {
      src: '/icons/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
      purpose: 'any'
    }
  ]
};

export const CACHE_STRATEGIES = {
  API_CACHE: {
    name: 'supabase-api-cache',
    pattern: /^https:\/\/ugfdngpqehufdhanfsqt\.supabase\.co\/rest\/v1\/.*/i,
    handler: 'NetworkFirst' as const,
    options: {
      cacheName: 'supabase-api-cache',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 // 24 hours
      }
    }
  },
  IMAGES_CACHE: {
    name: 'images-cache',
    pattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    handler: 'CacheFirst' as const,
    options: {
      cacheName: 'images-cache',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
      }
    }
  },
  STATIC_CACHE: {
    name: 'static-cache',
    pattern: /\.(?:js|css|html)$/,
    handler: 'StaleWhileRevalidate' as const,
    options: {
      cacheName: 'static-cache',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
      }
    }
  }
};

export const PWA_SETTINGS = {
  INSTALL_PROMPT: {
    showAfterVisits: 2,
    dismissedExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    delayBeforeShow: 3000 // 3 seconds
  },
  UPDATE_CHECK: {
    checkInterval: 60 * 60 * 1000, // 1 hour
    forceUpdateAfter: 24 * 60 * 60 * 1000 // 24 hours
  },
  OFFLINE: {
    showIndicatorDelay: 1000, // 1 second
    hideIndicatorDelay: 3000 // 3 seconds
  }
};

export const PLATFORM_DETECTION = {
  isIOS: () => /iPad|iPhone|iPod/.test(navigator.userAgent),
  isAndroid: () => /Android/.test(navigator.userAgent),
  isStandalone: () => 
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true,
  isMobile: () => window.innerWidth <= 768,
  isTablet: () => window.innerWidth > 768 && window.innerWidth <= 1024,
  isDesktop: () => window.innerWidth > 1024
};

export const PWA_EVENTS = {
  INSTALL_PROMPT_SHOWN: 'pwa:install-prompt-shown',
  INSTALL_PROMPT_ACCEPTED: 'pwa:install-prompt-accepted',
  INSTALL_PROMPT_DISMISSED: 'pwa:install-prompt-dismissed',
  APP_INSTALLED: 'pwa:app-installed',
  UPDATE_AVAILABLE: 'pwa:update-available',
  UPDATE_APPLIED: 'pwa:update-applied',
  OFFLINE_DETECTED: 'pwa:offline-detected',
  ONLINE_DETECTED: 'pwa:online-detected'
} as const;