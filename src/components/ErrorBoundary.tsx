import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Atualizar estado para que a próxima renderização mostre a UI de fallback
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Ignorar erros específicos do removeChild que são comuns com Radix UI
    if (
      error.message.includes('removeChild') ||
      error.message.includes('NotFoundError') ||
      error.name === 'NotFoundError'
    ) {
      console.warn('⚠️ Erro de DOM ignorado (removeChild):', error.message);
      // Resetar o estado de erro para continuar renderizando normalmente
      this.setState({ hasError: false, error: null });
      return;
    }

    // Log de outros erros
    console.error('❌ ErrorBoundary capturou um erro:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError && this.state.error) {
      // Verificar se é um erro de removeChild
      if (
        this.state.error.message.includes('removeChild') ||
        this.state.error.message.includes('NotFoundError')
      ) {
        // Não mostrar nada, apenas continuar renderizando
        return this.props.children;
      }

      // Renderizar UI de fallback para outros erros
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Ops! Algo deu errado
              </h2>
              <p className="text-gray-600 mb-4">
                Ocorreu um erro inesperado. Por favor, recarregue a página.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Recarregar Página
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
