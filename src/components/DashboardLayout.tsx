import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationSimulator } from "@/hooks/useNotificationSimulator";
import { useResponsiveClasses, usePWAOptimizations } from "@/hooks/useResponsiveDesign";
import Sidebar from "./Sidebar";
import Header from "./Header";
import PWAStatusIndicator from "./PWAStatusIndicator";
import InactivityManager from "./InactivityManager";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const { isMobile, getContainerClass } = useResponsiveClasses();
  const { getPWAClasses } = usePWAOptimizations();
  
  // Ativar simulador de notificações (apenas para demonstração)
  useNotificationSimulator();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${getPWAClasses()}`}>
        <div className="fluxo-card p-6 sm:p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" 
               style={{ borderColor: '#1e3a8a' }}></div>
          <span className="fluxo-heading-sm">Carregando FluxoAzul...</span>
        </div>
      </div>
    );
  }

  // Se não há usuário autenticado, redirecionar para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleMenuToggle = () => {
    // No desktop, colapsa/expande o sidebar
    // No mobile, abre/fecha o menu overlay
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 ${getPWAClasses()} safe-area-inset`}>
      <InactivityManager />
      
      {/* Overlay para mobile - Touch dismiss */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm touch-target"
          onClick={() => setMobileMenuOpen(false)}
          role="button"
          aria-label="Fechar menu"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              setMobileMenuOpen(false);
            }
          }}
        />
      )}

      {/* Sidebar - Mobile slide-in com hardware acceleration */}
      <div className={`
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        fixed md:relative 
        z-50 md:z-auto 
        transition-transform duration-300 ease-out
        will-change-transform
        ${isMobile ? 'shadow-2xl' : ''}
      `}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobile={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main content area - Safe area aware */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={handleMenuToggle} />
        <PWAStatusIndicator />

        {/* Main scrollable content - Smooth scroll */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 smooth-scroll overscroll-contain w-full max-w-full">
          <div className={`${getContainerClass()} py-3 sm:py-4 md:py-6 w-full max-w-full`}>
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
