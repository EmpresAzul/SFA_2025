import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Log error details for debugging
    if (typeof window !== 'undefined') {
      const errorDetails = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      console.error('FluxoAzul Error Details:', errorDetails);
      
      // Store error in localStorage for debugging
      try {
        localStorage.setItem('fluxoazul_last_error', JSON.stringify(errorDetails));
      } catch (e) {
        console.error('Could not store error in localStorage:', e);
      }
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleClearStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      this.handleReload();
    } catch (e) {
      console.error('Could not clear storage:', e);
      this.handleReload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-600 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-16 h-16 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Ops! Algo deu errado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center">
                Encontramos um problema inesperado. Tente recarregar a página ou limpar os dados do aplicativo.
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={this.handleReload}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recarregar Página
                </Button>
                
                <Button 
                  onClick={this.handleClearStorage}
                  className="w-full"
                  variant="outline"
                >
                  Limpar Dados e Recarregar
                </Button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Detalhes do erro (desenvolvimento)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;