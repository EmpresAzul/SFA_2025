
import React from 'react';
import { useSupport } from '@/hooks/useSupport';
import ChatInterface from '@/components/support/ChatInterface';
import SupportSidebar from '@/components/support/SupportSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Settings, Phone, Mail, MapPin, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Suporte: React.FC = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    hasApiKey,
    isCheckingConfig,
    sendMessage,
    recheckConfiguration,
  } = useSupport();

  const openWhatsApp = () => {
    window.open('https://wa.me/5519990068219', '_blank');
  };

  if (isCheckingConfig) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando configurações...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-6">
                <Bot className="w-8 h-8 text-violet-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Agente Inteligente Não Configurado
              </h2>
              
              <p className="text-gray-600 mb-6">
                O agente inteligente ainda não foi configurado pelo administrador. 
                Configure as credenciais da OpenAI para ativar o assistente.
              </p>
              
              <div className="space-y-4">
                <Link to="/admin/settings">
                  <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Configurar Agente Inteligente
                  </Button>
                </Link>
                
                <Button
                  onClick={recheckConfiguration}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Verificar Configurações Novamente
                </Button>
                
                <Button
                  onClick={openWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Suporte WhatsApp
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  suporte@fluxoazul.com
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  São Paulo | SP
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <Settings className="w-4 h-4 inline mr-1" />
                  Administradores podem configurar o agente inteligente nas configurações do sistema.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Principal */}
        <div className="lg:col-span-2">
          <ChatInterface
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            isLoading={isLoading}
            onSendMessage={sendMessage}
          />
        </div>

        {/* Painel Lateral */}
        <SupportSidebar onOpenWhatsApp={openWhatsApp} />
      </div>
    </div>
  );
};

export default Suporte;
