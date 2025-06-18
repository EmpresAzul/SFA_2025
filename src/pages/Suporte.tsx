
import React from 'react';
import { useSupport } from '@/hooks/useSupport';
import ApiKeySetup from '@/components/support/ApiKeySetup';
import ChatInterface from '@/components/support/ChatInterface';
import SupportSidebar from '@/components/support/SupportSidebar';

const Suporte: React.FC = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    openaiApiKey,
    setOpenaiApiKey,
    hasApiKey,
    isSettingUp,
    saveApiKey,
    sendMessage,
  } = useSupport();

  const openWhatsApp = () => {
    window.open('https://wa.me/5519990068219', '_blank');
  };

  if (!hasApiKey) {
    return (
      <ApiKeySetup
        openaiApiKey={openaiApiKey}
        setOpenaiApiKey={setOpenaiApiKey}
        isSettingUp={isSettingUp}
        onSave={saveApiKey}
        onOpenWhatsApp={openWhatsApp}
      />
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
