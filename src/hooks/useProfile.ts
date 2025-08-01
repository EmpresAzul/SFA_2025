import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileContext } from "@/contexts/ProfileContext";
import { UserProfile, SubscriptionInfo, ProfileFormData } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfile = () => {
  const { user } = useAuth();
  const { profileData, updateProfileData } = useProfileContext();
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
        setLoading(false); // Garantir que o loading seja setado para false
        return;
      }

      console.log("🔍 Buscando perfil do usuário:", user.id);

      // 1. BUSCAR DADOS DO BANCO DE DADOS SUPABASE PRIMEIRO (PRIORIDADE MÁXIMA)
      const { data: profileFromDB, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
        console.error("❌ Erro ao carregar perfil do banco:", error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar seu perfil. Tente novamente mais tarde.",
          variant: "destructive",
        });
        throw error;
      }

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

      if (profileFromDB) {
        console.log("✅ Dados encontrados no banco de dados:", profileFromDB);
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
        console.log("🔄 Atualizando contexto com dados do banco...");
      } else {
        console.log("⚠️ Nenhum dado encontrado no banco, criando perfil padrão...");
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

      updateProfileData({
        nome: profileName,
        empresa: profileEmpresa,
        telefone: profileTelefone,
        cargo: profileCargo,
        email: user.email || "suporte@empresazul.com",
      });

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
      console.error("❌ Erro geral ao carregar perfil:", error);
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
    console.log("👤 User ID:", user?.id);
    console.log("📝 Dados completos a serem salvos:", {
      user_id: user?.id,
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
    });
    
    if (!user?.id) {
      console.error("❌ Usuário não autenticado. Não é possível atualizar o perfil.");
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado. Faça login para atualizar seu perfil.",
        variant: "destructive",
      });
      throw new Error("Usuário não autenticado");
    }

    if (!profile) {
      console.error("❌ Perfil não carregado. Não é possível atualizar.");
      toast({
        title: "Erro",
        description: "Perfil não carregado. Tente recarregar a página.",
        variant: "destructive",
      });
      throw new Error("Perfil não carregado");
    }

    try {
      setUpdating(true);
      console.log("🚀 Iniciando atualização do perfil...");

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
        console.error("❌ Detalhes completos do erro Supabase:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log("✅ Dados salvos com sucesso no banco de dados:", savedData);

      console.log("🔄 Recarregando perfil do banco para sincronização completa...");
      await fetchProfile();

      toast({
        title: "✅ Perfil salvo com sucesso!",
        description: "Suas informações foram salvas definitivamente e permanecerão após logout/login.",
        duration: 4000,
      });

      console.log("🎉 Atualização do perfil concluída com sucesso!");

    } catch (error) {
      console.error("❌ Erro ao atualizar perfil:", error);
      toast({
        title: "❌ Erro ao salvar perfil",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado ao salvar. Tente novamente.",
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
    } else {
      // Se não há usuário, limpar perfil localmente para evitar dados de sessões anteriores
      setProfile(null);
      setSubscription(null);
      setLoading(false);
      console.log("ℹ️ useProfile: Usuário deslogado, perfil local limpo.");
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