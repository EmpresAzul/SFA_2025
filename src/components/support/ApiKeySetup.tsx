
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Phone, Mail, MapPin } from 'lucide-react';

interface ApiKeySetupProps {
  openaiApiKey: string;
  setOpenaiApiKey: (value: string) => void;
  isSettingUp: boolean;
  onSave: () => void;
  onOpenWhatsApp: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({
  openaiApiKey,
  setOpenaiApiKey,
  isSettingUp,
  onSave,
  onOpenWhatsApp
}) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-violet-500" />
              Configuração do Agente Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Para ativar o agente inteligente de suporte, configure sua API key da OpenAI:
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="apikey">API Key da OpenAI</Label>
              <Input
                id="apikey"
                type="password"
                placeholder="sk-..."
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
              />
            </div>

            <Button 
              onClick={onSave} 
              disabled={isSettingUp}
              className="w-full bg-violet-500 hover:bg-violet-600"
            >
              {isSettingUp ? 'Configurando...' : 'Ativar Agente Inteligente'}
            </Button>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Outras formas de suporte:</h3>
              <div className="space-y-2">
                <Button
                  onClick={onOpenWhatsApp}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Suporte WhatsApp
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  suporte@fluxoazul.com
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  São Paulo | SP
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiKeySetup;
