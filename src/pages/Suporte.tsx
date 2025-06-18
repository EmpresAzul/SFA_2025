
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Phone, Mail, MapPin, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const Suporte: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const suggestedQuestions = [
    "Como criar um novo lançamento financeiro?",
    "Como visualizar o fluxo de caixa?",
    "Como cadastrar um novo cliente?",
    "Como configurar lembretes?",
    "Como calcular o ponto de equilíbrio?"
  ];

  useEffect(() => {
    checkApiKey();
    if (hasApiKey) {
      addBotMessage("Olá! Sou seu assistente inteligente do FluxoAzul. Como posso ajudá-lo hoje?");
    }
  }, [hasApiKey]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const checkApiKey = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'openai_api_key')
        .single();

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/5519990068219', '_blank');
  };

  if (!hasApiKey) {
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
                onClick={saveApiKey} 
                disabled={isSettingUp}
                className="w-full bg-violet-500 hover:bg-violet-600"
              >
                {isSettingUp ? 'Configurando...' : 'Ativar Agente Inteligente'}
              </Button>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Outras formas de suporte:</h3>
                <div className="space-y-2">
                  <Button
                    onClick={openWhatsApp}
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
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Principal */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-violet-500" />
                Agente Inteligente FluxoAzul
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="space-y-4">
                      <div className="text-center text-gray-600 mb-4">
                        Selecione uma pergunta sugerida ou digite sua dúvida:
                      </div>
                      <div className="space-y-2">
                        {suggestedQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start text-left h-auto p-3"
                            onClick={() => sendMessage(question)}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.isBot ? '' : 'flex-row-reverse'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.isBot ? 'bg-violet-100 text-violet-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {message.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.isBot 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="flex gap-2 mt-4">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua dúvida..."
                  disabled={isLoading}
                />
                <Button 
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-violet-500 hover:bg-violet-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral */}
        <div className="space-y-6">
          {/* Suporte WhatsApp */}
          <Card>
            <CardHeader>
              <CardTitle>Suporte Direto</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={openWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                Suporte WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* Informações de Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">E-mail</p>
                  <p className="text-sm text-gray-600">suporte@fluxoazul.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium">Localização</p>
                  <p className="text-sm text-gray-600">São Paulo | SP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dicas Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Dicas Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Use o chat para dúvidas sobre o sistema</p>
                <p>• WhatsApp para suporte urgente</p>
                <p>• E-mail para solicitações detalhadas</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Suporte;
