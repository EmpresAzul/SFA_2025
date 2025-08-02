// Sistema de sincronização entre abas "Configurações" e "Perfil"

export interface ProfileSyncData {
  nome: string;
  empresa: string;
  telefone: string;
  cargo: string;
  endereco: {
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  timestamp: string;
}

export const PROFILE_SYNC_EVENT = "profileDataUpdated";

// Emitir evento de sincronização
export const emitProfileSync = (data: ProfileSyncData) => {
  console.log("🚀 profileSync: Emitindo evento de sincronização:", data);
  
  // Evento customizado para comunicação interna
  const event = new CustomEvent(PROFILE_SYNC_EVENT, {
    detail: data
  });
  
  window.dispatchEvent(event);
  console.log("✅ profileSync: Evento emitido com sucesso");
};

// Listener para receber atualizações
export const subscribeToProfileSync = (callback: (data: ProfileSyncData) => void) => {
  console.log("🔔 profileSync: Registrando listener para sincronização");
  
  const handleProfileSync = (event: Event) => {
    const customEvent = event as CustomEvent<ProfileSyncData>;
    console.log("🔔 profileSync: Evento recebido:", customEvent.detail);
    callback(customEvent.detail);
  };
  
  window.addEventListener(PROFILE_SYNC_EVENT, handleProfileSync);
  
  // Retornar função de limpeza
  return () => {
    console.log("🧹 profileSync: Removendo listener");
    window.removeEventListener(PROFILE_SYNC_EVENT, handleProfileSync);
  };
};

// Forçar sincronização de todos os componentes
export const forceProfileRefresh = () => {
  console.log("🔄 profileSync: Forçando refresh completo");
  
  const refreshEvent = new CustomEvent("forceProfileRefresh", {
    detail: { timestamp: new Date().toISOString() }
  });
  
  window.dispatchEvent(refreshEvent);
  console.log("✅ profileSync: Refresh forçado emitido");
};