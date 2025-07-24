import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSecurity } from "@/hooks/useSecurity";
import { SecuritySettings } from '@/components/security/SecuritySettings';
import AdminSecurityDashboard from '@/components/security/AdminSecurityDashboard';

const SecuritySettingsPage: React.FC = () => {
  const { useIsAdmin } = useSecurity();
  const isAdmin = useIsAdmin();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configurações de Segurança</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas configurações de segurança e monitore atividades suspeitas
          </p>
        </div>

        <Tabs defaultValue="user" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">Configurações do Usuário</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">Painel Administrativo</TabsTrigger>}
          </TabsList>

          <TabsContent value="user" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Configure suas opções de segurança pessoais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SecuritySettings />
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <AdminSecurityDashboard />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;