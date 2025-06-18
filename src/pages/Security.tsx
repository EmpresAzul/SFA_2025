
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Settings } from 'lucide-react';
import SecurityLogs from '@/components/security/SecurityLogs';
import LGPDConsent from '@/components/security/LGPDConsent';

const Security: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Segurança e Privacidade</h1>
        <p className="text-gray-600">
          Gerencie suas configurações de segurança, privacidade e conformidade com a LGPD
        </p>
      </div>

      <Tabs defaultValue="logs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Logs de Segurança
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Privacidade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <SecurityLogs />
        </TabsContent>

        <TabsContent value="privacy">
          <LGPDConsent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;
