import { useState, useEffect } from 'react';

interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  screenSize: 'mobile' | 'tablet' | 'desktop' | 'large';
  orientation: 'portrait' | 'landscape';
  isPWA: boolean;
  isStandalone: boolean;
}

/**
 * Hook para gerenciar responsividade unificada
 * Mantém a identidade visual desktop em todas as plataformas
 */
export const useResponsiveDesign = (): BreakpointState => {
  const [breakpointState, setBreakpointState] = useState<BreakpointState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    screenSize: 'desktop',
    orientation: 'landscape',
    isPWA: false,
    isStandalone: false
  });

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Breakpoints baseados no design system
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024 && width < 1440;
      const isLargeDesktop = width >= 1440;
      
      // Determinar tamanho da tela
      let screenSize: 'mobile' | 'tablet' | 'desktop' | 'large' = 'desktop';
      if (isMobile) screenSize = 'mobile';
      else if (isTablet) screenSize = 'tablet';
      else if (isLargeDesktop) screenSize = 'large';
      
      // Orientação
      const orientation = width > height ? 'landscape' : 'portrait';
      
      // Detectar PWA
      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      const isStandalone = (window.navigator as any).standalone === true || isPWA;
      
      setBreakpointState({
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop,
        screenSize,
        orientation,
        isPWA,
        isStandalone
      });
    };

    // Atualizar no carregamento
    updateBreakpoints();

    // Listener para mudanças de tamanho
    window.addEventListener('resize', updateBreakpoints);
    window.addEventListener('orientationchange', updateBreakpoints);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateBreakpoints);
      window.removeEventListener('orientationchange', updateBreakpoints);
    };
  }, []);

  return breakpointState;
};

/**
 * Hook para classes CSS responsivas baseadas no design system
 */
export const useResponsiveClasses = () => {
  const { isMobile, isTablet, screenSize, isStandalone } = useResponsiveDesign();

  const getResponsiveClass = (
    mobile: string,
    tablet?: string,
    desktop?: string,
    large?: string
  ): string => {
    if (isMobile) return mobile;
    if (isTablet && tablet) return tablet;
    if (large && screenSize === 'large') return large;
    return desktop || tablet || mobile;
  };

  const getGridClass = (columns: number): string => {
    if (isMobile) return 'fluxo-grid-1';
    if (isTablet) return columns > 2 ? 'fluxo-grid-2' : `fluxo-grid-${columns}`;
    return `fluxo-grid-${Math.min(columns, 4)}`;
  };

  const getSpacingClass = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'): string => {
    return `fluxo-spacing-${size}`;
  };

  const getContainerClass = (): string => {
    return 'fluxo-container';
  };

  const getCardClass = (variant: 'default' | 'elevated' | 'compact' = 'default'): string => {
    const baseClass = 'fluxo-card';
    
    if (variant === 'elevated') return `${baseClass} shadow-colorful-lg`;
    if (variant === 'compact' && isMobile) return `${baseClass} mobile-card-compact`;
    
    return baseClass;
  };

  const getButtonClass = (
    variant: 'primary' | 'secondary' | 'ghost' = 'primary',
    size: 'sm' | 'md' | 'lg' = 'md'
  ): string => {
    const variantClass = `fluxo-btn-${variant}`;
    const sizeClass = isMobile && size === 'lg' ? 'md' : size;
    
    return `${variantClass} mobile-touch`;
  };

  const getTextClass = (
    level: 'xl' | 'lg' | 'md' | 'sm' | 'body-lg' | 'body-md' | 'body-sm'
  ): string => {
    return `fluxo-${level.includes('body') ? level : `heading-${level}`}`;
  };

  return {
    getResponsiveClass,
    getGridClass,
    getSpacingClass,
    getContainerClass,
    getCardClass,
    getButtonClass,
    getTextClass,
    isMobile,
    isTablet,
    screenSize,
    isStandalone
  };
};

/**
 * Hook para otimizações específicas de PWA
 */
export const usePWAOptimizations = () => {
  const { isPWA, isStandalone, isMobile } = useResponsiveDesign();

  const getPWAClasses = () => {
    const classes = [];
    
    if (isPWA || isStandalone) {
      classes.push('safe-area-top', 'safe-area-bottom');
    }
    
    if (isMobile) {
      classes.push('mobile-touch', 'smooth-scroll');
    }
    
    return classes.join(' ');
  };

  const shouldShowInstallPrompt = () => {
    return !isStandalone && !isPWA;
  };

  const getViewportMeta = () => {
    return {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
      userScalable: 'no',
      viewportFit: 'cover'
    };
  };

  return {
    getPWAClasses,
    shouldShowInstallPrompt,
    getViewportMeta,
    isPWA,
    isStandalone,
    isMobile
  };
};