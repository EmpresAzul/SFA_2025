
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, BarChart3, Trash2 } from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';

const LGPDConsent: React.FC = () => {
  const { useUserConsents, useUpdateConsent, useRequestDataDeletion } = useSecurity();
  
  const { data: consents = [] } = useUserConsents();
  const updateConsent = useUpdateConsent();
  const requestDeletion = useRequestDataDeletion();

  const getConsentStatus = (type: string) => {
    const consent = consents.find(c => c.consent_type === type);
    return consent?.consent_given || false;
  };

  const handleConsentChange = (type: 'data_processing' | 'marketing' | 'analytics', value: boolean) => {
    updateConsent.mutate({ consentType: type, consentGiven: value });
  };

  const handleDataDeletion = () => {
    if (window.confirm('Tem certeza que deseja solicitar a exclusão de todos os seus dados? Esta ação não pode ser desfeita.')) {
      requestDeletion.mutate('Solicitação do usuário via interface');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Consentimentos LGPD
          </CardTitle>
          <CardDescription>
            Gerencie suas preferências de privacidade de acordo com a Lei Geral de Proteção de Dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Processamento de Dados */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-start space-x-3">
              <Eye className="h-5 w-5 mt-0.5 text-gray-500" />
              <div>
                <Label htmlFor="data_processing" className="text-sm font-medium">
                  Processamento de Dados Pessoais
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Permitir o processamento dos seus dados pessoais para funcionalidades essenciais do sistema
                </p>
              </div>
            </div>
            <Switch
              id="data_processing"
              checked={getConsentStatus('data_processing')}
              onCheckedChange={(value) => handleConsentChange('data_processing', value)}
            />
          </div>

          <Separator />

          {/* Marketing */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-start space-x-3">
              <BarChart3 className="h-5 w-5 mt-0.5 text-gray-500" />
              <div>
                <Label htmlFor="marketing" className="text-sm font-medium">
                  Comunicações de Marketing
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Receber informações sobre novidades, promoções e atualizações do sistema
                </p>
              </div>
            </div>
            <Switch
              id="marketing"
              checked={getConsentStatus('marketing')}
              onCheckedChange={(value) => handleConsentChange('marketing', value)}
            />
          </div>

          <Separator />

          {/* Analytics */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-start space-x-3">
              <BarChart3 className="h-5 w-5 mt-0.5 text-gray-500" />
              <div>
                <Label htmlFor="analytics" className="text-sm font-medium">
                  Análise de Uso
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Permitir coleta de dados anônimos para melhorar a experiência do usuário
                </p>
              </div>
            </div>
            <Switch
              id="analytics"
              checked={getConsentStatus('analytics')}
              onCheckedChange={(value) => handleConsentChange('analytics', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Direito ao Esquecimento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Direito ao Esquecimento
          </CardTitle>
          <CardDescription>
            Solicite a exclusão completa de todos os seus dados pessoais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">
              <strong>Atenção:</strong> A solicitação de exclusão de dados é irreversível. 
              Todos os seus dados pessoais, lançamentos, cadastros e histórico serão permanentemente removidos do sistema.
              Esta ação será processada em até 30 dias úteis.
            </p>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={handleDataDeletion}
            disabled={requestDeletion.isPending}
            className="w-full"
          >
            {requestDeletion.isPending ? 'Processando...' : 'Solicitar Exclusão de Dados'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LGPDConsent;
