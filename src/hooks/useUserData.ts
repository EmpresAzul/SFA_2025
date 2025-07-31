import { useProfile } from "@/hooks/useProfile";
import { useProfileContext } from "@/contexts/ProfileContext";

interface UserData {
  name: string;
  company: string;
  email: string;
}

export const useUserData = (): UserData => {
  const { profile } = useProfile();
  const { profileData } = useProfileContext();

  // Priorizar dados do perfil completo, depois do contexto, depois fallback
  return {
    name: profile?.nome || profileData.nome || "Suporte EmpresaZul",
    company: profile?.empresa || profileData.empresa || "EmpresaZul",
    email: profile?.email || profileData.email || "suporte@empresazul.com",
  };
};