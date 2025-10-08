// Force desktop layout in PWA mode

export const forceDesktopLayout = () => {
  // Check if running as PWA
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone === true;

  if (isStandalone) {
    // DISABLED: Allow normal responsive behavior for proper menu
    console.log('PWA: Allowing normal responsive layout for proper menu functionality');
    return;

    // Add desktop-forced class to body
    document.body.classList.add('pwa-desktop-forced');

    // Allow responsive width for proper menu functionality
    document.documentElement.style.width = '100%';
    document.body.style.width = '100%';

    // Override CSS custom properties for desktop behavior
    document.documentElement.style.setProperty('--mobile-breakpoint', '1024px');
    document.documentElement.style.setProperty('--tablet-breakpoint', '1024px');
    document.documentElement.style.setProperty('--desktop-breakpoint', '1024px');

    // Force desktop media queries
    const style = document.createElement('style');
    style.textContent = `
      @media (display-mode: standalone) {
        /* Force all elements to use desktop styles */
        * {
          --tw-breakpoint: 'lg' !important;
        }
        
        /* Override Tailwind's responsive behavior */
        .container {
          max-width: 100% !important;
          padding-left: 2rem !important;
          padding-right: 2rem !important;
        }
        
        /* Force desktop grid behavior */
        [class*="grid-cols-"] {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
        }
        
        /* Force desktop flex behavior */
        [class*="flex-col"] {
          flex-direction: row !important;
        }
        
        /* Force desktop spacing */
        [class*="space-y-"] > * + * {
          margin-top: 0 !important;
          margin-left: 1rem !important;
        }
        
        /* Force desktop text sizes */
        [class*="text-xs"] { font-size: 0.875rem !important; }
        [class*="text-sm"] { font-size: 1rem !important; }
        [class*="text-base"] { font-size: 1.125rem !important; }
        [class*="text-lg"] { font-size: 1.25rem !important; }
        
        /* Force desktop padding/margin */
        [class*="p-2"] { padding: 1rem !important; }
        [class*="p-4"] { padding: 1.5rem !important; }
        [class*="p-6"] { padding: 2rem !important; }
        
        [class*="m-2"] { margin: 1rem !important; }
        [class*="m-4"] { margin: 1.5rem !important; }
        [class*="m-6"] { margin: 2rem !important; }
        
        /* Force desktop button sizes */
        [class*="h-8"] { height: 2.5rem !important; }
        [class*="h-10"] { height: 3rem !important; }
        [class*="h-12"] { height: 3.5rem !important; }
        
        /* Force desktop widths */
        [class*="w-full"] { width: 100% !important; }
        [class*="max-w-"] { max-width: none !important; }
      }
    `;
    document.head.appendChild(style);

    // Allow responsive behavior for proper menu functionality
    const handleResize = () => {
      document.documentElement.style.width = '100%';
      document.body.style.width = '100%';
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Apply immediately

    console.log('PWA: Desktop layout forced');
  }
};

// Initialize on DOM load
export const initializeDesktopLayout = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceDesktopLayout);
  } else {
    forceDesktopLayout();
  }
};

// Auto-initialize
initializeDesktopLayout();