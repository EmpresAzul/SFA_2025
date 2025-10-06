import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInputValidation, validateEmail } from "@/hooks/useInputValidation";
import { loginRateLimiter } from "@/utils/inputSanitization";
import { sanitizeSecurityInput } from "@/utils/securityHeaders";
import { useSecurity } from "@/hooks/useSecurity";
import Logo from "./Logo";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    isLimited: boolean;
    remainingAttempts: number;
    resetTime: number | null;
  }>({ isLimited: false, remainingAttempts: 5, resetTime: null });
  console.log('LoginForm: About to call useAuth...');
  const { signIn, user } = useAuth();
  console.log('LoginForm: useAuth called successfully', { user: !!user });
  const navigate = useNavigate();
  const { logLoginAttempt, logSuspiciousActivity } = useSecurity();
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

  // Check rate limiting status
  useEffect(() => {
    const identifier = `login_${email || 'anonymous'}`;
    const isLimited = loginRateLimiter.isRateLimited(identifier);
    const remainingAttempts = loginRateLimiter.getRemainingAttempts(identifier);
    const resetTime = loginRateLimiter.getResetTime(identifier);
    
    setRateLimitInfo({
      isLimited,
      remainingAttempts,
      resetTime
    });
  }, [email]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedEmail = sanitizeSecurityInput(e.target.value.trim());
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

    const identifier = `login_${email}`;
    
    // Check rate limiting
    if (loginRateLimiter.isRateLimited(identifier)) {
      const resetTime = loginRateLimiter.getResetTime(identifier);
      const resetDate = resetTime ? new Date(resetTime) : new Date();
      
      await logSuspiciousActivity(
        'rate_limit_exceeded',
        'high',
        'Usuário excedeu limite de tentativas de login',
        { email, identifier, reset_time: resetTime }
      );
      
      toast({
        title: "Muitas tentativas",
        description: `Aguarde até ${resetDate.toLocaleTimeString()} para tentar novamente.`,
        variant: "destructive",
      });
      return;
    }

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
      const result = await signIn(email, password);
      
      if (result.error) {
        // Log failed attempt
        await logLoginAttempt(false, { 
          email, 
          error: result.error.message,
          identifier 
        });
        
        throw result.error;
      }

      // Log successful attempt
      await logLoginAttempt(true, { email, identifier });
      
      toast({
        title: "Login realizado com êxito!",
        description: "Bem-vindo ao FluxoAzul! Você foi autenticado com sucesso.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      // Update rate limiting info
      const isLimited = loginRateLimiter.isRateLimited(identifier);
      const remainingAttempts = loginRateLimiter.getRemainingAttempts(identifier);
      const resetTime = loginRateLimiter.getResetTime(identifier);
      
      setRateLimitInfo({
        isLimited,
        remainingAttempts,
        resetTime
      });

      toast({
        title: "Erro no login",
        description: `E-mail ou senha incorretos. ${remainingAttempts > 0 ? `${remainingAttempts} tentativas restantes.` : ''}`,
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
      
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="bg-white shadow-2xl border-0 overflow-hidden rounded-lg">
          {/* Header com logo */}
          <div className="bg-white p-6 text-center">
            <div className="mb-4">
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                FluxoAzul
              </h1>
            </div>
          </div>

          <div className="px-6 pb-6">
            <form onSubmit={handleLogin} className="space-y-4">
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
                  className={`h-11 border-2 bg-white text-gray-900 placeholder:text-gray-500 ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } focus:border-blue-500 transition-all duration-200 rounded-lg`}
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
                    className={`h-11 border-2 bg-white text-gray-900 placeholder:text-gray-500 ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    } focus:border-blue-500 transition-all duration-200 rounded-lg pr-12`}
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

              {/* Rate limiting info */}
              {rateLimitInfo.isLimited && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <Shield className="h-4 w-4 text-red-500" />
                  <p className="text-red-700 text-sm">
                    Conta temporariamente bloqueada por segurança. 
                    {rateLimitInfo.resetTime && ` Tente novamente após ${new Date(rateLimitInfo.resetTime).toLocaleTimeString()}.`}
                  </p>
                </div>
              )}
              
              {!rateLimitInfo.isLimited && rateLimitInfo.remainingAttempts < 3 && (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Shield className="h-4 w-4 text-yellow-500" />
                  <p className="text-yellow-700 text-sm">
                    Aviso: {rateLimitInfo.remainingAttempts} tentativas restantes antes do bloqueio temporário.
                  </p>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading || !!errors.email || !!errors.password || rateLimitInfo.isLimited}
                  className="w-full h-11 bg-gradient-to-r from-slate-800 to-blue-600 hover:from-slate-900 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <LogIn size={18} />
                      <span>Entrar no Sistema</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-xs">
                © 2025 FluxoAzul. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
