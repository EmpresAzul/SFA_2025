
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Tentando fazer login com:', email);

    try {
      const success = await login(email, password);
      console.log('Resultado do login:', success);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao FluxoAzul",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Erro no login",
          description: "E-mail ou senha incorretos",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-professional p-4">
      <Card className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl animate-fade-in border border-fluxo-black-200 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-6">
          <Logo size="lg" />
          
          <div className="w-full">
            <h2 className="text-2xl font-bold text-center text-fluxo-black-800 mb-6">
              Entrar no Sistema
            </h2>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-fluxo-black-800 font-medium">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                  className="h-12 border-2 border-fluxo-black-200 focus:border-fluxo-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-fluxo-black-800 font-medium">
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
                    className="h-12 border-2 border-fluxo-black-200 focus:border-fluxo-blue-500 transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fluxo-black-500 hover:text-fluxo-blue-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 gradient-professional hover:gradient-fluxo-light text-white font-semibold text-lg rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn size={20} />
                    <span>Entrar</span>
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
