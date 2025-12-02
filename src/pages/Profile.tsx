import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { profile, subscription, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nome: '',
    empresa: '',
    cargo: '',
    telefone: ''
  });
  const [saving, setSaving] = useState(false);

  // Função para aplicar máscara de telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleEdit = () => {
    setEditData({
      nome: profile?.nome || '',
      empresa: profile?.empresa || '',
      cargo: profile?.cargo || '',
      telefone: profile?.telefone || ''
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ nome: '', empresa: '', cargo: '', telefone: '' });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validar campos obrigatórios
      if (!editData.nome.trim()) {
        toast({
          title: "Erro de validação",
          description: "O nome é obrigatório.",
          variant: "destructive",
        });
        return;
      }
      
      // Preparar dados no formato correto para ProfileFormData
      const profileData = {
        nome: editData.nome.trim(),
        telefone: editData.telefone.trim(),
        empresa: editData.empresa.trim(),
        cargo: editData.cargo.trim(),
        endereco: {
          rua: profile?.endereco?.rua || '',
          numero: profile?.endereco?.numero || '',
          complemento: profile?.endereco?.complemento || '',
          bairro: profile?.endereco?.bairro || '',
          cidade: profile?.endereco?.cidade || '',
          estado: profile?.endereco?.estado || '',
          cep: profile?.endereco?.cep || ''
        }
      };
      
      console.log('Salvando perfil:', profileData);
      await updateProfile(profileData);
      
      // Sucesso - mostrar mensagem e redirecionar
      toast({
        title: "Perfil Atualizado com Sucesso!!!",
        description: "Suas informações foram salvas e sincronizadas.",
        duration: 3000,
      });
      
      setIsEditing(false);
      
      // Redirecionar para /dashboard/perfil após 1 segundo
      setTimeout(() => {
        navigate('/dashboard/perfil');
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setEditData({ ...editData, telefone: formatted });
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
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Header Premium */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Meu Perfil
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Gerencie suas informações pessoais e preferências
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo do Perfil */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-white" />
                <span className="text-white">Informações Pessoais</span>
              </div>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-white text-blue-600 hover:bg-white/90"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {!isEditing ? (
              <>
                <div className="flex items-start justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Nome:</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">{profile.nome || 'Não informado'}</span>
                </div>
                <div className="flex items-start justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Empresa:</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">{profile.empresa || 'Não informado'}</span>
                </div>
                <div className="flex items-start justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Cargo:</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">{profile.cargo || 'Não informado'}</span>
                </div>
                <div className="flex items-start justify-between py-3">
                  <span className="text-sm font-medium text-gray-500">Telefone:</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">
                    {profile.telefone ? formatPhone(profile.telefone) : 'Não informado'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Nome:</label>
                  <Input
                    value={editData.nome}
                    onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                    placeholder="Digite seu nome"
                    className="mobile-input-fix"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Empresa:</label>
                  <Input
                    value={editData.empresa}
                    onChange={(e) => setEditData({ ...editData, empresa: e.target.value })}
                    placeholder="Digite o nome da empresa"
                    className="mobile-input-fix"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Cargo:</label>
                  <Input
                    value={editData.cargo}
                    onChange={(e) => setEditData({ ...editData, cargo: e.target.value })}
                    placeholder="Digite seu cargo"
                    className="mobile-input-fix"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Telefone:</label>
                  <Input
                    value={editData.telefone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    className="mobile-input-fix"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Email */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-white" />
              <span className="text-white">Email da Conta</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <p className="text-base font-semibold text-gray-900">{profile.email}</p>
              <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Email verificado e vinculado à conta
              </p>
            </div>
          </CardContent>
        </Card>


      </div>


    </div>
  );
};

export default Profile;