
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Message, SupportState } from '@/types/support';

export const useSupport = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isCheckingConfig, setIsCheckingConfig] = useState(true);
  const { toast } = useToast();

  const checkConfiguration = async () => {
    setIsCheckingConfig(true);
    try {
      console.log('Verificando configuração do agente inteligente...');
      
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', ['openai_api_key', 'openai_assistant_id']);

      if (error) {
        console.error('Erro ao verificar configuração:', error);
        throw error;
      }

      console.log('Dados de configuração recebidos:', data);

      const settings = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);

      console.log('Settings processadas:', settings);

      // Verificar se ambas as configurações existem e não são nulas/vazias
      const apiKey = settings['openai_api_key'];
      const assistantId = settings['openai_assistant_id'];
      
      console.log('API Key existe:', !!apiKey);
      console.log('Assistant ID existe:', !!assistantId);

      const hasRequiredConfig = !!(apiKey && apiKey.trim() && assistantId && assistantId.trim());
      
      console.log('Configuração válida:', hasRequiredConfig);
      
      setHasApiKey(hasRequiredConfig);
      
      if (hasRequiredConfig) {
        console.log('Configuração válida encontrada, iniciando chat...');
        addBotMessage("Olá! Sou seu assistente inteligente do FluxoAzul. Como posso ajudá-lo hoje?");
      } else {
        console.log('Configuração incompleta - API Key ou Assistant ID não encontrados');
      }
    } catch (error) {
      console.error('Erro ao verificar configuração:', error);
      setHasApiKey(false);
    } finally {
      setIsCheckingConfig(false);
    }
  };

  const addBotMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async (message: string = inputMessage) => {
    if (!message.trim() || isLoading) return;

    console.log('Enviando mensagem:', message);
    addUserMessage(message);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('Chamando edge function chat-support-advanced...');
      const { data, error } = await supabase.functions.invoke('chat-support-advanced', {
        body: { message },
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : {}
      });

      if (error) {
        console.error('Erro na edge function:', error);
        throw error;
      }

      console.log('Resposta da edge function:', data);

      if (data && data.response) {
        addBotMessage(data.response);
      } else {
        console.warn('Resposta vazia ou inválida da edge function');
        addBotMessage("Desculpe, não consegui processar sua mensagem. Tente novamente.");
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      addBotMessage("Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente ou entre em contato pelo WhatsApp.");
      
      toast({
        title: "Erro na comunicação",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConfiguration();
  }, []);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    hasApiKey,
    isCheckingConfig,
    sendMessage,
    recheckConfiguration: checkConfiguration,
  };
};
