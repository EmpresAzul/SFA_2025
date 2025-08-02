import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Key, Monitor, Eye, AlertTriangle, Smartphone, Clock, History } from 'lucide-react';
import { useSecurityStub } from '@/hooks/useSecurityStub';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const SecuritySettings = () => {
  const security = useSecurityStub();

  const currentRole = security.useCurrentUserRole();
  const isAdmin = security.useIsAdmin();
  const securityEvents = [];
  const userSessions = [];
  const userConsents = [];
  
  const revokeSession = security.useRevokeSession();
  const changePassword = security.useChangePassword();
  const updateConsent = security.useUpdateConsent();
  const requestDataDeletion = security.useRequestDataDeletion();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return;
    }

    changePassword.mutateAsync();
  };

  const getConsentValue = (type: 'data_processing' | 'marketing' | 'analytics') => {
    return false; // Stub implementation
  };

  const handleConsentChange = (type: 'data_processing' | 'marketing' | 'analytics', value: boolean) => {
    updateConsent.mutateAsync();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatSessionActivity = (lastActivity: string) => {
    const date = new Date(lastActivity);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Configurações de Segurança</h1>
        {isAdmin && (
          <Badge variant="destructive" className="ml-2">
            <Shield className="h-3 w-3 mr-1" />
            Administrador
          </Badge>
        )}
      </div>

      <Tabs defaultValue="password" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Senha
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Sessões
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Privacidade
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Atividade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Alterar Senha
              </CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                    minLength={8}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Mínimo de 8 caracteres com letras, números e símbolos
                  </p>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    minLength={8}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={changePassword.isPending}
                  className="w-full"
                >
                  {changePassword.isPending ? 'Alterando...' : 'Alterar Senha'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Sessões Ativas
              </CardTitle>
              <CardDescription>
                Gerencie onde você está conectado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userSessions?.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {session.user_agent?.includes('Chrome') ? 'Chrome' : 
                           session.user_agent?.includes('Firefox') ? 'Firefox' : 
                           session.user_agent?.includes('Safari') ? 'Safari' : 'Navegador Desconhecido'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session.ip_address || 'IP não disponível'} • {formatSessionActivity('')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Expira: {format(new Date(session.expires_at), 'dd/MM', { locale: ptBR })}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => revokeSession.mutateAsync()}
                        disabled={revokeSession.isPending}
                      >
                        Revogar
                      </Button>
                    </div>
                  </div>
                ))}
                {!userSessions?.length && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma sessão ativa encontrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Configurações de Privacidade
              </CardTitle>
              <CardDescription>
                Controle como seus dados são utilizados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Processamento de Dados</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir o processamento de seus dados para funcionalidades essenciais
                  </p>
                </div>
                <Switch
                  checked={getConsentValue('data_processing')}
                  onCheckedChange={(value) => handleConsentChange('data_processing', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber comunicações de marketing e promoções
                  </p>
                </div>
                <Switch
                  checked={getConsentValue('marketing')}
                  onCheckedChange={(value) => handleConsentChange('marketing', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir coleta de dados para análise e melhoria do sistema
                  </p>
                </div>
                <Switch
                  checked={getConsentValue('analytics')}
                  onCheckedChange={(value) => handleConsentChange('analytics', value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Zona de Perigo
                </h3>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Solicitar Exclusão de Dados
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir todos os dados</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação solicitará a exclusão permanente de todos os seus dados. 
                        Isso incluirá seu perfil, lançamentos, configurações e histórico. 
                        Esta ação não pode ser desfeita e pode levar até 30 dias para ser processada.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => requestDataDeletion.mutateAsync()}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Confirmar Exclusão
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Atividade de Segurança
              </CardTitle>
              <CardDescription>
                Histórico de eventos de segurança em sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityEvents?.slice(0, 10).map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium">{event.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.event_type} • {format(new Date(event.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
                {!securityEvents?.length && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma atividade de segurança registrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};