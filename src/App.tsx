
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import RegisterManagement from './pages/RegisterManagement';
import VirtualConsultant from './pages/VirtualConsultant';
import Profile from './pages/Profile';
import LoginForm from './components/LoginForm';
import EstoqueManagement from '@/pages/EstoqueManagement';
import LancamentosFinanceiros from '@/pages/LancamentosFinanceiros';
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
            <Route path="cadastro" element={<RegisterManagement />} />
            <Route path="estoque" element={<EstoqueManagement />} />
            <Route path="lancamentos" element={<LancamentosFinanceiros />} />
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
