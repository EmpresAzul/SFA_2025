import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileContext } from "@/contexts/ProfileContext";
import { useProfilePersistence } from "@/hooks/useProfilePersistence";
import { UserProfile, SubscriptionInfo, ProfileFormData } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";

export const useProfile = () => {
  const { user } = useAuth();
  const { profileData, updateProfileData } = useProfileContext();
  const { saveProfile, loadProfile, hasStoredProfile } = useProfilePersistence();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Carregar dados persistidos se disponível
      const savedProfile = loadProfile();
      let profileName = profileData.nome;
      let profileTelefone = profileData.telefone || "(11) 99999-9999";
      let profileEmpresa = profileData.empresa;
      let profileCargo = profileData.cargo || "Diretor Financeiro";
      let enderecoData = {
        rua: "Rua das Flores",
        numero: "123",
        complemento: "Sala 456",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
      };

      if (savedProfile) {
        console.log("📦 Dados encontrados no localStorage, carregando...");
        profileName = savedProfile.nome || profileName;
        profileTelefone = savedProfile.telefone || profileTelefone;
        profileEmpresa = savedProfile.empresa || profileEmpresa;
        profileCargo = savedProfile.cargo || profileCargo;
        enderecoData = savedProfile.endereco || enderecoData;
        
        // Atualizar contexto com dados salvos
        updateProfileData({
          nome: profileName,
          empresa: profileEmpresa,
          telefone: profileTelefone,
          cargo: profileCargo,
          email: profileData.email,
        });
      } else {
        console.log("📝 Nenhum dado salvo encontrado, usando dados padrão");
      }

      // Dados simulados do perfil do usuário baseados no contexto e localStorage
      const mockProfile: UserProfile = {
        id: user?.id || "user_001",
        email: profileData.email,
        nome: profileName,
        telefone: profileTelefone,
        empresa: profileEmpresa,
        cargo: profileCargo,
        endereco: enderecoData,
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 dias atrás
        updated_at: savedProfile?.lastUpdated || new Date().toISOString(),
      };

      // Dados simulados da assinatura
      const mockSubscription: SubscriptionInfo = {
        id: "sub_001",
        user_id: user?.id || "user_001",
        plano: "profissional",
        status: "ativo",
        data_ativacao: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 dias atrás
        data_expiracao: new Date(Date.now() + 86400000 * 335).toISOString(), // 335 dias no futuro (quase 1 ano)
        valor_mensal: 49.90,
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        updated_at: new Date().toISOString(),
      };

      setProfile(mockProfile);
      setSubscription(mockSubscription);

      // Em produção, aqui faria as chamadas para o Supabase:
      /*
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;
      if (subscriptionError) throw subscriptionError;

      setProfile(profileData);
      setSubscription(subscriptionData);
      */

    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      toast({
        title: "Erro ao carregar perfil",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileFormData): Promise<void> => {
    console.log("updateProfile chamado com:", data);
    
    if (!user?.id) {
      console.error("Usuário não autenticado");
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      throw new Error("Usuário não autenticado");
    }

    if (!profile) {
      console.error("Perfil não carregado");
      toast({
        title: "Erro",
        description: "Perfil não carregado.",
        variant: "destructive",
      });
      throw new Error("Perfil não carregado");
    }

    try {
      setUpdating(true);
      console.log("Iniciando atualização do perfil com dados:", data);
      console.log("Perfil atual:", profile);

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Criar o perfil atualizado
      const updatedProfile: UserProfile = {
        ...profile,
        nome: data.nome,
        telefone: data.telefone,
        empresa: data.empresa,
        cargo: data.cargo,
        endereco: {
          rua: data.endereco.rua,
          numero: data.endereco.numero,
          complemento: data.endereco.complemento,
          bairro: data.endereco.bairro,
          cidade: data.endereco.cidade,
          estado: data.endereco.estado,
          cep: data.endereco.cep,
        },
        updated_at: new Date().toISOString(),
      };

      console.log("Perfil que será salvo:", updatedProfile);
      
      // Salvar dados completos no localStorage
      const saved = saveProfile(data);
      if (saved) {
        console.log("💾 Dados salvos com sucesso no localStorage");
      } else {
        console.error("❌ Falha ao salvar dados no localStorage");
      }

      // Atualizar o estado local
      setProfile(updatedProfile);
      console.log("Estado do perfil atualizado");
      
      // Atualizar o contexto global para sincronizar com outros componentes
      updateProfileData({
        nome: data.nome,
        empresa: data.empresa,
        email: updatedProfile.email,
        telefone: data.telefone,
        cargo: data.cargo,
      });
      
      // Mostrar toast de sucesso
      toast({
        title: "✅ Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });

      console.log("Toast de sucesso exibido");
      console.log("🔍 Verificando persistência - dados salvos:", {
        hasStoredData: hasStoredProfile(),
        savedData: loadProfile()
      });

      // Em produção, aqui faria a chamada para o Supabase:
      /*
      const { error } = await supabase
        .from('user_profiles')
        .update({
          nome: data.nome,
          telefone: data.telefone,
          empresa: data.empresa,
          cargo: data.cargo,
          endereco: data.endereco,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user?.id);

      if (error) throw error;
      */

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "❌ Erro ao atualizar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUpdating(false);
      console.log("setUpdating(false) executado");
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  return {
    profile,
    subscription,
    loading,
    updating,
    updateProfile,
    refetch: fetchProfile,
  };
};