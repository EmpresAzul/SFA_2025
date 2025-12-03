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
    <div className="min-h-screen flex justify-center items-center bg-[#172a5a]" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="w-[350px] px-[30px] py-[40px] bg-white/15 rounded-[20px] border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-[10px] text-center">
        
        {/* Logo */}
        <div className="mb-[30px]">
          <h1 className="text-white text-[2.2rem] font-bold" style={{ letterSpacing: '1px' }}>
            FLUXO<span className="text-[#4A90E2]">AZUL</span>
          </h1>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin}>
          {/* Campo E-mail */}
          <div className="relative mb-5">
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full px-[15px] pr-[40px] py-3 bg-transparent text-white text-base border-0 border-b-2 border-white/30 rounded-none outline-none transition-all duration-300 placeholder:text-white/60 focus:border-white/60 focus:shadow-none"
            />
            <div className="absolute top-1/2 right-[15px] transform -translate-y-1/2 pointer-events-none">
              <Lock className="w-5 h-5 text-white/60" />
            </div>
            {errors.email && (
              <p className="text-red-300 text-xs mt-1 text-left">{errors.email}</p>
            )}
          </div>

          {/* Campo Senha */}
          <div className="relative mb-5">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={handlePasswordChange}
              required
              className="w-full px-[15px] pr-[40px] py-3 bg-transparent text-white text-base border-0 border-b-2 border-white/30 rounded-none outline-none transition-all duration-300 placeholder:text-white/60 focus:border-white/60 focus:shadow-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-[15px] transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? (
                <Eye className="w-5 h-5 text-white/60" />
              ) : (
                <EyeOff className="w-5 h-5 text-white/60" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-300 text-xs mt-1 text-left">{errors.password}</p>
            )}
          </div>

          {/* Rate limiting */}
          {rateLimitInfo.isLimited && (
            <div className="flex items-center gap-2 p-2 mb-4 bg-red-500/20 border border-red-400/30 rounded-lg">
              <Shield className="w-4 h-4 text-red-300" />
              <p className="text-red-200 text-xs text-left">
                Bloqueado. {rateLimitInfo.resetTime && `Tente após ${new Date(rateLimitInfo.resetTime).toLocaleTimeString()}.`}
              </p>
            </div>
          )}

          {/* Botão Login */}
          <Button
            type="submit"
            disabled={loading || !!errors.email || !!errors.password || rateLimitInfo.isLimited}
            className="w-full py-3 mt-[15px] bg-gradient-to-r from-[#4A90E2] to-[#1E79DE] hover:from-[#1E79DE] hover:to-[#4A90E2] text-white text-base font-semibold border-0 rounded-[10px] cursor-pointer transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Entrando...</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Entrar no Sistema
              </span>
            )}
          </Button>
        </form>

        {/* Link Esqueci minha senha */}
        <button
          onClick={() => setShowForgotPassword(true)}
          className="block mt-5 text-white/80 text-[0.9rem] no-underline transition-colors duration-300 hover:text-[#4A90E2] cursor-pointer bg-transparent border-0"
        >
          Esqueci minha senha
        </button>
      </div>

      {/* Dialog Recuperar Senha */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Recuperar Senha
            </DialogTitle>
            <DialogDescription className="text-gray-600 font-medium">
              Digite seu email para receber o link de redefinição de senha
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-gray-800 font-semibold">
                Email
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="seu@email.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(sanitizeSecurityInput(e.target.value.trim()))}
                className="h-12 border-2 border-gray-200 focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 rounded-xl"
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
                className="flex-1 h-12 border-2 rounded-xl font-semibold"
                disabled={resetLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-[#4A90E2] to-[#1E79DE] hover:from-[#1E79DE] hover:to-[#4A90E2] text-white font-bold rounded-xl"
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
