import { useAuth } from "@/contexts/AuthContext";
import { ProfileFormData } from "@/types/profile";

interface PersistedProfileData {
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
  lastUpdated: string;
}

export const useProfilePersistence = () => {
  const { user } = useAuth();

  const getStorageKey = (suffix: string = '') => {
    if (!user?.id) return null;
    return `fluxoazul_profile_${user.id}${suffix ? `_${suffix}` : ''}`;
  };

  const saveProfile = (data: ProfileFormData): boolean => {
    try {
      const key = getStorageKey();
      if (!key) return false;

      const persistedData: PersistedProfileData = {
        nome: data.nome,
        empresa: data.empresa,
        telefone: data.telefone,
        cargo: data.cargo,
        endereco: data.endereco,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(key, JSON.stringify(persistedData));
      console.log("✅ Perfil salvo no localStorage:", persistedData);
      return true;
    } catch (error) {
      console.error("❌ Erro ao salvar perfil:", error);
      return false;
    }
  };

  const loadProfile = (): PersistedProfileData | null => {
    try {
      const key = getStorageKey();
      if (!key) return null;

      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const data = JSON.parse(stored) as PersistedProfileData;
      console.log("✅ Perfil carregado do localStorage:", data);
      return data;
    } catch (error) {
      console.error("❌ Erro ao carregar perfil:", error);
      return null;
    }
  };

  const clearProfile = (): boolean => {
    try {
      const key = getStorageKey();
      if (!key) return false;

      localStorage.removeItem(key);
      console.log("✅ Perfil removido do localStorage");
      return true;
    } catch (error) {
      console.error("❌ Erro ao remover perfil:", error);
      return false;
    }
  };

  const hasStoredProfile = (): boolean => {
    const key = getStorageKey();
    if (!key) return false;
    return localStorage.getItem(key) !== null;
  };

  return {
    saveProfile,
    loadProfile,
    clearProfile,
    hasStoredProfile,
  };
};