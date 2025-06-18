
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-600">
        <div className="flex items-center space-x-2 text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  // Se usuário logado, redirecionar para dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se não logado, redirecionar para login
  return <Navigate to="/login" replace />;
};

export default Index;
