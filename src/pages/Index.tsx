import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();

  console.log('Index: Current state -', { user: !!user, loading });

  // Mostrar loading enquanto verifica autenticação (máximo 10 segundos)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-600">
        <div className="flex flex-col items-center space-y-4 text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span>Verificando autenticação...</span>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  // Se usuário logado, redirecionar para dashboard
  if (user) {
    console.log('Index: Redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Se não logado, redirecionar para login
  console.log('Index: Redirecting to login');
  return <Navigate to="/login" replace />;
};

export default Index;
