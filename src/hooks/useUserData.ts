import { useProfileContext } from "@/contexts/ProfileContext";

interface UserData {
  name: string;
  company: string;
  email: string;
}

export const useUserData = (): UserData => {
  const { profileData } = useProfileContext();

  return {
    name: profileData.nome,
    company: profileData.empresa,
    email: profileData.email,
  };
};