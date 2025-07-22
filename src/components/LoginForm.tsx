import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInputValidation, validateEmail } from "@/hooks/useInputValidation";
import Logo from "./Logo";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const {
    errors,
    clearFieldError,
    validateForm
  } = useInputValidation({
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email é obrigatório' },
    password: { required: true, minLength: 6, message: 'Senha é obrigatória' }
  });

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedEmail = e.target.value.trim();
    setEmail(sanitizedEmail);
    clearFieldError("email");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedPassword = e.target.value;
    setPassword(sanitizedPassword);
    clearFieldError("password");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const isValid = validateForm({ email, password });
    if (!isValid) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Email inválido", 
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "Login realizado com êxito!",
        description: "Bem-vindo ao FluxoAzul! Você foi autenticado com sucesso.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "E-mail ou senha incorretos. Verifique suas credenciais.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform rotate-12 scale-150"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/3 to-transparent transform -rotate-12 scale-150"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden rounded-2xl">
          {/* Header moderno */}
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm p-8 text-center border-b border-white/10">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                <div className="text-2xl font-bold text-white">F</div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">FluxoAzul</h1>
            <p className="text-blue-100/80 text-sm">Gestão Financeira Inteligente</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-white/90 font-medium text-sm block"
                >
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Digite seu e-mail"
                  required
                  className={`h-12 bg-white/10 backdrop-blur-sm border-2 ${
                    errors.email ? "border-red-400" : "border-white/20"
                  } focus:border-blue-400 focus:bg-white/15 text-white placeholder:text-white/60 transition-all duration-300 rounded-xl`}
                />
                {errors.email && (
                  <p className="text-red-300 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-300 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-white/90 font-medium text-sm block"
                >
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Digite sua senha"
                    required
                    className={`h-12 bg-white/10 backdrop-blur-sm border-2 ${
                      errors.password ? "border-red-400" : "border-white/20"
                    } focus:border-blue-400 focus:bg-white/15 text-white placeholder:text-white/60 transition-all duration-300 rounded-xl pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-300 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-300 rounded-full"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading || !!errors.email || !!errors.password}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <LogIn size={20} />
                      <span>Entrar no Sistema</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-white/60 text-xs">
                © 2025 FluxoAzul. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
