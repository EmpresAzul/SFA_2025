
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Message, SupportState } from '@/types/support';

export const useSupport = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const { toast } = useToast();

  const checkApiKey = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'openai_api_key')
        .maybeSingle();

      if (data && data.value) {
        setHasApiKey(true);
      }
    } catch (error) {
      console.log('API key não configurada ainda');
    }
  };

  const saveApiKey = async () => {
    if (!openaiApiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma API key válida.",
        variant: "destructive",
      });
      return;
    }

    setIsSettingUp(true);

    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'openai_api_key',
          value: openaiApiKey,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setHasApiKey(true);
      setOpenaiApiKey('');
      toast({
        title: "Sucesso",
        description: "API key configurada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar API key. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSettingUp(false);
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
      const { data, error } = await supabase.functions.invoke('chat-support', {
        body: { message }
      });

      if (error) throw error;

      addBotMessage(data.response);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      addBotMessage("Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente ou entre em contato pelo WhatsApp.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkApiKey();
    if (hasApiKey) {
      addBotMessage("Olá! Sou seu assistente inteligente do FluxoAzul. Como posso ajudá-lo hoje?");
    }
  }, [hasApiKey]);

  return {
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
  };
};
