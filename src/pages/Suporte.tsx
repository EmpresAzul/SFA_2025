import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupport } from "@/hooks/useSupport";
import ChatInterface from "@/components/support/ChatInterface";
import SupportSidebar from "@/components/support/SupportSidebar";
import { MessageCircle, HelpCircle } from "lucide-react";

const Suporte: React.FC = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const { messages, inputMessage, setInputMessage, isLoading, sendMessage } = useSupport();

  const openWhatsApp = () => {
    window.open("https://wa.me/5519990068219", "_blank");
  };



  return (
    <div className="w-full max-w-full overflow-x-hidden bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎧 Central de Suporte
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Estamos aqui para ajudar você a aproveitar ao máximo o FluxoAzul
          </p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Área Principal */}
        <div className="lg:col-span-3 w-full max-w-full overflow-x-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="w-full mb-4">
              <TabsList className="w-full grid grid-cols-2 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg rounded-xl h-auto p-1">
                <TabsTrigger
                  value="chat"
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Chat Inteligente</span>
                  <span className="sm:hidden">Chat</span>
                </TabsTrigger>
                <TabsTrigger
                  value="faq"
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
                >
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="mt-0 w-full">
              <ChatInterface
                messages={messages}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                isLoading={isLoading}
                onSendMessage={sendMessage}
              />
            </TabsContent>



            <TabsContent value="faq" className="mt-0 w-full">
              <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-6">Perguntas Frequentes</h3>
                
                {/* Prioridade ALTA - Questões Críticas */}
                <div className="mb-8">
                  <h4 className="text-base sm:text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                    🔴 Prioridade Alta - Questões Críticas
                  </h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-red-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-red-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Como calcular corretamente o DRE?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">O DRE é gerado automaticamente com base nos lançamentos. Verifique se todas as receitas e despesas estão categorizadas corretamente.</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-red-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Por que meu fluxo de caixa não bate com o banco?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">Verifique se todos os lançamentos foram registrados e se as datas estão corretas. Considere também transferências entre contas.</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-red-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Como fazer backup dos meus dados?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">Seus dados são automaticamente salvos na nuvem. Para exportar, use as opções de relatório em cada módulo.</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-red-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Como recuperar lançamentos excluídos?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">Lançamentos excluídos não podem ser recuperados. Sempre confirme antes de excluir. Para correções, edite o lançamento.</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-red-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">O que fazer quando o sistema está lento?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">Limpe o cache do navegador, verifique sua conexão e tente em modo anônimo. Se persistir, entre em contato.</p>
                    </div>
                  </div>
                </div>

                {/* Prioridade MÉDIA - Operações Diárias */}
                <div className="mb-8">
                  <h4 className="text-base sm:text-lg font-semibold text-yellow-700 mb-4 flex items-center gap-2">
                    🟡 Prioridade Média - Operações Diárias
                  </h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-yellow-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-yellow-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Como fazer precificação de produtos?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">Na aba Precificação, cadastre custos, defina margem de lucro e impostos. O preço final é calculado automaticamente.</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-yellow-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Como controlar o estoque eficientemente?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">Cadastre produtos, defina estoque mínimo e acompanhe movimentações. O sistema alerta quando atingir o mínimo.</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-yellow-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Como gerenciar leads no CRM?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">Cadastre leads, acompanhe o pipeline por etapas e registre o valor dos negócios para análise de conversão.</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-yellow-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Como categorizar lançamentos corretamente?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">Use categorias específicas como "Vendas", "Fornecedores", "Impostos". Isso melhora a precisão dos relatórios.</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-yellow-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Como calcular o ponto de equilíbrio?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">Na aba Ponto de Equilíbrio, informe custos fixos e variáveis. O sistema calcula automaticamente o valor necessário para cobrir custos.</p>
                    </div>
                  </div>
                </div>

                {/* Prioridade BAIXA - Otimizações */}
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                    🟢 Prioridade Baixa - Otimizações e Dicas
                  </h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-green-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-green-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Como personalizar o dashboard?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">O dashboard mostra automaticamente os indicadores mais relevantes baseados nos seus dados cadastrados.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-green-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Como exportar relatórios para Excel?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">Em cada relatório, clique no botão "Exportar" para baixar os dados em formato Excel (.xlsx).</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-green-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Como configurar lembretes automáticos?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">Na aba Lembretes, cadastre tarefas com data e hora. O sistema enviará notificações no momento configurado.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-green-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Como acompanhar indicadores financeiros?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">Use o dashboard para visão geral e acesse cada módulo para detalhes específicos de receitas, despesas e lucratividade.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-3 sm:pl-4 py-2 sm:py-3 bg-green-50 rounded-r-lg">
                      <h5 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Como otimizar o uso do sistema?</h5>
                      <p className="text-xs sm:text-sm text-gray-600">Mantenha dados atualizados, use categorias consistentes e revise relatórios regularmente para tomada de decisões.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Painel Lateral */}
        <div className="lg:col-span-1 w-full">
          <SupportSidebar onOpenWhatsApp={openWhatsApp} />
        </div>
      </div>
    </div>
  );
};

export default Suporte;
