import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { ProfileSettings } from "@/components/profile/ProfileSettings";

const Configuracoes: React.FC = () => {
  const { profile, loading, updating, updateProfile } = useProfile();

  const handleUpdateProfile = async (data: any) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error("Erro no handleUpdateProfile:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="text-center py-12">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erro ao carregar perfil
          </h3>
          <p className="text-gray-600">
            Não foi possível carregar as informações do perfil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ⚙️ Configurações
          </h1>
          <p className="text-gray-600 mt-2">
            Configure suas informações pessoais e preferências
          </p>
        </div>
      </div>

      {/* Configurações do Perfil */}
      <ProfileSettings
        profile={profile}
        onUpdate={handleUpdateProfile}
        loading={updating}
      />
    </div>
  );
};

export default Configuracoes;