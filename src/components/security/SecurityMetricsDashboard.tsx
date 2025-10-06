import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSecurityAlerts } from "@/hooks/useSecurityAlerts";
import { useSessionSecurity } from "@/hooks/useSessionSecurity";
import { useSecurity } from "@/hooks/useSecurity";
import { useSecurityScore } from "@/hooks/useSecurityScore";
import { useSecurityReports } from "@/hooks/useSecurityReports";
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Globe,
  Smartphone,
  Lock
} from "lucide-react";

interface SecurityMetric {
  title: string;
  value: number;
  total?: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  icon: React.ReactNode;
}

export const SecurityMetricsDashboard: React.FC = () => {
  const { useAllSecurityAlerts } = useSecurityAlerts();
  const { useActiveSessions } = useSessionSecurity();
  const { useSecurityEvents } = useSecurity();
  const { data: securityScore, loading: scoreLoading } = useSecurityScore();
  const { useUserSecurityReport } = useSecurityReports();
  const { data: userReport } = useUserSecurityReport();
  
  const { data: alerts = [] } = useAllSecurityAlerts();
  const { data: sessions = [] } = useActiveSessions();
  const { data: events = [] } = useSecurityEvents();

  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Calculate security metrics
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.is_resolved);
  const recentAlerts = alerts.filter(a => new Date(a.created_at) > last24h);
  const activeSessions = sessions.filter(s => s.is_active);
  const recentEvents = events.filter(e => new Date(e.created_at) > last24h);
  const weeklyEvents = events.filter(e => new Date(e.created_at) > last7d);

  // Calculate trends (simplified)
  const previousWeekEvents = events.filter(e => {
    const eventDate = new Date(e.created_at);
    return eventDate > new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) && eventDate <= last7d;
  });

  const eventTrend = weeklyEvents.length > previousWeekEvents.length ? 'up' : 
                    weeklyEvents.length < previousWeekEvents.length ? 'down' : 'stable';

  const metrics: SecurityMetric[] = [
    {
      title: 'Alertas Críticos',
      value: criticalAlerts.length,
      trend: criticalAlerts.length > 0 ? 'up' : 'stable',
      trendValue: criticalAlerts.length,
      severity: criticalAlerts.length > 0 ? 'critical' : 'low',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      title: 'Eventos (24h)',
      value: recentEvents.length,
      trend: eventTrend,
      trendValue: Math.abs(weeklyEvents.length - previousWeekEvents.length),
      severity: recentEvents.length > 50 ? 'high' : recentEvents.length > 20 ? 'medium' : 'low',
      icon: <Activity className="h-4 w-4" />
    },
    {
      title: 'Sessões Ativas',
      value: activeSessions.length,
      trend: 'stable',
      trendValue: 0,
      severity: activeSessions.length > 100 ? 'medium' : 'low',
      icon: <Users className="h-4 w-4" />
    },
    {
      title: 'Taxa de Resolução',
      value: alerts.filter(a => a.is_resolved).length,
      total: alerts.length,
      trend: 'up',
      trendValue: 5,
      severity: 'low',
      icon: <Shield className="h-4 w-4" />
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-green-500" />;
      default: return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  const currentScore = securityScore || 0;
  const scoreColor = currentScore >= 80 ? 'text-green-600' : currentScore >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      {/* Security Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Pontuação de Segurança Geral
          </CardTitle>
          <CardDescription>
            Avaliação baseada em alertas ativos, eventos recentes e configurações de segurança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${scoreColor}`}>
              {scoreLoading ? '...' : currentScore}
            </div>
            <div className="flex-1">
              {scoreLoading ? (
                <div className="animate-pulse h-3 bg-muted rounded"></div>
              ) : (
                <Progress value={currentScore} className="h-3" />
              )}
              <p className="text-sm text-muted-foreground mt-1">
                {scoreLoading ? '...' : (
                  currentScore >= 80 ? 'Excelente' : 
                  currentScore >= 60 ? 'Bom' : 
                  currentScore >= 40 ? 'Regular' : 'Crítico'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className={`border-l-4 ${getSeverityColor(metric.severity).split(' ')[2]}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={getSeverityColor(metric.severity).split(' ')[0]}>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">
                  {metric.value}
                  {metric.total && (
                    <span className="text-sm font-normal text-muted-foreground">
                      /{metric.total}
                    </span>
                  )}
                </div>
                {metric.trendValue > 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    {getTrendIcon(metric.trend)}
                    <span>{metric.trendValue}</span>
                  </div>
                )}
              </div>
              {metric.total && (
                <Progress value={(metric.value / metric.total) * 100} className="h-1 mt-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Security Insights */}
      <Tabs defaultValue="threats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="threats">Ameaças Ativas</TabsTrigger>
          <TabsTrigger value="patterns">Padrões Suspeitos</TabsTrigger>
          <TabsTrigger value="devices">Dispositivos</TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ameaças e Riscos Ativos</CardTitle>
              <CardDescription>
                Alertas que requerem atenção imediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              {criticalAlerts.length === 0 ? (
                <div className="text-center text-green-600 py-8">
                  <Shield className="h-12 w-12 mx-auto mb-4" />
                  <p className="font-medium">Nenhuma ameaça crítica detectada</p>
                  <p className="text-sm text-muted-foreground">Sistema seguro</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {criticalAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center gap-3 p-3 border rounded-lg bg-red-50">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900">{alert.title}</p>
                        <p className="text-sm text-red-700">{alert.description}</p>
                      </div>
                      <Badge variant="destructive">CRÍTICO</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Padrões</CardTitle>
              <CardDescription>
                Detecção de comportamentos anômalos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Logins por Localização
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    {events.filter(e => e.event_type === 'geographic_anomaly').length} anomalias geográficas detectadas
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Dispositivos Suspeitos
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    {events.filter(e => e.event_type === 'device_change').length} mudanças de dispositivo detectadas
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dispositivos e Sessões</CardTitle>
              <CardDescription>
                Monitoramento de dispositivos ativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {session.user_agent?.includes('Chrome') ? 'Chrome' : 
                         session.user_agent?.includes('Firefox') ? 'Firefox' : 
                         session.user_agent?.includes('Safari') ? 'Safari' : 'Navegador Desconhecido'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{session.ip_address || 'IP não disponível'}</span>
                        <span>Ativo há {Math.floor((Date.now() - new Date(session.last_activity).getTime()) / (1000 * 60))} min</span>
                      </div>
                    </div>
                    <Badge variant="outline">
                      <Lock className="h-3 w-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};