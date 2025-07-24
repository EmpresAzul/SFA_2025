export interface Notification {
  id: string;
  type: 'ticket_response' | 'system_message' | 'info' | 'warning' | 'success' | 'reminder';
  title: string;
  message: string;
  ticketId?: string; // Para notificações de chamados
  isRead: boolean;
  createdAt: string;
  actionUrl?: string; // URL para onde redirecionar ao clicar
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
}