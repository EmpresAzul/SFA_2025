import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Bell, 
  MessageSquare, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Check,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/contexts/NotificationContext";
import { Notification } from "@/types/notifications";

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const navigate = useNavigate();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ticket_response':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'system_message':
        return <Bell className="h-4 w-4 text-purple-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Marcar como lida
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Se for notificação de chamado, navegar para suporte
    if (notification.type === 'ticket_response' && notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  const handleRemoveNotification = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    removeNotification(notificationId);
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-gray-900">Notificações</h3>
        {unreadNotifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-blue-600 hover:text-blue-700 text-xs"
          >
            <Check className="h-3 w-3 mr-1" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-96">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Bell className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="p-2">
            {/* Unread Notifications */}
            {unreadNotifications.length > 0 && (
              <>
                <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Não lidas ({unreadNotifications.length})
                </div>
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group relative p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                      notification.type === 'ticket_response' 
                        ? 'hover:bg-blue-50 bg-blue-50/30' 
                        : 'hover:bg-gray-50 bg-gray-50/50'
                    } border-l-4 ${
                      notification.type === 'ticket_response' 
                        ? 'border-l-blue-500' 
                        : 'border-l-gray-300'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={(e) => handleRemoveNotification(e, notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {/* Unread indicator */}
                    <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                ))}
              </>
            )}

            {/* Read Notifications */}
            {readNotifications.length > 0 && (
              <>
                {unreadNotifications.length > 0 && (
                  <div className="border-t my-2"></div>
                )}
                <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Lidas
                </div>
                {readNotifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className="group relative p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-50 opacity-75"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5 opacity-60">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={(e) => handleRemoveNotification(e, notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-blue-600 hover:text-blue-700"
            onClick={() => {
              navigate('/suporte');
              onClose();
            }}
          >
            Ver todas as mensagens no Suporte
          </Button>
        </div>
      )}
    </div>
  );
};