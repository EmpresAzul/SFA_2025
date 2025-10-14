import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock } from "lucide-react";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 8 caracteres",
        variant: "destructive"
      });
      return;
    }

    if (!/\d/.test(password)) {
      toast({
        title: "Erro",
        description: "A senha deve conter pelo menos um número",
        variant: "destructive"
      });
      return;
    }

    if (!/[a-zA-Z]/.test(password)) {
      toast({
        title: "Erro",
        description: "A senha deve conter pelo menos uma letra",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Senha redefinida com sucesso! Faça login com sua nova senha."
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Erro",
        description: "Erro ao redefinir senha. O link pode ter expirado.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "Fraca";
    if (passwordStrength <= 3) return "Média";
    return "Forte";
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2847] to-[#1a2847]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent transform rotate-12 scale-150"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-indigo-500/20 to-transparent transform -rotate-12 scale-150"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="bg-white shadow-2xl border-0 overflow-hidden rounded-lg">
          {/* Header com logo */}
          <div className="bg-white p-6 text-center">
            <div className="mb-4">
              <h1 className="text-4xl font-black bg-gradient-to-r from-[#0f2847] via-[#1a2847] to-[#1e3a8a] bg-clip-text text-transparent">
                FluxoAzul
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Redefinir Senha
            </h2>
            <p className="text-gray-600 text-sm">
              Crie uma nova senha para sua conta
            </p>
          </div>

          <div className="px-6 pb-6">

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-2 bg-white text-gray-900 placeholder:text-gray-500 border-gray-200 focus:border-blue-500 transition-all duration-200 rounded-lg pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i < passwordStrength ? getStrengthColor() : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      Força da senha: <span className="font-semibold">{getStrengthText()}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-700 font-medium text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite novamente sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 border-2 bg-white text-gray-900 placeholder:text-gray-500 border-gray-200 focus:border-blue-500 transition-all duration-200 rounded-lg pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-gray-700 mb-2 font-semibold">A senha deve conter:</p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li className={password.length >= 8 ? "text-green-600 font-medium" : ""}>
                    • Mínimo 8 caracteres
                  </li>
                  <li className={/[a-zA-Z]/.test(password) ? "text-green-600 font-medium" : ""}>
                    • Pelo menos uma letra
                  </li>
                  <li className={/\d/.test(password) ? "text-green-600 font-medium" : ""}>
                    • Pelo menos um número
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-[#0a1628] via-[#0f2847] to-[#1a2847] hover:from-[#0f2847] hover:via-[#1a2847] hover:to-[#1e3a8a] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={loading}
                >
                  {loading ? "Redefinindo..." : "Redefinir Senha"}
                </Button>
              </div>

              {/* Forgot Password Link */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors underline font-medium"
                >
                  Voltar para o login
                </button>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <p className="text-gray-500 text-xs">
                  © 2025 FluxoAzul. Todos os direitos reservados.
                </p>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
