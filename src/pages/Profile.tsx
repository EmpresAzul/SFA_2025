
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Save, User, Lock, Calendar } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, session, updateUser, updatePassword } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    number: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  // Atualiza o formulário quando o usuário muda
  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata || {};
      setFormData({
        name: metadata.name || '',
        address: metadata.address || '',
        number: metadata.number || '',
        neighborhood: metadata.neighborhood || '',
        city: metadata.city || '',
        state: metadata.state || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await updateUser(formData);
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro na confirmação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const success = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      if (success) {
        toast({
          title: "Senha atualizada!",
          description: "Sua senha foi alterada com sucesso.",
        });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast({
          title: "Erro na autenticação",
          description: "Senha atual incorreta.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar senha",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';
  const registrationDate = user?.created_at ? new Date(user.created_at) : new Date();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-fluxo-text mb-2">
          Meu Perfil
        </h1>
        <p className="text-gray-600">
          Gerencie suas informações pessoais e configurações de conta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gradient-fluxo-text">
              <User className="mr-2 h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="email" className="text-fluxo-blue-900 font-medium">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    O e-mail não pode ser alterado
                  </p>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="name" className="text-fluxo-blue-900 font-medium">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-fluxo-blue-900 font-medium">
                    Endereço
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Rua, Avenida..."
                  />
                </div>

                <div>
                  <Label htmlFor="number" className="text-fluxo-blue-900 font-medium">
                    Número
                  </Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="Número"
                  />
                </div>

                <div>
                  <Label htmlFor="neighborhood" className="text-fluxo-blue-900 font-medium">
                    Bairro
                  </Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="Bairro"
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="text-fluxo-blue-900 font-medium">
                    Cidade
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Cidade"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="state" className="text-fluxo-blue-900 font-medium">
                    UF
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2 h-4 w-4" />
                Data de cadastro: {registrationDate.toLocaleDateString('pt-BR')}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-fluxo hover:gradient-fluxo-light text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gradient-fluxo-text">
              <Lock className="mr-2 h-5 w-5" />
              Alterar Senha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-fluxo-blue-900 font-medium">
                  Senha Atual
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Digite sua senha atual"
                  required
                />
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-fluxo-blue-900 font-medium">
                  Nova Senha
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Digite a nova senha"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-fluxo-blue-900 font-medium">
                  Confirmar Nova Senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirme a nova senha"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-fluxo hover:gradient-fluxo-light text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Lock className="mr-2 h-4 w-4" />
                {loading ? 'Atualizando...' : 'Alterar Senha'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
