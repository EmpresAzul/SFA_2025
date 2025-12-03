import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, Shield, User } from "lucide-react";
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
      console.error("Error sending reset email:", error);
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
    <div className="min-h-screen flex items-center justify-center bg-[#172a5a]">
      <div className="w-full max-w-[350px] px-6">
        {/* Glassmorphism Card */}
        <div className="backdrop-blur-[10px] bg-white/15 rounded-[20px] border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-10 text-center">
          
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-[2.2rem] font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '1px' }}>
              FLUXO<span className="text-[#4A90E2]">AZUL</span>
            </h1>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="E-mail"
                required
                className={`w-full h-12 px-4 pr-10 bg-white/90 text-gray-800 placeholder:text-gray-500 border-0 rounded-[10px] outline-none transition-all duration-300 ${
                  errors.email ? "shadow-[0_0_0_2px_#ef4444]" : "focus:shadow-[0_0_0_2px_#4A90E2]"
                }`}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Lock className="w-5 h-5 text-gray-600" />
              </div>
              {errors.email && (
                <p className="text-red-300 text-xs mt-1.5 text-left">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Senha"
                required
                className={`w-full h-12 px-4 pr-10 bg-white/90 text-gray-800 placeholder:text-gray-500 border-0 rounded-[10px] outline-none transition-all duration-300 ${
                  errors.password ? "shadow-[0_0_0_2px_#ef4444]" : "focus:shadow-[0_0_0_2px_#4A90E2]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-gray-600" />}
              </button>
              {errors.password && (
                <p className="text-red-300 text-xs mt-1.5 text-left">{errors.password}</p>
              )}
            </div>

            {/* Rate limiting info */}
            {rateLimitInfo.isLimited && (
              <div className="flex items-center space-x-2 p-2.5 bg-red-500/20 border border-red-400/30 rounded-lg">
                <Shield className="h-4 w-4 text-red-300" />
                <p className="text-red-200 text-xs text-left">
                  Bloqueado por segurança.
                  {rateLimitInfo.resetTime && ` Tente após ${new Date(rateLimitInfo.resetTime).toLocaleTimeString()}.`}
                </p>
              </div>
            )}
            
            {!rateLimitInfo.isLimited && rateLimitInfo.remainingAttempts < 3 && (
              <div className="flex items-center space-x-2 p-2.5 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                <Shield className="h-4 w-4 text-yellow-300" />
                <p className="text-yellow-200 text-xs text-left">
                  {rateLimitInfo.remainingAttempts} tentativas restantes.
                </p>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading || !!errors.email || !!errors.password || rateLimitInfo.isLimited}
              className="w-full h-12 mt-4 bg-gradient-to-r from-[#4A90E2] to-[#1E79DE] hover:from-[#1E79DE] hover:to-[#4A90E2] text-white font-semibold rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Entrar no Sistema</span>
                </div>
              )}
            </Button>

            {/* Forgot Password Link */}
            <div className="text-center mt-5">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-white/80 hover:text-[#4A90E2] transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Dialog com Glassmorphism */}
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
              <Label htmlFor="reset-email" className="text-gray-800 font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#3676DC] rounded-full"></span>
                Email
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="seu@email.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(sanitizeSecurityInput(e.target.value.trim()))}
                className="h-12 border-2 border-gray-200 focus:border-[#3676DC] focus:ring-2 focus:ring-[#3676DC]/20 rounded-xl transition-all duration-300"
                disabled={resetLoading}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail("");
                }}
                className="flex-1 h-12 border-2 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                disabled={resetLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-[#1a3a5c] via-[#3676DC] to-[#4a8ef5] hover:from-[#3676DC] hover:via-[#4a8ef5] hover:to-[#5a9eff] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
