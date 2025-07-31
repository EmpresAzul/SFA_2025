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
        console.log("⏳ Usuário não autenticado, aguardando...");
        return;
      }

      console.log("🔍 Buscando perfil do usuário:", user.id);

      // 1. BUSCAR DADOS DO BANCO DE DADOS SUPABASE PRIMEIRO (PRIORIDADE MÁXIMA)
      const { data: profileFromDB, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("❌ Erro ao carregar perfil do banco:", error);
        throw error;
      }

      // Dados padrão como fallback
      let profileName = "Suporte EmpresaZul";
      let profileTelefone = "(11) 99999-9999";
      let profileEmpresa = "EmpresaZul";
      let profileCargo = "Diretor Financeiro";
      let enderecoData = {
        rua: "Rua das Flores",
        numero: "123",
        complemento: "Sala 456",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
      };

      // 2. Se existem dados no banco, usar eles (PRIORIDADE MÁXIMA)
      if (profileFromDB) {
        console.log("✅ Dados encontrados no banco de dados:", profileFromDB);
        profileName = profileFromDB.nome || profileName;
        profileTelefone = profileFromDB.telefone || profileTelefone;
        profileEmpresa = profileFromDB.empresa || profileEmpresa;
        profileCargo = profileFromDB.cargo || profileCargo;
        
        // Montar endereço do banco
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
        
        console.log("🔄 Atualizando contexto com dados do banco...");
      } else {
        console.log("⚠️ Nenhum dado encontrado no banco, usando dados padrão");
        
        // 3. Se não há dados no banco, criar perfil padrão
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            nome: profileName,
            telefone: profileTelefone,
            empresa: profileEmpresa,
            cargo: profileCargo,
            endereco_rua: enderecoData.rua,
            endereco_numero: enderecoData.numero,
            endereco_complemento: enderecoData.complemento,
            endereco_bairro: enderecoData.bairro,
            endereco_cidade: enderecoData.cidade,
            endereco_estado: enderecoData.estado,
            endereco_cep: enderecoData.cep,
          });

        if (insertError) {
          console.error("❌ Erro ao criar perfil padrão:", insertError);
        } else {
          console.log("✅ Perfil padrão criado no banco de dados");
        }
      }

      // 4. Atualizar contexto global com dados confirmados
      updateProfileData({
        nome: profileName,
        empresa: profileEmpresa,
        telefone: profileTelefone,
        cargo: profileCargo,
        email: user.email || "suporte@empresazul.com",
      });

      // 5. Criar objeto do perfil final
      const finalProfile: UserProfile = {
        id: user.id,
        email: user.email || "suporte@empresazul.com",
        nome: profileName,
        telefone: profileTelefone,
        empresa: profileEmpresa,
        cargo: profileCargo,
        endereco: enderecoData,
        created_at: profileFromDB?.created_at || new Date(Date.now() - 86400000 * 30).toISOString(),
        updated_at: profileFromDB?.updated_at || new Date().toISOString(),
      };

      // 6. Dados da assinatura (simulados)
      const subscriptionData: SubscriptionInfo = {
        id: "sub_001",
        user_id: user.id,
        plano: "profissional",
        status: "ativo",
        data_ativacao: new Date(Date.now() - 86400000 * 30).toISOString(),
        data_expiracao: new Date(Date.now() + 86400000 * 335).toISOString(),
        valor_mensal: 49.90,
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        updated_at: new Date().toISOString(),
      };

      setProfile(finalProfile);
      setSubscription(subscriptionData);

      console.log("🎉 Perfil carregado com sucesso:", finalProfile);

    } catch (error) {
      console.error("❌ Erro ao carregar perfil:", error);
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
    console.log("🔄 updateProfile chamado com:", data);
    
    if (!user?.id) {
      console.error("❌ Usuário não autenticado");
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      throw new Error("Usuário não autenticado");
    }

    if (!profile) {
      console.error("❌ Perfil não carregado");
      toast({
        title: "Erro",
        description: "Perfil não carregado.",
        variant: "destructive",
      });
      throw new Error("Perfil não carregado");
    }

    try {
      setUpdating(true);
      console.log("🚀 Iniciando atualização do perfil...");

      // 1. SALVAR NO BANCO DE DADOS SUPABASE (PRIORIDADE MÁXIMA)
      const { data: savedData, error } = await supabase
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
        .select()
        .single();

      if (error) {
        console.error("❌ Erro ao salvar no banco:", error);
        throw error;
      }

      console.log("✅ Dados salvos com sucesso no banco de dados:", savedData);

      // 2. Criar o perfil atualizado com dados confirmados do banco
      const updatedProfile: UserProfile = {
        ...profile,
        nome: savedData.nome,
        telefone: savedData.telefone,
        empresa: savedData.empresa,
        cargo: savedData.cargo,
        endereco: {
          rua: savedData.endereco_rua || '',
          numero: savedData.endereco_numero || '',
          complemento: savedData.endereco_complemento || '',
          bairro: savedData.endereco_bairro || '',
          cidade: savedData.endereco_cidade || '',
          estado: savedData.endereco_estado || '',
          cep: savedData.endereco_cep || '',
        },
        updated_at: savedData.updated_at,
      };

      // 3. Atualizar o estado local
      setProfile(updatedProfile);
      console.log("✅ Estado do perfil atualizado localmente");
      
      // 4. Atualizar o contexto global para sincronizar com Header e outros componentes
      updateProfileData({
        nome: savedData.nome,
        empresa: savedData.empresa,
        email: updatedProfile.email,
        telefone: savedData.telefone,
        cargo: savedData.cargo,
      });
      console.log("✅ Contexto global atualizado");

      // 5. Salvar no localStorage como backup (opcional)
      const saved = saveProfile(data);
      if (saved) {
        console.log("💾 Backup salvo no localStorage");
      }
      
      // 6. Mostrar toast de sucesso
      toast({
        title: "✅ Perfil salvo com sucesso!",
        description: "Suas informações foram salvas definitivamente e permanecerão após logout/login.",
        duration: 4000,
      });

      console.log("🎉 Atualização do perfil concluída com sucesso!");

      // 2. Atualizar estado local e contexto global
      await fetchProfile(); // <-- Força recarregar do banco

    } catch (error) {
      console.error("❌ Erro ao atualizar perfil:", error);
      toast({
        title: "❌ Erro ao salvar perfil",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    } finally {
      setUpdating(false);
      console.log("🔄 setUpdating(false) executado");
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