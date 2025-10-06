import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationSimulator } from "@/hooks/useNotificationSimulator";
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
  
  // Ativar simulador de notificações (apenas para demonstração)
  useNotificationSimulator();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span>Carregando...</span>
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
    if (window.innerWidth >= 768) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <InactivityManager />
      
      {/* Overlay para mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        fixed md:relative 
        z-50 md:z-auto 
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobile={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={handleMenuToggle} />
        <PWAStatusIndicator />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
