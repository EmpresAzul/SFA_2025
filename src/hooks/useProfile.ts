import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileContext } from "@/contexts/ProfileContext";
import { useProfilePersistence } from "@/hooks/useProfilePersistence";
import { UserProfile, SubscriptionInfo, ProfileFormData } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      
      if (!user?.id) {
        console.log("Usuário não autenticado, aguardando...");
        return;
      }

      // Buscar dados do banco de dados Supabase PRIMEIRO
      const { data: profileFromDB, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Erro ao carregar perfil do banco:", error);
        throw error;
      }

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

      // Se existem dados no banco, usar eles
      if (profileFromDB) {
        console.log("📦 Dados encontrados no banco de dados, carregando...");
        profileName = profileFromDB.nome || profileName;
        profileTelefone = profileFromDB.telefone || profileTelefone;
        profileEmpresa = profileFromDB.empresa || profileEmpresa;
        profileCargo = profileFromDB.cargo || profileCargo;
        
        if (profileFromDB.endereco_rua) {
          enderecoData = {
            rua: profileFromDB.endereco_rua || enderecoData.rua,
            numero: profileFromDB.endereco_numero || enderecoData.numero,
            complemento: profileFromDB.endereco_complemento || enderecoData.complemento,
            bairro: profileFromDB.endereco_bairro || enderecoData.bairro,
            cidade: profileFromDB.endereco_cidade || enderecoData.cidade,
            estado: profileFromDB.endereco_estado || enderecoData.estado,
            cep: profileFromDB.endereco_cep || enderecoData.cep,
          };
        }
        
        // Atualizar contexto com dados do banco
        updateProfileData({
          nome: profileName,
          empresa: profileEmpresa,
          telefone: profileTelefone,
          cargo: profileCargo,
          email: profileData.email,
        });
      } else {
        // Se não há dados no banco, verificar localStorage como fallback
        const savedProfile = loadProfile();
        if (savedProfile) {
          console.log("📦 Dados encontrados no localStorage, carregando como fallback...");
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
      }

      // Dados do perfil do usuário baseados nos dados encontrados
      const mockProfile: UserProfile = {
        id: user?.id || "user_001",
        email: profileData.email,
        nome: profileName,
        telefone: profileTelefone,
        empresa: profileEmpresa,
        cargo: profileCargo,
        endereco: enderecoData,
        created_at: profileFromDB?.created_at || new Date(Date.now() - 86400000 * 30).toISOString(),
        updated_at: profileFromDB?.updated_at || new Date().toISOString(),
      };

      // Dados simulados da assinatura
      const mockSubscription: SubscriptionInfo = {
        id: "sub_001",
        user_id: user?.id || "user_001",
        plano: "profissional",
        status: "ativo",
        data_ativacao: new Date(Date.now() - 86400000 * 30).toISOString(),
        data_expiracao: new Date(Date.now() + 86400000 * 335).toISOString(),
        valor_mensal: 49.90,
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        updated_at: new Date().toISOString(),
      };

      setProfile(mockProfile);
      setSubscription(mockSubscription);

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

      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      // SALVAR NO BANCO DE DADOS SUPABASE PRIMEIRO
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          nome: data.nome,
          telefone: data.telefone,
          empresa: data.empresa,
          cargo: data.cargo,
          endereco_rua: data.endereco.rua,
          endereco_numero: data.endereco.numero,
          endereco_complemento: data.endereco.complemento,
          endereco_bairro: data.endereco.bairro,
          endereco_cidade: data.endereco.cidade,
          endereco_estado: data.endereco.estado,
          endereco_cep: data.endereco.cep,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error("Erro ao salvar no banco:", error);
        throw error;
      }

      console.log("✅ Dados salvos com sucesso no banco de dados!");

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

      console.log("Perfil que será atualizado no estado:", updatedProfile);
      
      // Salvar TAMBÉM no localStorage como backup
      const saved = saveProfile(data);
      if (saved) {
        console.log("💾 Dados salvos também no localStorage como backup");
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
        description: "Suas informações foram salvas definitivamente no sistema.",
      });

      console.log("✅ Atualização do perfil concluída com sucesso");

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