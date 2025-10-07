import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileContext } from "@/contexts/ProfileContext";
import { UserProfile, SubscriptionInfo, ProfileFormData } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { emitProfileSync, subscribeToProfileSync, forceProfileRefresh } from "@/utils/profileSync";

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
        .eq('id', user.id)
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
            id: user.id,
            nome: profileName,
            telefone: profileTelefone,
            empresa: profileEmpresa,
            cargo: profileCargo,
            email: user.email,
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
    console.log("🔄 useProfile.updateProfile: INÍCIO DA FUNÇÃO");
    console.log("📝 useProfile.updateProfile: Dados recebidos:", data);
    console.log("👤 useProfile.updateProfile: User atual:", { id: user?.id, email: user?.email });
    console.log("🔍 useProfile.updateProfile: Profile atual:", profile);
    console.log("🔍 useProfile.updateProfile: Estado loading/updating:", { loading, updating });
    
    // Logs de validação de dados de entrada
    console.log("📊 useProfile.updateProfile: Validação de dados:");
    console.log("  - Nome válido:", !!data.nome?.trim());
    console.log("  - Endereço válido:", !!data.endereco);
    console.log("  - Telefone:", data.telefone || 'não informado');
    console.log("  - Empresa:", data.empresa || 'não informado');
    console.log("  - Cargo:", data.cargo || 'não informado');
    
    if (!user?.id) {
      console.error("❌ useProfile.updateProfile: Usuário não autenticado");
      console.error("❌ useProfile.updateProfile: user object:", user);
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado. Faça login para atualizar seu perfil.",
        variant: "destructive",
      });
      throw new Error("Usuário não autenticado");
    }

    if (!profile) {
      console.error("❌ useProfile.updateProfile: Perfil não carregado");
      console.error("❌ useProfile.updateProfile: profile object:", profile);
      toast({
        title: "Erro",
        description: "Perfil não carregado. Tente recarregar a página.",
        variant: "destructive",
      });
      throw new Error("Perfil não carregado");
    }

    try {
      console.log("🚀 useProfile.updateProfile: Iniciando processo de atualização...");
      setUpdating(true);
      console.log("🔄 useProfile.updateProfile: setUpdating(true) executado");

      // Preparar dados para o Supabase
      const supabaseData = {
        id: user.id,
        nome: data.nome.trim(),
        telefone: data.telefone?.trim() || null,
        empresa: data.empresa?.trim() || null,
        cargo: data.cargo?.trim() || null,
        email: user.email,
        endereco_rua: data.endereco.rua?.trim() || null,
        endereco_numero: data.endereco.numero?.trim() || null,
        endereco_complemento: data.endereco.complemento?.trim() || null,
        endereco_bairro: data.endereco.bairro?.trim() || null,
        endereco_cidade: data.endereco.cidade?.trim() || null,
        endereco_estado: data.endereco.estado?.trim() || null,
        endereco_cep: data.endereco.cep?.trim() || null,
        updated_at: new Date().toISOString(),
      };

      console.log("📤 useProfile.updateProfile: Dados preparados para Supabase:", supabaseData);
      console.log("⏰ useProfile.updateProfile: Timestamp antes da operação no banco:", new Date().toISOString());

      const { data: savedData, error } = await supabase
        .from('profiles')
        .upsert(supabaseData)
        .select()
        .single();

      console.log("⏰ useProfile.updateProfile: Timestamp após operação no banco:", new Date().toISOString());

      if (error) {
        console.error("❌ useProfile.updateProfile: Erro completo do Supabase:", error);
        console.error("❌ useProfile.updateProfile: Error message:", error.message);
        console.error("❌ useProfile.updateProfile: Error details:", error.details);
        console.error("❌ useProfile.updateProfile: Error hint:", error.hint);
        console.error("❌ useProfile.updateProfile: Error code:", error.code);
        
        toast({
          title: "❌ Erro ao salvar no banco",
          description: `Erro ${error.code}: ${error.message}`,
          variant: "destructive",
          duration: 6000,
        });
        throw error;
      }

      console.log("✅ useProfile.updateProfile: Dados salvos com sucesso no banco:", savedData);

      // SINCRONIZAÇÃO IMEDIATA E FORÇADA
      console.log("🔄 useProfile.updateProfile: Iniciando sincronização imediata...");

      // 1. Atualizar contexto global PRIMEIRO
      const contextData = {
        nome: data.nome,
        empresa: data.empresa || "EmpresaZul",
        telefone: data.telefone || "(11) 99999-9999",
        cargo: data.cargo || "Diretor Financeiro",
        email: user.email || "suporte@empresazul.com",
      };
      
      console.log("🔄 useProfile.updateProfile: Atualizando contexto global com:", contextData);
      updateProfileData(contextData);
      console.log("✅ useProfile.updateProfile: Contexto global atualizado");

      // 2. Atualizar estado local do perfil IMEDIATAMENTE
      const newProfile: UserProfile = {
        id: user.id,
        email: user.email || "suporte@empresazul.com",
        nome: data.nome,
        telefone: data.telefone || "",
        empresa: data.empresa || "",
        cargo: data.cargo || "",
        endereco: data.endereco,
        created_at: profile.created_at,
        updated_at: new Date().toISOString(),
      };

      console.log("🔄 useProfile.updateProfile: Atualizando estado local com:", newProfile);
      setProfile(newProfile);
      console.log("✅ useProfile.updateProfile: Estado local atualizado");

      // 3. Emitir evento de sincronização global
      console.log("🔄 useProfile.updateProfile: Emitindo evento de sincronização global...");
      emitProfileSync({
        nome: data.nome,
        empresa: data.empresa || "EmpresaZul",
        telefone: data.telefone || "(11) 99999-9999",
        cargo: data.cargo || "Diretor Financeiro",
        endereco: data.endereco,
        timestamp: new Date().toISOString(),
      });
      console.log("✅ useProfile.updateProfile: Evento de sincronização emitido");

      // 4. Forçar re-fetch do banco para garantir sincronização total
      console.log("🔄 useProfile.updateProfile: Iniciando re-fetch do banco...");
      setTimeout(async () => {
        console.log("🔄 useProfile.updateProfile: Executando fetchProfile para sincronização final...");
        await fetchProfile();
        console.log("✅ useProfile.updateProfile: Re-fetch do banco concluído");
        
        // Forçar refresh completo de todos os componentes
        forceProfileRefresh();
        console.log("🔄 useProfile.updateProfile: Refresh forçado emitido");
      }, 100);

      // Toast de sucesso removido daqui - será mostrado no componente

      console.log("🎉 useProfile.updateProfile: ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!");
      console.log("🎯 useProfile.updateProfile: Profile final:", newProfile);

    } catch (error) {
      console.error("❌ useProfile.updateProfile: ERRO CRÍTICO:", error);
      console.error("❌ useProfile.updateProfile: Error name:", error instanceof Error ? error.name : 'Não é um Error');
      console.error("❌ useProfile.updateProfile: Error message:", error instanceof Error ? error.message : 'Mensagem não disponível');
      console.error("❌ useProfile.updateProfile: Error stack:", error instanceof Error ? error.stack : 'Stack não disponível');
      
      let errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      if (error && typeof error === 'object' && 'code' in error) {
        errorMessage += ` | Código: ${(error as any).code}`;
      }
      if (error && typeof error === 'object' && 'details' in error) {
        errorMessage += ` | Detalhes: ${(error as any).details}`;
      }
      if (error && typeof error === 'object' && 'hint' in error) {
        errorMessage += ` | Dica: ${(error as any).hint}`;
      }
      toast({
        title: "❌ Erro ao salvar perfil",
        description: `Falha crítica: ${errorMessage}. Consulte os logs do console e envie para o suporte se necessário.`,
        variant: "destructive",
        duration: 10000,
      });
      throw error;
    } finally {
      console.log("🔄 useProfile.updateProfile: Executando bloco finally...");
      setUpdating(false);
      console.log("🔄 useProfile.updateProfile: setUpdating(false) executado - finally");
      console.log("🏁 useProfile.updateProfile: FIM DA FUNÇÃO");
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