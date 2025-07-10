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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-600">
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <Card
          className="bg-white/95 backdrop-blur-xl shadow-2xl border-0 overflow-hidden"
          style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
        >
          {/* Header com logo */}
          <div className="bg-transparent p-6 text-center">
            <div className="flex justify-center mb-2">
              <Logo size="lg" />
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 font-medium text-sm"
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
                  className={`h-11 border-2 ${errors.email ? "border-red-500" : "border-gray-200"} focus:border-blue-500 transition-all duration-200 rounded-xl`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-700 font-medium text-sm"
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
                    className={`h-11 border-2 ${errors.password ? "border-red-500" : "border-gray-200"} focus:border-blue-500 transition-all duration-200 rounded-xl pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !!errors.email || !!errors.password}
                className="w-full h-12 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-600 hover:from-slate-800 hover:via-slate-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
