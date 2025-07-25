import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();

  console.log('Index: Current state -', { user: !!user, loading });

  // Loading otimizado para produção
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-secondary">
        <div className="flex flex-col items-center space-y-4 text-primary-foreground">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-foreground"></div>
          <span className="text-lg font-medium">FluxoAzul Carregando...</span>
          <p className="text-sm opacity-80">Verificando autenticação</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-6 px-6 py-3 bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-lg transition-colors text-sm font-medium"
          >
            Ir para Login Agora
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
