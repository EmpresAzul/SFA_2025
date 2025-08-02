import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSecurityAlerts } from "@/hooks/useSecurityAlerts";
import { useSessionSecurity } from "@/hooks/useSessionSecurity";
import { useSecurity } from "@/hooks/useSecurity";
import { useSecurityNotifications } from "@/hooks/useSecurityNotifications";
import { Shield, AlertTriangle, Users, Activity, Clock, CheckCircle, MapPin, Globe, Bell, FileText, Download } from "lucide-react";
import { useSecurityReports } from '@/hooks/useSecurityReports';
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// Security Events Tab Component
const SecurityEventsTab = () => {
  const { useSecurityEvents } = useSecurity();
  const { data: events = [], isLoading } = useSecurityEvents();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Activity className="h-4 w-4 text-yellow-500" />;
      default: return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'login_success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'login_failure': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'suspicious_activity': return <Shield className="h-4 w-4 text-orange-500" />;
      case 'data_access': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'geographic_anomaly': return <MapPin className="h-4 w-4 text-purple-500" />;
      case 'multiple_sessions': return <Users className="h-4 w-4 text-yellow-500" />;
      default: return <Globe className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      {events.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Nenhum evento de segurança registrado.
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 mt-1">
                  {getSeverityIcon(event.severity)}
                  {getEventTypeIcon(event.event_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {event.event_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={`text-xs ${
                      event.severity === 'critical' ? 'bg-red-500' :
                      event.severity === 'high' ? 'bg-orange-500' :
                      event.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}>
                      {event.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="font-medium text-gray-900">{event.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(event.created_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                    {event.metadata?.ip_address && (
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {String(event.metadata.ip_address)}
                      </span>
                    )}
                    {event.metadata?.user_agent && (
                      <span className="text-xs text-gray-400 truncate max-w-xs">
                        {String(event.metadata.user_agent).substring(0, 50)}...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

const AdminSecurityDashboard: React.FC = () => {
  const { useAllSecurityAlerts, useResolveSecurityAlert } = useSecurityAlerts();
  const { useActiveSessions, useCleanupSessions } = useSessionSecurity();
  const { useIsAdmin } = useSecurity();
  const { 
    useNotifications, 
    usePendingNotificationsCount 
  } = useSecurityNotifications();
  const { 
    useSystemSecurityReport, 
    useCleanupSecurityAlerts 
  } = useSecurityReports();
  
  const isAdmin = useIsAdmin();
  const { data: alerts = [], loading: alertsLoading } = useAllSecurityAlerts();
  const { data: sessions = [], isLoading: sessionsLoading } = useActiveSessions();
  const { data: notifications = [] } = useNotifications();
  const { data: pendingCount = 0 } = usePendingNotificationsCount();
  const resolveAlert = useResolveSecurityAlert();
  const cleanupSessions = useCleanupSessions();

  if (!isAdmin) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Acesso negado. Esta seção é restrita a administradores.
        </AlertDescription>
      </Alert>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 hover:bg-red-600';
      case 'high': return 'bg-orange-500 hover:bg-orange-600';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.is_resolved);
  const criticalAlerts = unresolvedAlerts.filter(alert => alert.severity === 'critical');
  const activeSessions = sessions.filter(session => session.is_active);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Segurança</h1>
          <p className="text-gray-600">Monitoramento e gestão de segurança do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => cleanupSessions.mutate()}
            variant="outline"
            disabled={cleanupSessions.isPending}
          >
            <Activity className="h-4 w-4 mr-2" />
            Limpar Sessões
          </Button>
          <Button
            onClick={() => {
              const { data } = useSystemSecurityReport();
              if (data) {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }
            }}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button
            onClick={() => useCleanupSecurityAlerts().mutate()}
            variant="outline"
            size="sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Limpar Alertas
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <p className="text-xs text-gray-500">Requerem ação imediata</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Pendentes</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unresolvedAlerts.length}</div>
            <p className="text-xs text-gray-500">Aguardando resolução</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeSessions.length}</div>
            <p className="text-xs text-gray-500">Usuários conectados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificações Pendentes</CardTitle>
            <Bell className={`h-4 w-4 ${pendingCount > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-gray-500">Aguardando envio</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Alertas de Segurança</TabsTrigger>
          <TabsTrigger value="sessions">Sessões Ativas</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="events">Eventos de Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Segurança</CardTitle>
              <CardDescription>
                Monitoramento de atividades suspeitas e eventos de segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {alertsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Nenhum alerta de segurança encontrado.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className={`border rounded-lg p-4 ${alert.is_resolved ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                              {alert.is_resolved && <Badge variant="outline">Resolvido</Badge>}
                            </div>
                            <h4 className="font-medium text-gray-900">{alert.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(alert.created_at), { 
                                  addSuffix: true, 
                                  locale: ptBR 
                                })}
                              </span>
                              <span>Tipo: {alert.alert_type}</span>
                            </div>
                          </div>
                          {!alert.is_resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveAlert.mutateAsync(alert.id)}
                              disabled={resolveAlert.isPending}
                            >
                              Resolver
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sessões Ativas</CardTitle>
              <CardDescription>
                Monitoramento de sessões de usuários ativas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {sessionsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : activeSessions.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Nenhuma sessão ativa encontrada.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeSessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              Sessão {session.session_token_hash.substring(0, 8)}...
                            </h4>
                            <div className="text-sm text-gray-600 mt-1 space-y-1">
                              <p>User Agent: {session.user_agent?.substring(0, 60)}...</p>
                              {session.ip_address && <p>IP: {session.ip_address}</p>}
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Criada: {formatDistanceToNow(new Date(session.created_at), { 
                                  addSuffix: true, 
                                  locale: ptBR 
                                })}
                              </span>
                              <span>
                                Última atividade: {formatDistanceToNow(new Date(session.last_activity), { 
                                  addSuffix: true, 
                                  locale: ptBR 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificações de Segurança</CardTitle>
              <CardDescription>
                Gerenciar notificações automáticas de segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhuma notificação encontrada
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            <span className="font-medium capitalize">
                              {notification.notification_type}
                            </span>
                            <Badge className={`text-xs ${
                              notification.status === 'pending' 
                                ? 'bg-yellow-500' 
                                : notification.status === 'sent'
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}>
                              {notification.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.metadata?.alert_type && (
                              <>Alerta: {notification.metadata.alert_type}</>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Criado: {formatDistanceToNow(new Date(notification.created_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                            {notification.sent_at && (
                              <> • Enviado: {formatDistanceToNow(new Date(notification.sent_at), { 
                                addSuffix: true, 
                                locale: ptBR 
                              })}</>
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos de Segurança</CardTitle>
              <CardDescription>
                Histórico de eventos e atividades de segurança do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecurityEventsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSecurityDashboard;