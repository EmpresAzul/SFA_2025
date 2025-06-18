
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { Message } from '@/types/support';

interface ChatInterfaceProps {
  messages: Message[];
  inputMessage: string;
  setInputMessage: (value: string) => void;
  isLoading: boolean;
  onSendMessage: (message?: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  inputMessage,
  setInputMessage,
  isLoading,
  onSendMessage
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Como criar um novo lançamento financeiro?",
    "Como visualizar o fluxo de caixa?",
    "Como cadastrar um novo cliente?",
    "Como configurar lembretes?",
    "Como calcular o ponto de equilíbrio?"
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
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
                      onClick={() => onSendMessage(question)}
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
            onClick={() => onSendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-violet-500 hover:bg-violet-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
