import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInputValidation, validateEmail } from "@/hooks/useInputValidation";
import { loginRateLimiter } from "@/utils/inputSanitization";
import { sanitizeSecurityInput } from "@/utils/securityHeaders";
import { useSecurity } from "@/hooks/useSecurity";
import { supabase } from "@/integrations/supabase/client";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    isLimited: boolean;
    remainingAttempts: number;
    resetTime: number | null;
  }>({ isLimited: false, remainingAttempts: 5, resetTime: null });
  
  const { signIn, user } = useAuth();
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

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

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
        await logLoginAttempt(false, { 
          email, 
          error: result.error.message,
          identifier 
        });
        
        throw result.error;
      }

      await logLoginAttempt(true, { email, identifier });
      
      toast({
        title: "Login realizado com êxito!",
        description: "Bem-vindo ao FluxoAzul!",
      });
      navigate("/dashboard");
    } catch (error: any) {
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira seu email",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(resetEmail)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }

    setResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado!",
        description: "Link de recuperação enviado! Verifique seu email.",
      });
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description: "Erro ao enviar email. Verifique se o email está cadastrado.",
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen min-h-[100dvh] flex justify-center items-center p-4 sm:p-6 md:p-8"
      style={{ 
        fontFamily: 'Poppins, sans-serif',
        background: 'linear-gradient(135deg, #0a1628 0%, #0f2847 50%, #1a3a5c 100%)'
      }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main container with glassmorphism */}
      <div className="relative w-full max-w-[380px] sm:max-w-[420px] px-6 sm:px-8 py-8 sm:py-10 rounded-2xl sm:rounded-3xl text-center backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        
        {/* Logo */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider">
            FLUXO<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AZUL</span>
          </h1>
          <p className="text-white/50 text-xs sm:text-sm mt-2 font-light">Gestão Financeira Inteligente</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6 bg-transparent">
          {/* Campo E-mail */}
          <div className="relative group">
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full h-12 sm:h-14 px-4 sm:px-5 pr-12 bg-slate-100 backdrop-blur-sm text-gray-900 text-sm sm:text-base border border-slate-300 rounded-xl outline-none transition-all duration-300 placeholder:text-gray-600 focus:bg-slate-50 focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-slate-50"
            />
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none">
              <Lock className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-2 text-left font-medium">{errors.email}</p>
            )}
          </div>

          {/* Campo Senha */}
          <div className="relative group">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={handlePasswordChange}
              required
              className="w-full h-12 sm:h-14 px-4 sm:px-5 pr-12 bg-slate-100 backdrop-blur-sm text-gray-900 text-sm sm:text-base border border-slate-300 rounded-xl outline-none transition-all duration-300 placeholder:text-gray-600 focus:bg-slate-50 focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-slate-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500 transition-colors"
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-400 text-xs mt-2 text-left font-medium">{errors.password}</p>
            )}
          </div>

          {/* Rate limiting */}
          {rateLimitInfo.isLimited && (
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/20 rounded-xl">
              <Shield className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-xs sm:text-sm text-left">
                Bloqueado. {rateLimitInfo.resetTime && `Tente após ${new Date(rateLimitInfo.resetTime).toLocaleTimeString()}.`}
              </p>
            </div>
          )}

          {/* Botão Login */}
          <Button
            type="submit"
            disabled={loading || !!errors.email || !!errors.password || rateLimitInfo.isLimited}
            className="w-full h-12 sm:h-14 mt-2 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 text-white text-sm sm:text-base font-semibold border-0 rounded-xl cursor-pointer transition-all duration-300 shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entrando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Entrar no Sistema
              </span>
            )}
          </Button>
        </form>

        {/* Link Esqueci minha senha */}
        <button
          onClick={() => setShowForgotPassword(true)}
          className="block w-full mt-6 sm:mt-8 text-white/60 text-sm sm:text-base font-medium no-underline transition-all duration-300 hover:text-blue-400 cursor-pointer bg-transparent border-0 hover:tracking-wide"
        >
          Esqueci minha senha
        </button>

        {/* Decorative line */}
        <div className="mt-6 sm:mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>


      </div>

      {/* Dialog Recuperar Senha */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#0f2847]/95 to-[#1a3a5c]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Recuperar Senha
            </DialogTitle>
            <DialogDescription className="text-white/60 font-medium">
              Digite seu email para receber o link de redefinição de senha
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-white/80 font-semibold">
                Email
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="seu@email.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(sanitizeSecurityInput(e.target.value.trim()))}
                className="h-12 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 rounded-xl"
                disabled={resetLoading}
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail("");
                }}
                className="flex-1 h-12 bg-white/5 border border-white/20 text-white hover:bg-white/10 rounded-xl font-semibold"
                disabled={resetLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg"
                disabled={resetLoading}
              >
                {resetLoading ? "Enviando..." : "Enviar Link"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginForm;
