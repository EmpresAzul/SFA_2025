
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fazer logout sempre que acessar a página de login
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        toast({
          title: "Logout realizado com êxito!",
          description: "Você foi desconectado do sistema com segurança.",
        });
      } catch (error) {
        console.error('Erro no logout:', error);
      }
    };

    if (user) {
      handleLogout();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Tentando fazer login com:', email);

    try {
      const success = await login(email, password);
      console.log('Resultado do login:', success);
      
      if (success) {
        toast({
          title: "Login realizado com êxito!",
          description: "Bem-vindo ao FluxoAzul! Você foi autenticado com sucesso.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Erro no login",
          description: "E-mail ou senha incorretos. Verifique suas credenciais.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background com gradiente e elementos decorativos */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20"></div>
        
        {/* Formas geométricas flutuantes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-500/10 rounded-lg rotate-45 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-teal-500/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 right-32 w-12 h-12 bg-pink-500/10 rounded-lg animate-float" style={{animationDelay: '0.5s'}}></div>
        
        {/* Padrão de pontos */}
        <div className="absolute inset-0 opacity-20">
          <svg width="60" height="60" viewBox="0 0 60 60" className="absolute top-20 left-1/4">
            <circle cx="30" cy="30" r="2" fill="currentColor" className="text-blue-400"/>
          </svg>
          <svg width="60" height="60" viewBox="0 0 60 60" className="absolute bottom-40 right-1/3">
            <circle cx="30" cy="30" r="2" fill="currentColor" className="text-purple-400"/>
          </svg>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border-0 overflow-hidden animate-slideInDown">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Logo size="lg" />
              </div>
            </div>
            <h1 className="text-xl font-bold mb-2">Bem-vindo ao FluxoAzul</h1>
            <p className="text-blue-100 text-sm">Gestão financeira inteligente e moderna</p>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                  className="h-11 border-2 border-gray-200 focus:border-blue-500 transition-all duration-200 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                    className="h-11 border-2 border-gray-200 focus:border-blue-500 transition-all duration-200 rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn size={18} />
                    <span>Entrar no Sistema</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Features destacadas */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-600 mb-4">Recursos do sistema:</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600">DRE Automático</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600">Fluxo de Caixa</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                  </div>
                  <p className="text-xs text-gray-600">Métricas</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
