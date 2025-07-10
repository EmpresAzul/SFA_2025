import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, ExternalLink, Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const VirtualConsultant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Olá! Sou o assistente virtual do FluxoAzul. Como posso ajudá-lo hoje? Posso responder dúvidas sobre precificação, gestão financeira, indicadores e muito mais!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    precificação:
      "Para uma precificação eficiente, considere: 1) Custos diretos e indiretos, 2) Margem de lucro desejada, 3) Preço praticado pela concorrência, 4) Valor percebido pelo cliente. Recomendo usar a fórmula: Preço = (Custo + Margem) / (1 - Impostos%). Precisa de mais detalhes sobre algum desses pontos?",
    "fluxo de caixa":
      "O fluxo de caixa é fundamental para a saúde financeira. Registre todas as entradas e saídas diariamente, projete receitas e despesas futuras, mantenha uma reserva de emergência e monitore os indicadores semanalmente. Gostaria de dicas específicas sobre controle de fluxo de caixa?",
    dre: "A DRE (Demonstração do Resultado do Exercício) mostra se sua empresa teve lucro ou prejuízo. Estrutura básica: Receita Bruta - Deduções = Receita Líquida - Custos = Lucro Bruto - Despesas = Lucro Operacional. Quer ajuda para interpretar sua DRE?",
    indicadores:
      "Os principais indicadores financeiros são: Margem de Lucro, ROI, Ticket Médio, CAC (Custo de Aquisição de Cliente), LTV (Lifetime Value) e Ponto de Equilíbrio. Qual indicador você gostaria que eu explique melhor?",
    "como usar":
      "O FluxoAzul é bem intuitivo! Use o menu lateral para navegar entre as seções. Comece pelos Indicadores para ter uma visão geral, depois vá para Cadastro para registrar clientes/fornecedores, e use o Financeiro para lançamentos. Precisa de ajuda com alguma função específica?",
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    // Default responses based on keywords
    if (
      lowerMessage.includes("obrigado") ||
      lowerMessage.includes("obrigada")
    ) {
      return "Fico feliz em ajudar! Se tiver mais dúvidas, estarei aqui. 😊";
    }

    if (
      lowerMessage.includes("oi") ||
      lowerMessage.includes("olá") ||
      lowerMessage.includes("bom dia") ||
      lowerMessage.includes("boa tarde")
    ) {
      return "Olá! Como posso ajudá-lo hoje? Posso tirar dúvidas sobre precificação, fluxo de caixa, DRE, indicadores financeiros e como usar o sistema.";
    }

    return "Entendo sua dúvida! Para questões mais específicas, recomendo entrar em contato com nosso suporte técnico. Posso ajudar com: precificação, fluxo de caixa, DRE, indicadores financeiros e navegação no sistema. Sobre qual tema você gostaria de saber mais?";
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(newMessage),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/5519990068219", "_blank");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-fluxo-text mb-2">
          Consultor Virtual
        </h1>
        <p className="text-gray-600">
          Assistente inteligente para suas dúvidas sobre gestão financeira
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardHeader className="gradient-fluxo text-white rounded-t-lg">
              <CardTitle className="flex items-center text-white">
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat com Assistente Virtual
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} items-start space-x-2`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback
                          className={
                            message.sender === "user"
                              ? "gradient-fluxo text-white"
                              : "bg-gray-200"
                          }
                        >
                          {message.sender === "user" ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "user"
                            ? "gradient-fluxo text-white ml-2"
                            : "bg-gray-100 text-gray-800 mr-2"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "user"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-200">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isTyping}
                    className="gradient-fluxo hover:gradient-fluxo-light text-white px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Info */}
        <div className="space-y-4">
          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="gradient-fluxo-text text-lg">
                Suporte Técnico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>E-mail:</strong> suporte@fluxoazul.com
                </p>
                <p>
                  <strong>Localização:</strong> São Paulo, SP
                </p>
                <p>
                  <strong>Horário:</strong> Seg-Sex, 8h às 18h
                </p>
              </div>

              <Button
                onClick={openWhatsApp}
                className="w-full gradient-fluxo hover:gradient-fluxo-light text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Falar com Suporte
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="gradient-fluxo-text text-lg">
                Perguntas Frequentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-800">
                    Como calcular preços?
                  </p>
                  <p className="text-gray-600">Digite "precificação" no chat</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    Controlar fluxo de caixa?
                  </p>
                  <p className="text-gray-600">
                    Digite "fluxo de caixa" no chat
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    Entender indicadores?
                  </p>
                  <p className="text-gray-600">Digite "indicadores" no chat</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VirtualConsultant;
