import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import PWAInstallPrompt from "./components/pwa/PWAInstallPrompt";
import OfflineIndicator from "./components/pwa/OfflineIndicator";
import UpdateNotification from "./components/pwa/UpdateNotification";
import { ProfileProvider } from "./contexts/ProfileContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { useSystemNotifications } from "./hooks/useSystemNotifications";
import { useSecurityMonitoring } from "./hooks/useSecurityMonitoring";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LancamentosFinanceiros from "./pages/LancamentosFinanceiros";
import FluxoCaixa from "./pages/FluxoCaixa";
import DRE from "./pages/DRE";
import Precificacao from "./pages/Precificacao";
import EstoqueManagement from "./pages/EstoqueManagement";
import CadastrosUnified from "./pages/CadastrosUnified";
import SaldosBancarios from "./pages/SaldosBancarios";
import Lembretes from "./pages/Lembretes";
import PontoEquilibrio from "./pages/PontoEquilibrio";
import Suporte from "./pages/Suporte";

import Profile from "./pages/Profile";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import AdminSettings from "./pages/AdminSettings";
import Pipeline from "./pages/Pipeline";

// Componente para inicializar notificações do sistema
const SystemNotificationManager = () => {
  useSystemNotifications();
  return null;
};

// Security monitoring component - temporarily disabled
const SecurityMonitor: React.FC = () => {
  // useSecurityMonitoring(); // Temporarily disabled
  return null;
};

// Componente wrapper para rotas autenticadas
const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => (
  <ProfileProvider>
    <NotificationProvider>
      <SystemNotificationManager />
      <SecurityMonitor />
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </NotificationProvider>
  </ProfileProvider>
);

const App = () => (
  <>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <AuthenticatedRoute>
            <Dashboard />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/dashboard/perfil"
        element={
          <AuthenticatedRoute>
            <Profile />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/dashboard/configuracoes"
        element={
          <AuthenticatedRoute>
            <Configuracoes />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/lancamentos"
        element={
          <AuthenticatedRoute>
            <LancamentosFinanceiros />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/fluxo-caixa"
        element={
          <AuthenticatedRoute>
            <FluxoCaixa />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/dre"
        element={
          <AuthenticatedRoute>
            <DRE />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/precificacao"
        element={
          <AuthenticatedRoute>
            <Precificacao />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/estoque"
        element={
          <AuthenticatedRoute>
            <EstoqueManagement />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/cadastros"
        element={
          <AuthenticatedRoute>
            <CadastrosUnified />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/pipeline"
        element={
          <AuthenticatedRoute>
            <Pipeline />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/saldos-bancarios"
        element={
          <AuthenticatedRoute>
            <SaldosBancarios />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/lembretes"
        element={
          <AuthenticatedRoute>
            <Lembretes />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/ponto-equilibrio"
        element={
          <AuthenticatedRoute>
            <PontoEquilibrio />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/suporte"
        element={
          <AuthenticatedRoute>
            <Suporte />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AuthenticatedRoute>
            <AdminSettings />
          </AuthenticatedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* PWA Components */}
      <OfflineIndicator />
      <PWAInstallPrompt />
      <UpdateNotification />
      
      <Toaster />
  </>
);

export default App;
