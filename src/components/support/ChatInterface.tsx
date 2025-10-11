import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
import { Message } from "@/types/support";

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
  onSendMessage,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Como criar um novo lançamento financeiro?",
    "Como visualizar o fluxo de caixa?",
    "Como cadastrar um novo cliente?",
    "Como configurar lembretes?",
    "Como calcular o ponto de equilíbrio?",
    "Qual a diferença entre receitas e despesas?",
    "Como interpretar o DRE?",
    "Como fazer precificação de produtos?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <Card className="w-full h-[500px] sm:h-[600px] flex flex-col shadow-lg border-0 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-t-lg flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <div className="relative">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
          </div>
          <span className="hidden sm:inline">Agente Inteligente FluxoAzul</span>
          <span className="sm:hidden">Agente FluxoAzul</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
        <ScrollArea className="flex-1 p-3 sm:p-4 overflow-y-auto" ref={scrollAreaRef}>
          <div className="space-y-3 sm:space-y-4">
            {messages.length === 0 && (
              <div className="space-y-3 sm:space-y-4">
                <div className="text-center py-4 sm:py-6">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-violet-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                    Como posso ajudá-lo hoje?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 px-4">
                    Selecione uma pergunta sugerida ou digite sua dúvida:
                  </p>
                </div>

                <div className="grid gap-2 sm:gap-3">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-2 sm:p-3 hover:bg-violet-50 hover:border-violet-300 transition-all duration-200 group"
                      onClick={() => onSendMessage(question)}
                    >
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-violet-500 group-hover:text-violet-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-4 ${message.isBot ? "" : "flex-row-reverse"} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                    message.isBot
                      ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                      : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                  }`}
                >
                  {message.isBot ? (
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>

                <div
                  className={`max-w-[75%] sm:max-w-[80%] group ${message.isBot ? "" : "flex flex-col items-end"}`}
                >
                  <div
                    className={`p-2 sm:p-3 rounded-2xl shadow-sm ${
                      message.isBot
                        ? "bg-white border border-gray-200 rounded-tl-lg"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-lg"
                    }`}
                  >
                    <div
                      className={`text-xs sm:text-sm ${message.isBot ? "text-gray-800" : "text-white"}`}
                    >
                      {formatMessage(message.content)}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs mt-1 px-2 ${
                      message.isBot ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 sm:gap-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="bg-white border border-gray-200 p-2 sm:p-3 rounded-2xl rounded-tl-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">
                      Processando...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t bg-white p-2 sm:p-3 flex-shrink-0">
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta..."
                disabled={isLoading}
                className="w-full text-sm sm:text-base focus:ring-2 focus:ring-violet-500 border-gray-300"
              />
            </div>
            <Button
              onClick={() => onSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg transition-all duration-200 flex-shrink-0 px-3 sm:px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2 text-center">
            Respostas podem conter imprecisões • Use com responsabilidade
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
