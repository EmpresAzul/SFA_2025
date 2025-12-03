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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#3d2463] via-[#4a2d5c] to-[#2d1b4e]">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-blue-500/30 to-purple-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-pink-400/20 via-purple-500/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Glassmorphism Card Premium */}
        <div className="relative backdrop-blur-3xl bg-gradient-to-br from-purple-600/40 via-pink-500/40 to-blue-500/40 rounded-[2.5rem] shadow-2xl border border-white/20 p-10 overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-[2.5rem]"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Avatar Circle */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400/30 via-purple-400/30 to-blue-400/30 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center shadow-xl">
                <User className="w-12 h-12 text-white/80" strokeWidth={1.5} />
              </div>
            </div>

            {/* Logo */}
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '1px' }}>
                <span className="text-white">FLUXO</span>
                <span className="text-[#5B9EFF]">AZUL</span>
              </h1>
            </div>

            {/* Formulário */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Mail className="w-5 h-5 text-white/60" strokeWidth={2} />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Email ID"
                  required
                  className={`h-14 bg-white/10 backdrop-blur-md text-white placeholder:text-white/50 border-0 border-b-2 ${
                    errors.email ? "border-red-400" : "border-white/30"
                  } focus:border-white/60 focus:bg-white/15 transition-all duration-300 rounded-t-xl rounded-b-none pl-12 pr-4`}
                />
                {errors.email && (
                  <p className="text-red-300 text-xs mt-1.5 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Lock className="w-5 h-5 text-white/60" strokeWidth={2} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Password"
                  required
                  className={`h-14 bg-white/10 backdrop-blur-md text-white placeholder:text-white/50 border-0 border-b-2 ${
                    errors.password ? "border-red-400" : "border-white/30"
                  } focus:border-white/60 focus:bg-white/15 transition-all duration-300 rounded-t-xl rounded-b-none pl-12 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
                {errors.password && (
                  <p className="text-red-300 text-xs mt-1.5 ml-1">{errors.password}</p>
                )}
              </div>

              {/* Rate limiting info */}
              {rateLimitInfo.isLimited && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-xl">
                  <Shield className="h-4 w-4 text-red-300" />
                  <p className="text-red-200 text-xs">
                    Bloqueado por segurança.
                    {rateLimitInfo.resetTime && ` Tente após ${new Date(rateLimitInfo.resetTime).toLocaleTimeString()}.`}
                  </p>
                </div>
              )}
              
              {!rateLimitInfo.isLimited && rateLimitInfo.remainingAttempts < 3 && (
                <div className="flex items-center space-x-2 p-3 bg-yellow-500/20 backdrop-blur-md border border-yellow-400/30 rounded-xl">
                  <Shield className="h-4 w-4 text-yellow-300" />
                  <p className="text-yellow-200 text-xs">
                    {rateLimitInfo.remainingAttempts} tentativas restantes.
                  </p>
                </div>
              )}

              {/* Login Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading || !!errors.email || !!errors.password || rateLimitInfo.isLimited}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wider text-sm"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    "LOGIN"
                  )}
                </Button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-center pt-5">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>
            </form>
          </div>
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
