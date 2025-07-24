// Função para limpar notificações fictícias do localStorage
export const cleanupFakeNotifications = (userId: string) => {
  const storageKey = `fluxoazul_notifications_${userId}`;
  const stored = localStorage.getItem(storageKey);
  
  if (stored) {
    try {
      const notifications = JSON.parse(stored);
      
      // Filtrar apenas notificações reais
      const realNotifications = notifications.filter((notification: any) => {
        const isFakeNotification = 
          notification.message?.includes("exemplo") || 
          notification.message?.includes("teste") ||
          notification.message?.includes("Chamado Respondido") ||
          notification.message?.includes("Nova versão do FluxoAzul disponível") ||
          notification.message?.includes("Backup automático dos seus dados foi realizado") ||
          notification.message?.includes("Seu chamado #001") ||
          notification.message?.includes("Nova versão do FluxoAzul") ||
          notification.message?.includes("melhorias de performance") ||
          notification.id === "1" || 
          notification.id === "2" || 
          notification.id === "3" ||
          notification.title === "Chamado Respondido" ||
          notification.title === "Atualização do Sistema" ||
          notification.title === "Backup Realizado";
        
        return !isFakeNotification;
      });
      
      // Salvar apenas notificações reais
      localStorage.setItem(storageKey, JSON.stringify(realNotifications));
      
      console.log(`🧹 Limpeza concluída: ${notifications.length - realNotifications.length} notificações fictícias removidas`);
      console.log(`✅ ${realNotifications.length} notificações reais mantidas`);
      
      return realNotifications;
    } catch (error) {
      console.error("Erro ao limpar notificações:", error);
      localStorage.removeItem(storageKey);
      return [];
    }
  }
  
  return [];
};