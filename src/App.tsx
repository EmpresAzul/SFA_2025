
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import VirtualConsultant from './pages/VirtualConsultant';
import Profile from './pages/Profile';
import LoginForm from './components/LoginForm';
import EstoqueManagement from '@/pages/EstoqueManagement';
import LancamentosFinanceiros from '@/pages/LancamentosFinanceiros';
import SaldosBancarios from '@/pages/SaldosBancarios';
import FluxoCaixa from '@/pages/FluxoCaixa';
import DRE from '@/pages/DRE';
import Precificacao from '@/pages/Precificacao';
import CadastrosUnified from '@/pages/CadastrosUnified';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const DashboardLayoutWrapper = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayoutWrapper />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dre" element={<DRE />} />
            <Route path="precificacao" element={<Precificacao />} />
            <Route path="estoque" element={<EstoqueManagement />} />
            <Route path="lancamentos" element={<LancamentosFinanceiros />} />
            <Route path="saldos-bancarios" element={<SaldosBancarios />} />
            <Route path="fluxo-caixa" element={<FluxoCaixa />} />
            <Route path="cadastros" element={<CadastrosUnified />} />
            <Route path="consultor-virtual" element={<VirtualConsultant />} />
            <Route path="perfil" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
