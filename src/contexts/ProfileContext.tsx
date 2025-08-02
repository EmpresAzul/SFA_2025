import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { subscribeToProfileSync } from "@/utils/profileSync";

interface ProfileData {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  cargo: string;
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

// Função para carregar dados do banco Supabase
const fetchProfileFromDB = async (userId: string) => {
  console.log("🔍 fetchProfileFromDB: Buscando perfil para userId:", userId);
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) {
      console.error("❌ fetchProfileFromDB: Erro ao buscar perfil do banco:", error);
      console.error("❌ Detalhes do erro:", { message: error.message, details: error.details, hint: error.hint, code: error.code });
      throw error;
    }
    console.log("✅ fetchProfileFromDB: Perfil encontrado:", data);
    return data;
  } catch (error) {
    console.error("❌ fetchProfileFromDB: Erro ao buscar perfil:", error);
    return null;
  }
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

  // Effect para carregar dados do perfil quando usuário muda
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        setLoading(true);
        console.log("🔄 ProfileContext: Iniciando fetchProfileData para usuário:", user.id);
        // Buscar do banco de dados
        try {
          const dbProfile = await fetchProfileFromDB(user.id);
          if (dbProfile) {
            console.log("✅ ProfileContext: Dados do banco carregados:", dbProfile);
            setProfileData({
              nome: dbProfile.nome || "Suporte EmpresaZul",
              empresa: dbProfile.empresa || "EmpresaZul",
              email: user.email || dbProfile.email || "suporte@empresazul.com",
              telefone: dbProfile.telefone || "(11) 99999-9999",
              cargo: dbProfile.cargo || "Diretor Financeiro",
            });
          } else {
            console.log("⚠️ ProfileContext: Nenhum perfil encontrado no banco, definindo dados padrão.");
            // Se não há dados, usar padrão
            setProfileData({
              nome: "Suporte EmpresaZul",
              empresa: "EmpresaZul",
              email: user.email || "suporte@empresazul.com",
              telefone: "(11) 99999-9999",
              cargo: "Diretor Financeiro",
            });
          }
        } catch (error) {
          console.error("❌ ProfileContext: Erro ao carregar perfil do Supabase:", error);
          // Fallback para dados padrão em caso de erro
          setProfileData({
            nome: "Suporte EmpresaZul",
            empresa: "EmpresaZul",
            email: user.email || "suporte@empresazul.com",
            telefone: "(11) 99999-9999",
            cargo: "Diretor Financeiro",
          });
        }
        setLoading(false);
      } else {
        console.log("⏳ ProfileContext: Usuário não autenticado, aguardando ou resetando perfil.");
        // Opcional: resetar profileData para valores padrão quando não há usuário logado
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

  // Effect para escutar eventos de sincronização entre abas
  useEffect(() => {
    console.log("🔔 ProfileContext: Configurando listener de sincronização");
    
    const unsubscribe = subscribeToProfileSync((syncData) => {
      console.log("🔔 ProfileContext: Recebendo dados de sincronização:", syncData);
      
      // Atualizar o contexto imediatamente com os dados sincronizados
      setProfileData({
        nome: syncData.nome,
        empresa: syncData.empresa,
        email: user?.email || "suporte@empresazul.com",
        telefone: syncData.telefone,
        cargo: syncData.cargo,
      });
      
      console.log("✅ ProfileContext: Contexto atualizado via sincronização");
    });

    // Listener para refresh forçado
    const handleForceRefresh = () => {
      console.log("🔄 ProfileContext: Refresh forçado recebido, recarregando...");
      if (user) {
        fetchProfileFromDB(user.id).then(dbProfile => {
          if (dbProfile) {
            setProfileData({
              nome: dbProfile.nome || "Suporte EmpresaZul",
              empresa: dbProfile.empresa || "EmpresaZul",
              email: user.email || dbProfile.email || "suporte@empresazul.com",
              telefone: dbProfile.telefone || "(11) 99999-9999",
              cargo: dbProfile.cargo || "Diretor Financeiro",
            });
            console.log("✅ ProfileContext: Refresh forçado concluído");
          }
        });
      }
    };

    window.addEventListener("forceProfileRefresh", handleForceRefresh);

    // Cleanup
    return () => {
      console.log("🧹 ProfileContext: Limpando listeners");
      unsubscribe();
      window.removeEventListener("forceProfileRefresh", handleForceRefresh);
    };
  }, [user]);

  const updateProfileData = (data: Partial<ProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...data }));
    console.log("🔄 ProfileContext: Contexto global atualizado com:", data);
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