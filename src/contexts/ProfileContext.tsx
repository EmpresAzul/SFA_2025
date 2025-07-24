import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileData {
  nome: string;
  empresa: string;
  email: string;
  telefone?: string;
  cargo?: string;
}

interface ProfileContextType {
  profileData: ProfileData;
  updateProfileData: (data: Partial<ProfileData>) => void;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Função para salvar dados no localStorage
const saveProfileToStorage = (userId: string, data: ProfileData) => {
  try {
    const key = `profile_${userId}`;
    localStorage.setItem(key, JSON.stringify(data));
    console.log("Dados do perfil salvos no localStorage:", data);
  } catch (error) {
    console.error("Erro ao salvar perfil no localStorage:", error);
  }
};

// Função para carregar dados do localStorage
const loadProfileFromStorage = (userId: string): ProfileData | null => {
  try {
    const key = `profile_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const data = JSON.parse(stored);
      console.log("Dados do perfil carregados do localStorage:", data);
      return data;
    }
  } catch (error) {
    console.error("Erro ao carregar perfil do localStorage:", error);
  }
  return null;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    nome: "Leandro Souza",
    empresa: "Empresa Azul Ltda",
    email: "suporte@empresazul.com",
    telefone: "(11) 99999-9999",
    cargo: "Diretor Financeiro",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          setLoading(true);
          
          // Tentar carregar dados salvos do localStorage primeiro
          const savedProfile = loadProfileFromStorage(user.id);
          
          if (savedProfile) {
            // Se há dados salvos, usar eles
            const loadedData = {
              ...savedProfile,
              email: user.email || savedProfile.email, // Sempre usar o email atual do usuário
            };
            setProfileData(loadedData);
            console.log("🔄 Perfil carregado do localStorage após login:", loadedData);
          } else {
            // Se não há dados salvos, usar dados padrão
            const defaultData: ProfileData = {
              nome: "Leandro Souza",
              empresa: "Empresa Azul Ltda",
              email: user.email || "suporte@empresazul.com",
              telefone: "(11) 99999-9999",
              cargo: "Diretor Financeiro",
            };

            setProfileData(defaultData);
            // Salvar dados padrão no localStorage
            saveProfileToStorage(user.id, defaultData);
            console.log("📝 Perfil padrão criado e salvo para novo usuário");
          }

          // Em produção seria:
          /*
          const { data } = await supabase
            .from('user_profiles')
            .select('nome, empresa, email, telefone, cargo')
            .eq('user_id', user.id)
            .single();

          if (data) {
            setProfileData(data);
            saveProfileToStorage(user.id, data);
          }
          */
        } catch (error) {
          console.error("❌ Erro ao carregar dados do perfil:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Se não há usuário, resetar para dados padrão
        setProfileData({
          nome: "Leandro Souza",
          empresa: "Empresa Azul Ltda",
          email: "suporte@empresazul.com",
          telefone: "(11) 99999-9999",
          cargo: "Diretor Financeiro",
        });
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const updateProfileData = (data: Partial<ProfileData>) => {
    const updatedData = { ...profileData, ...data };
    setProfileData(updatedData);
    
    // Salvar no localStorage sempre que atualizar
    if (user?.id) {
      saveProfileToStorage(user.id, updatedData);
      console.log("Perfil atualizado e salvo no localStorage");
    }
  };

  return (
    <ProfileContext.Provider value={{ profileData, updateProfileData, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};