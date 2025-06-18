
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, Activity } from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SecurityLogs: React.FC = () => {
  const { useSecurityLogs } = useSecurity();
  const { data: logs = [], isLoading } = useSecurityLogs();

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'login_success':
        return '✅';
      case 'login_failed':
        return '❌';
      case 'logout':
        return '🚪';
      case 'password_change':
        return '🔑';
      case 'data_access':
        return '📊';
      case 'suspicious_activity':
        return '⚠️';
      default:
        return '📝';
    }
  };

  const getEventLabel = (eventType: string) => {
    const labels = {
      login_success: 'Login Realizado',
      login_failed: 'Falha no Login',
      logout: 'Logout',
      password_change: 'Alteração de Senha',
      data_access: 'Acesso aos Dados',
      suspicious_activity: 'Atividade Suspeita'
    };
    return labels[eventType as keyof typeof labels] || eventType;
  };

  const getEventVariant = (eventType: string) => {
    switch (eventType) {
      case 'login_success':
        return 'default';
      case 'login_failed':
      case 'suspicious_activity':
        return 'destructive';
      case 'logout':
        return 'secondary';
      case 'password_change':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Logs de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Logs de Segurança
        </CardTitle>
        <CardDescription>
          Histórico das últimas 50 atividades de segurança da sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum log de segurança encontrado</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEventIcon(log.event_type)}</span>
                        <span className="font-medium">{getEventLabel(log.event_type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEventVariant(log.event_type) as any}>
                        {log.event_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {format(new Date(log.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.details && (
                        <div className="text-sm text-gray-600">
                          {typeof log.details === 'object' 
                            ? JSON.stringify(log.details, null, 2)
                            : log.details
                          }
                        </div>
                      )}
                      {log.ip_address && (
                        <div className="text-xs text-gray-500 mt-1">
                          IP: {log.ip_address}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityLogs;
