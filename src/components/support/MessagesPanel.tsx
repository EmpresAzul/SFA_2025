import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  MessageSquare, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Bell,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";
import { Notification } from "@/types/notifications";

export const MessagesPanel: React.FC = () => {
  const { notifications, markAsRead, removeNotification, clearAllNotifications } = useNotifications();

  // Filtrar apenas mensagens do sistema (não de chamados)
  const systemMessages = notifications.filter(n => n.type === 'system_message' || n.type === 'info' || n.type === 'warning' || n.type === 'success');

  const getMessageIcon = (type: Notification['type']) => {
    switch (type) {
      case 'system_message':
        return <Bell className="h-4 w-4 text-purple-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMessageBadge = (type: Notification['type']) => {
    switch (type) {
      case 'system_message':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700">Sistema</Badge>;
      case 'info':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Info</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Aviso</Badge>;
      case 'success':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Sucesso</Badge>;
      default:
        return <Badge variant="secondary">Mensagem</Badge>;
    }
  };

  const handleMessageClick = (message: Notification) => {
    if (!message.isRead) {
      markAsRead(message.id);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Mensagens do Sistema
          </CardTitle>
          {systemMessages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllNotifications}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Limpar Todas
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {systemMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm font-medium mb-1">Nenhuma mensagem do sistema</p>
            <p className="text-xs text-center">
              Mensagens e notificações do sistema aparecerão aqui
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {systemMessages.map((message) => (
                <div
                  key={message.id}
                  className={`group relative p-4 rounded-lg border cursor-pointer transition-all ${
                    message.isRead 
                      ? 'bg-gray-50 border-gray-200 opacity-75' 
                      : 'bg-white border-blue-200 shadow-sm hover:shadow-md'
                  }`}
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getMessageIcon(message.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-medium ${
                            message.isRead ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {message.title}
                          </h4>
                          {getMessageBadge(message.type)}
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(message.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                      <p className={`text-sm mb-2 ${
                        message.isRead ? 'text-gray-600' : 'text-gray-700'
                      }`}>
                        {message.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};