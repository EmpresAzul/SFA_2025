
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
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', ['openai_api_key', 'openai_assistant_id']);

      if (error) throw error;

      const settings = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);

      const hasRequiredConfig = settings['openai_api_key'] && settings['openai_assistant_id'];
      setHasApiKey(!!hasRequiredConfig);
      
      if (hasRequiredConfig) {
        addBotMessage("Olá! Sou seu assistente inteligente do FluxoAzul. Como posso ajudá-lo hoje?");
      }
    } catch (error) {
      console.log('Configuração não encontrada:', error);
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

    addUserMessage(message);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('chat-support-advanced', {
        body: { message },
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : {}
      });

      if (error) throw error;

      if (data.response) {
        addBotMessage(data.response);
      } else {
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
  };
};
