import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Notification, NotificationContextType } from "@/types/notifications";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Carregar notificações do localStorage
  useEffect(() => {
    if (user?.id) {
      const storageKey = `fluxoazul_notifications_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        try {
          const parsedNotifications = JSON.parse(stored);
          // Filtrar apenas notificações válidas (não fictícias)
          const validNotifications = parsedNotifications.filter((notification: Notification) => {
            // Remover notificações fictícias/de exemplo
            const isFakeNotification = 
              notification.message.includes("exemplo") || 
              notification.message.includes("teste") ||
              notification.message.includes("Chamado Respondido") ||
              notification.message.includes("Nova versão do FluxoAzul disponível") ||
              notification.message.includes("Backup automático dos seus dados foi realizado") ||
              notification.id === "1" || 
              notification.id === "2" || 
              notification.id === "3" ||
              notification.title === "Chamado Respondido" ||
              notification.title === "Atualização do Sistema" ||
              notification.title === "Backup Realizado";
            
            return !isFakeNotification;
          });
          
          setNotifications(validNotifications);
          console.log("🔔 Notificações reais carregadas:", validNotifications.length);
          
          // Salvar apenas as notificações válidas
          localStorage.setItem(storageKey, JSON.stringify(validNotifications));
        } catch (error) {
          console.error("Erro ao carregar notificações:", error);
          setNotifications([]);
        }
      } else {
        // Inicializar com array vazio - sem notificações fictícias
        setNotifications([]);
        console.log("🔔 Sistema de notificações inicializado sem dados fictícios");
      }
    }
  }, [user]);

  // Salvar notificações no localStorage sempre que mudarem
  const saveNotifications = (newNotifications: Notification[]) => {
    if (user?.id) {
      const storageKey = `fluxoazul_notifications_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(newNotifications));
    }
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
    
    console.log("🔔 Nova notificação adicionada:", newNotification.title);
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const removeNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};