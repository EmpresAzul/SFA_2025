import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MapPin, Mail, Save, Settings } from "lucide-react";
import { UserProfile, ProfileFormData } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormProps {
  profile: UserProfile;
  onUpdate: (data: ProfileFormData) => Promise<void>;
  loading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  profile, 
  onUpdate, 
  loading = false 
}) => {
  // Inicializar o formulário com dados do perfil
  const [formData, setFormData] = useState<ProfileFormData>({
    nome: profile.nome || '',
    telefone: profile.telefone || '',
    empresa: profile.empresa || '',
    cargo: profile.cargo || '',
    endereco: {
      rua: profile.endereco?.rua || '',
      numero: profile.endereco?.numero || '',
      complemento: profile.endereco?.complemento || '',
      bairro: profile.endereco?.bairro || '',
      cidade: profile.endereco?.cidade || '',
      estado: profile.endereco?.estado || '',
      cep: profile.endereco?.cep || '',
    },
  });

  // Atualizar formulário quando o perfil mudar
  React.useEffect(() => {
    setFormData({
      nome: profile.nome || '',
      telefone: profile.telefone || '',
      empresa: profile.empresa || '',
      cargo: profile.cargo || '',
      endereco: {
        rua: profile.endereco?.rua || '',
        numero: profile.endereco?.numero || '',
        complemento: profile.endereco?.complemento || '',
        bairro: profile.endereco?.bairro || '',
        cidade: profile.endereco?.cidade || '',
        estado: profile.endereco?.estado || '',
        cep: profile.endereco?.cep || '',
      },
    });
  }, [profile]);



  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.nome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (formData.telefone && !validateTelefone(formData.telefone)) {
      toast({
        title: "Telefone inválido",
        description: "Digite um telefone válido com DDD (10 ou 11 dígitos).",
        variant: "destructive",
      });
      return;
    }

    try {
      await onUpdate(formData);
      // Não limpar o formulário após salvar para manter os dados visíveis
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as informações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const formatTelefone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a máscara (11) 99999-9999 ou (11) 9999-9999
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else if (limitedNumbers.length <= 10) {
      // Telefone fixo: (11) 9999-9999
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
    } else {
      // Celular: (11) 99999-9999
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7, 11)}`;
    }
  };

  const validateTelefone = (telefone: string) => {
    if (!telefone.trim()) return true; // Campo opcional
    const numbers = telefone.replace(/\D/g, '');
    // Deve ter 10 dígitos (fixo) ou 11 dígitos (celular)
    return numbers.length === 10 || numbers.length === 11;
  };

  const formatCEP = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 8 dígitos
    const limitedNumbers = numbers.slice(0, 8);
    
    // Aplica a máscara 00000-000
    if (limitedNumbers.length <= 5) {
      return limitedNumbers;
    } else {
      return `${limitedNumbers.slice(0, 5)}-${limitedNumbers.slice(5)}`;
    }
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    if (field === 'telefone') {
      value = formatTelefone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEnderecoChange = (field: keyof ProfileFormData['endereco'], value: string) => {
    if (field === 'cep') {
      value = formatCEP(value);
    }
    
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value
      }
    }));
  };



  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
      {/* Informações Básicas - 50% */}
      <div>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="nome" className="text-sm font-medium">
                    Nome Completo *
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="border-gray-300 focus:border-blue-500 h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="telefone" className="text-sm font-medium">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="border-gray-300 focus:border-blue-500 h-9"
                    maxLength={15}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="empresa" className="text-sm font-medium">
                    Empresa
                  </Label>
                  <Input
                    id="empresa"
                    value={formData.empresa}
                    onChange={(e) => handleInputChange('empresa', e.target.value)}
                    placeholder="Nome da empresa"
                    className="border-gray-300 focus:border-blue-500 h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cargo" className="text-sm font-medium">
                    Cargo
                  </Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => handleInputChange('cargo', e.target.value)}
                    placeholder="Seu cargo"
                    className="border-gray-300 focus:border-blue-500 h-9"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-3 pt-2">
                <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Endereço
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-3 space-y-1">
                    <Label htmlFor="rua" className="text-sm font-medium">
                      Rua
                    </Label>
                    <Input
                      id="rua"
                      value={formData.endereco.rua}
                      onChange={(e) => handleEnderecoChange('rua', e.target.value)}
                      placeholder="Nome da rua"
                      className="border-gray-300 focus:border-blue-500 h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="numero" className="text-sm font-medium">
                      Número
                    </Label>
                    <Input
                      id="numero"
                      value={formData.endereco.numero}
                      onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                      placeholder="123"
                      className="border-gray-300 focus:border-blue-500 h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="complemento" className="text-sm font-medium">
                      Complemento
                    </Label>
                    <Input
                      id="complemento"
                      value={formData.endereco.complemento}
                      onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
                      placeholder="Apto, sala, etc."
                      className="border-gray-300 focus:border-blue-500 h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="bairro" className="text-sm font-medium">
                      Bairro
                    </Label>
                    <Input
                      id="bairro"
                      value={formData.endereco.bairro}
                      onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                      placeholder="Nome do bairro"
                      className="border-gray-300 focus:border-blue-500 h-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="cidade" className="text-sm font-medium">
                      Cidade
                    </Label>
                    <Input
                      id="cidade"
                      value={formData.endereco.cidade}
                      onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                      placeholder="Cidade"
                      className="border-gray-300 focus:border-blue-500 h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="estado" className="text-sm font-medium">
                      Estado
                    </Label>
                    <Input
                      id="estado"
                      value={formData.endereco.estado}
                      onChange={(e) => handleEnderecoChange('estado', e.target.value)}
                      placeholder="SP"
                      className="border-gray-300 focus:border-blue-500 h-9"
                      maxLength={2}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="cep" className="text-sm font-medium">
                      CEP
                    </Label>
                    <Input
                      id="cep"
                      value={formData.endereco.cep}
                      onChange={(e) => handleEnderecoChange('cep', e.target.value)}
                      placeholder="00000-000"
                      className="border-gray-300 focus:border-blue-500 h-9"
                      maxLength={9}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <Button
                  type="submit"
                  disabled={loading || !formData.nome.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 disabled:opacity-50 h-9"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Salvando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar com Email e Informações - 50% */}
      <div className="space-y-6">
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
                O email não pode ser alterado
              </p>
            </div>
          </CardContent>
        </Card>

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
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm font-medium text-right">{profile.email || 'Não informado'}</span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Empresa:</span>
              <span className="text-sm font-medium text-right">{profile.empresa || 'Não informado'}</span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Cargo:</span>
              <span className="text-sm font-medium text-right">{profile.cargo || 'Não informado'}</span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Telefone:</span>
              <span className="text-sm font-medium text-right">{profile.telefone || 'Não informado'}</span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Endereço:</span>
              <span className="text-sm font-medium text-right max-w-[60%]">
                {profile.endereco?.rua && profile.endereco?.numero 
                  ? `${profile.endereco.rua}, ${profile.endereco.numero}${profile.endereco?.complemento ? `, ${profile.endereco.complemento}` : ''}` 
                  : 'Não informado'}
              </span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Bairro:</span>
              <span className="text-sm font-medium text-right">{profile.endereco?.bairro || 'Não informado'}</span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Cidade/UF:</span>
              <span className="text-sm font-medium text-right">
                {profile.endereco?.cidade && profile.endereco?.estado 
                  ? `${profile.endereco.cidade}/${profile.endereco.estado}` 
                  : 'Não informado'}
              </span>
            </div>
            <div className="flex items-start justify-between py-1.5">
              <span className="text-sm text-gray-600">CEP:</span>
              <span className="text-sm font-medium text-right">{profile.endereco?.cep || 'Não informado'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Configurações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Conta criada em:</span>
              <span className="text-sm font-medium">
                {new Date(profile.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-sm text-gray-600">Última atualização:</span>
              <span className="text-sm font-medium">
                {new Date(profile.updated_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-gray-600">ID do usuário:</span>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                {profile.id.slice(-8)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};