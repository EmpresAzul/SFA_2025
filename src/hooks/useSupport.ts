
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Message, SupportState } from '@/types/support';

export const useSupport = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const { toast } = useToast();

  const checkConfiguration = async () => {
    try {
      console.log('Verificando configuração do agente inteligente...');
      
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value')
        .eq('key', 'openai_assistant_id');

      if (error) {
        console.error('Erro ao verificar configuração:', error);
        throw error;
      }

      console.log('Dados de configuração recebidos:', data);

      const assistantId = data[0]?.value;
      
      console.log('Assistant ID existe:', !!assistantId);

      const hasRequiredConfig = !!(assistantId && assistantId.trim());
      
      console.log('Configuração válida:', hasRequiredConfig);
      setHasApiKey(hasRequiredConfig);
      
      if (hasRequiredConfig) {
        console.log('Configuração válida encontrada, iniciando chat...');
        addBotMessage("Olá! Sou seu assistente inteligente do FluxoAzul. Como posso ajudá-lo hoje?");
      } else {
        console.log('Agente ainda não configurado, mostrando mensagem padrão');
        addBotMessage("Olá! Nosso agente inteligente está sendo configurado pela equipe técnica. Enquanto isso, você pode usar o suporte via WhatsApp ou enviar um e-mail para suporte@fluxoazul.com. Como posso ajudá-lo?");
      }
    } catch (error) {
      console.error('Erro ao verificar configuração:', error);
      setHasApiKey(false);
      addBotMessage("Olá! No momento, nosso agente inteligente está temporariamente indisponível. Por favor, use o suporte via WhatsApp ou envie um e-mail para suporte@fluxoazul.com. Como posso ajudá-lo?");
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
      // Se não tem configuração, responder com mensagem padrão
      if (!hasApiKey) {
        setTimeout(() => {
          addBotMessage("Obrigado pela sua mensagem! No momento, nosso agente inteligente está sendo configurado. Para suporte imediato, recomendo usar nosso WhatsApp ou enviar um e-mail para suporte@fluxoazul.com. Nossa equipe responderá o mais rápido possível!");
          setIsLoading(false);
        }, 1000);
        return;
      }

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
        addBotMessage("Desculpe, não consegui processar sua mensagem. Tente novamente ou entre em contato pelo WhatsApp.");
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      addBotMessage("Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente usar nosso suporte via WhatsApp ou envie um e-mail para suporte@fluxoazul.com.");
      
      toast({
        title: "Erro na comunicação",
        description: "Não foi possível enviar sua mensagem. Tente o WhatsApp ou e-mail.",
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
    sendMessage,
  };
};
