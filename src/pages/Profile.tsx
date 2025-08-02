import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionStatus } from "@/components/profile/SubscriptionStatus";
import { LogOut, User, Settings, Calendar, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile: React.FC = () => {
  const { signOut } = useAuth();
  const { profile, subscription, loading } = useProfile();
  const [signOutLoading, setSignOutLoading] = useState(false);

  const handleSignOut = async () => {
    setSignOutLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setSignOutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile || !subscription) {
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
            👤 Meu Perfil
          </h1>
          <p className="text-gray-600 mt-2">
            Visualize suas informações pessoais e configurações da conta
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/dashboard/configuracoes">
            <Button
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </Link>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair da Conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar o sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSignOut}
                  disabled={signOutLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {signOutLoading ? "Saindo..." : "Sair"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Status da Assinatura */}
      <SubscriptionStatus subscription={subscription} />

      {/* Cards de Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Resumo do Perfil */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Resumo do Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Nome:</span>
              <span className="text-sm font-medium text-right">{profile.nome || 'Não informado'}</span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Empresa:</span>
              <span className="text-sm font-medium text-right">{profile.empresa || 'Não informado'}</span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Cargo:</span>
              <span className="text-sm font-medium text-right">{profile.cargo || 'Não informado'}</span>
            </div>
            <div className="flex items-start justify-between py-1.5">
              <span className="text-sm text-gray-600">Telefone:</span>
              <span className="text-sm font-medium text-right">{profile.telefone || 'Não informado'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Email */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm font-medium text-gray-800">{profile.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                Email vinculado à conta
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configurações da Conta */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Configurações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Criado em:</span>
              <span className="text-sm font-medium text-right">
                {new Date(profile.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Última atualização:</span>
              <span className="text-sm font-medium text-right">
                {new Date(profile.updated_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex items-start justify-between py-1.5">
              <span className="text-sm text-gray-600">ID do usuário:</span>
              <span className="text-xs font-mono text-right text-gray-500 break-all">
                {profile.id}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Endereço */}
      {(profile.endereco?.rua || profile.endereco?.cidade) && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg max-w-7xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between py-1 border-b border-gray-100">
                <span className="text-sm text-gray-600">Endereço:</span>
                <span className="text-sm font-medium text-right max-w-[60%]">
                  {profile.endereco?.rua && profile.endereco?.numero 
                    ? `${profile.endereco.rua}, ${profile.endereco.numero}${profile.endereco?.complemento ? `, ${profile.endereco.complemento}` : ''}` 
                    : 'Não informado'}
                </span>
              </div>
              <div className="flex items-start justify-between py-1 border-b border-gray-100">
                <span className="text-sm text-gray-600">Bairro:</span>
                <span className="text-sm font-medium text-right">{profile.endereco?.bairro || 'Não informado'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start justify-between py-1 border-b border-gray-100">
                <span className="text-sm text-gray-600">Cidade/UF:</span>
                <span className="text-sm font-medium text-right">
                  {profile.endereco?.cidade && profile.endereco?.estado 
                    ? `${profile.endereco.cidade}/${profile.endereco.estado}` 
                    : 'Não informado'}
                </span>
              </div>
              <div className="flex items-start justify-between py-1">
                <span className="text-sm text-gray-600">CEP:</span>
                <span className="text-sm font-medium text-right">{profile.endereco?.cep || 'Não informado'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;