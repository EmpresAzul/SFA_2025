import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupport } from "@/hooks/useSupport";
import { useTickets } from "@/hooks/useTickets";
import ChatInterface from "@/components/support/ChatInterface";
import SupportSidebar from "@/components/support/SupportSidebar";
import { SupportStats } from "@/components/support/SupportStats";
import { TicketForm } from "@/components/support/TicketForm";
import { TicketsList } from "@/components/support/TicketsList";
import { TicketViewModal } from "@/components/support/TicketViewModal";
import { MessagesPanel } from "@/components/support/MessagesPanel";
import { MessageCircle, Ticket, HelpCircle, MessageSquare } from "lucide-react";
import { Ticket as TicketType } from "@/types/support";

const Suporte: React.FC = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [ticketLoading, setTicketLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  
  const { messages, inputMessage, setInputMessage, isLoading, sendMessage } = useSupport();
  const { tickets, stats, loading: statsLoading, createTicket } = useTickets();

  const openWhatsApp = () => {
    window.open("https://wa.me/5519990068219", "_blank");
  };

  const handleCreateTicket = async (data: any) => {
    setTicketLoading(true);
    try {
      await createTicket(data);
      setActiveTab("chat"); // Voltar para o chat após criar o chamado
    } finally {
      setTicketLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎧 Central de Suporte
          </h1>
          <p className="text-gray-600 mt-2">
            Estamos aqui para ajudar você a aproveitar ao máximo o FluxoAzul
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      {!statsLoading && <SupportStats stats={stats} />}

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Área Principal */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-xl h-14">
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat Inteligente
              </TabsTrigger>
              <TabsTrigger
                value="ticket"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <Ticket className="h-4 w-4 mr-2" />
                Abrir Chamado
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensagens
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold text-sm py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-6">
              <ChatInterface
                messages={messages}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                isLoading={isLoading}
                onSendMessage={sendMessage}
              />
            </TabsContent>

            <TabsContent value="ticket" className="mt-6">
              <div className="space-y-6">
                <TicketForm onSubmit={handleCreateTicket} loading={ticketLoading} />
                <TicketsList tickets={tickets} onViewTicket={(ticket) => setSelectedTicket(ticket)} />
              </div>
            </TabsContent>

            <TabsContent value="messages" className="mt-6">
              <MessagesPanel />
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-6">Perguntas Frequentes</h3>
                
                {/* Prioridade ALTA - Questões Críticas */}
                <div className="mb-8">
                  <h4 className="text-md font-semibold text-red-700 mb-4 flex items-center gap-2">
                    🔴 Prioridade Alta - Questões Críticas
                  </h4>
                  <div className="grid gap-3">
                    <div className="border-l-4 border-red-500 pl-3 py-2 bg-red-50">
                      <h5 className="font-medium text-gray-800 text-sm">Como calcular corretamente o DRE?</h5>
                      <p className="text-xs text-gray-600 mt-1">O DRE é gerado automaticamente com base nos lançamentos. Verifique se todas as receitas e despesas estão categorizadas corretamente.</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3 py-2 bg-red-50">
                      <h5 className="font-medium text-gray-800 text-sm">Por que meu fluxo de caixa não bate com o banco?</h5>
                      <p className="text-xs text-gray-600 mt-1">Verifique se todos os lançamentos foram registrados e se as datas estão corretas. Considere também transferências entre contas.</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3 py-2 bg-red-50">
                      <h5 className="font-medium text-gray-800 text-sm">Como fazer backup dos meus dados?</h5>
                      <p className="text-xs text-gray-600 mt-1">Seus dados são automaticamente salvos na nuvem. Para exportar, use as opções de relatório em cada módulo.</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3 py-2 bg-red-50">
                      <h5 className="font-medium text-gray-800 text-sm">Como recuperar lançamentos excluídos?</h5>
                      <p className="text-xs text-gray-600 mt-1">Lançamentos excluídos não podem ser recuperados. Sempre confirme antes de excluir. Para correções, edite o lançamento.</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3 py-2 bg-red-50">
                      <h5 className="font-medium text-gray-800 text-sm">O que fazer quando o sistema está lento?</h5>
                      <p className="text-xs text-gray-600 mt-1">Limpe o cache do navegador, verifique sua conexão e tente em modo anônimo. Se persistir, entre em contato.</p>
                    </div>
                  </div>
                </div>

                {/* Prioridade MÉDIA - Operações Diárias */}
                <div className="mb-8">
                  <h4 className="text-md font-semibold text-yellow-700 mb-4 flex items-center gap-2">
                    🟡 Prioridade Média - Operações Diárias
                  </h4>
                  <div className="grid gap-3">
                    <div className="border-l-4 border-yellow-500 pl-3 py-2 bg-yellow-50">
                      <h5 className="font-medium text-gray-800 text-sm">Como fazer precificação de produtos?</h5>
                      <p className="text-xs text-gray-600 mt-1">Na aba Precificação, cadastre custos, defina margem de lucro e impostos. O preço final é calculado automaticamente.</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-3 py-2 bg-yellow-50">
                      <h5 className="font-medium text-gray-800 text-sm">Como controlar o estoque eficientemente?</h5>
                      <p className="text-xs text-gray-600 mt-1">Cadastre produtos, defina estoque mínimo e acompanhe movimentações. O sistema alerta quando atingir o mínimo.</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-3 py-2 bg-yellow-50">
                      <h5 className="font-medium text-gray-800 text-sm">Como gerenciar leads no CRM?</h5>
                      <p className="text-xs text-gray-600 mt-1">Cadastre leads, acompanhe o pipeline por etapas e registre o valor dos negócios para análise de conversão.</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-3 py-2 bg-yellow-50">
                      <h5 className="font-medium text-gray-800 text-sm">Como categorizar lançamentos corretamente?</h5>
                      <p className="text-xs text-gray-600 mt-1">Use categorias específicas como "Vendas", "Fornecedores", "Impostos". Isso melhora a precisão dos relatórios.</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-3 py-2 bg-yellow-50">
                      <h5 className="font-medium text-gray-800 text-sm">Como calcular o ponto de equilíbrio?</h5>
                      <p className="text-xs text-gray-600 mt-1">Na aba Ponto de Equilíbrio, informe custos fixos e variáveis. O sistema calcula automaticamente o valor necessário para cobrir custos.</p>
                    </div>
                  </div>
                </div>

                {/* Prioridade BAIXA - Otimizações */}
                <div>
                  <h4 className="text-md font-semibold text-green-700 mb-4 flex items-center gap-2">
                    🟢 Prioridade Baixa - Otimizações e Dicas
                  </h4>
                  <div className="grid gap-3">
                    <div className="border-l-4 border-green-500 pl-3 py-2 bg-green-50">
                      <h5 className="font-medium text-gray-800 text-sm">Como personalizar o dashboard?</h5>
                      <p className="text-xs text-gray-600 mt-1">O dashboard mostra automaticamente os indicadores mais relevantes baseados nos seus dados cadastrados.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-3 py-2 bg-green-50">
                      <h5 className="font-medium text-gray-800 text-sm">Como exportar relatórios para Excel?</h5>
                      <p className="text-xs text-gray-600 mt-1">Em cada relatório, clique no botão "Exportar" para baixar os dados em formato Excel (.xlsx).</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-3 py-2 bg-green-50">
                      <h5 className="font-medium text-gray-800 text-sm">Como configurar lembretes automáticos?</h5>
                      <p className="text-xs text-gray-600 mt-1">Na aba Lembretes, cadastre tarefas com data e hora. O sistema enviará notificações no momento configurado.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-3 py-2 bg-green-50">
                      <h5 className="font-medium text-gray-800 text-sm">Como acompanhar indicadores financeiros?</h5>
                      <p className="text-xs text-gray-600 mt-1">Use o dashboard para visão geral e acesse cada módulo para detalhes específicos de receitas, despesas e lucratividade.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-3 py-2 bg-green-50">
                      <h5 className="font-medium text-gray-800 text-sm">Como otimizar o uso do sistema?</h5>
                      <p className="text-xs text-gray-600 mt-1">Mantenha dados atualizados, use categorias consistentes e revise relatórios regularmente para tomada de decisões.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Painel Lateral */}
        <div className="lg:col-span-1">
          <SupportSidebar onOpenWhatsApp={openWhatsApp} />
        </div>
      </div>

      {/* Modal de Visualização de Chamado */}
      <TicketViewModal
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
};

export default Suporte;
