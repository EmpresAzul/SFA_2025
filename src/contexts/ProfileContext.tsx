import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

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

// Função para carregar dados do banco Supabase
const fetchProfileFromDB = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar perfil do banco:', error);
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

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        setLoading(true);
        // Buscar do banco de dados
        const dbProfile = await fetchProfileFromDB(user.id);
        if (dbProfile) {
          setProfileData({
            nome: dbProfile.nome || "Suporte EmpresaZul",
            empresa: dbProfile.empresa || "EmpresaZul",
            email: user.email || dbProfile.email || "suporte@empresazul.com",
            telefone: dbProfile.telefone || "(11) 99999-9999",
            cargo: dbProfile.cargo || "Diretor Financeiro",
          });
        } else {
          // Se não há dados, usar padrão
          setProfileData({
            nome: "Suporte EmpresaZul",
            empresa: "EmpresaZul",
            email: user.email || "suporte@empresazul.com",
            telefone: "(11) 99999-9999",
            cargo: "Diretor Financeiro",
          });
        }
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  const updateProfileData = (data: Partial<ProfileData>) => {
    setProfileData((prev) => ({ ...prev, ...data }));
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