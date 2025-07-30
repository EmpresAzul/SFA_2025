import { useProfile } from "@/hooks/useProfile";

interface UserData {
  name: string;
  company: string;
  email: string;
}

export const useUserData = (): UserData => {
  const { profile } = useProfile();

  return {
    name: profile?.nome || "Usuário",
    company: profile?.empresa || "Empresa",
    email: profile?.email || "",
  };
};