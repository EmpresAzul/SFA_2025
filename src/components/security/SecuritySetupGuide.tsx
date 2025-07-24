import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertTriangle, CheckCircle, Shield, Lock } from "lucide-react";

export const SecuritySetupGuide: React.FC = () => {
  const openSupabaseDashboard = () => {
    window.open('https://supabase.com/dashboard/project/ayhzvgeapkjpscmiukkp/auth/providers', '_blank');
  };

  const openAuthSettings = () => {
    window.open('https://supabase.com/dashboard/project/ayhzvgeapkjpscmiukkp/settings/auth', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Guia de Configuração de Segurança</h2>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Ação Manual Necessária:</strong> Algumas configurações de segurança precisam ser habilitadas no painel do Supabase.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* Critical - Leaked Password Protection */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-500" />
                Proteção contra Senhas Vazadas
                <Badge variant="destructive">CRÍTICO</Badge>
              </CardTitle>
            </div>
            <CardDescription>
              Impede que usuários usem senhas que foram comprometidas em vazamentos de dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">Status: Desabilitado</h4>
              <p className="text-sm text-red-700">
                Esta configuração crítica de segurança precisa ser habilitada manualmente no Supabase Dashboard.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Passos para habilitar:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Clique no botão "Abrir Configurações de Auth" abaixo</li>
                <li>Role até a seção "Security and validation"</li>
                <li>Encontre "Leaked Password Protection"</li>
                <li>Ative a opção "Enable leaked password protection"</li>
                <li>Clique em "Save" para salvar as alterações</li>
              </ol>
            </div>

            <Button onClick={openAuthSettings} className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Configurações de Auth no Supabase
            </Button>
          </CardContent>
        </Card>

        {/* Security Features Already Implemented */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Recursos de Segurança Implementados
              <Badge variant="secondary">COMPLETO</Badge>
            </CardTitle>
            <CardDescription>
              Funcionalidades de segurança já ativas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-green-700">Autenticação e Sessões</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Row Level Security (RLS) habilitado</li>
                  <li>✓ Controle de sessões ativas</li>
                  <li>✓ Limite de sessões simultâneas</li>
                  <li>✓ Timeout automático de sessão</li>
                  <li>✓ Sistema de funções de usuário</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-green-700">Monitoramento</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Detecção de atividade suspeita</li>
                  <li>✓ Alertas de segurança automatizados</li>
                  <li>✓ Logs de auditoria</li>
                  <li>✓ Rate limiting de requisições</li>
                  <li>✓ Detecção geográfica de anomalias</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-green-700">Proteções do Cliente</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Content Security Policy (CSP)</li>
                  <li>✓ Headers de segurança</li>
                  <li>✓ Sanitização de entrada</li>
                  <li>✓ Validação de integridade de sessão</li>
                  <li>✓ Detecção de device fingerprinting</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-green-700">Banco de Dados</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Políticas RLS por usuário</li>
                  <li>✓ Funções de segurança</li>
                  <li>✓ Triggers de auditoria</li>
                  <li>✓ Validação de CPF/CNPJ</li>
                  <li>✓ Criptografia de dados sensíveis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optional Improvements */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Melhorias Opcionais
              <Badge variant="outline">OPCIONAL</Badge>
            </CardTitle>
            <CardDescription>
              Configurações adicionais que podem ser consideradas no futuro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Configurações de Auth Adicionais</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                  <li>• Habilitar 2FA (Two-Factor Authentication)</li>
                  <li>• Configurar reCAPTCHA para formulários</li>
                  <li>• Definir políticas de senha mais restritivas</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Monitoramento Avançado</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                  <li>• Integração com serviços de threat intelligence</li>
                  <li>• Alertas via email/SMS para eventos críticos</li>
                  <li>• Dashboard de métricas de segurança em tempo real</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Parabéns!</strong> Seu sistema possui uma base de segurança sólida. 
          A única ação crítica pendente é habilitar a proteção contra senhas vazadas no Supabase Dashboard.
        </AlertDescription>
      </Alert>
    </div>
  );
};