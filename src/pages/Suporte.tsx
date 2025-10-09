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
    <div className="fluxo-container fluxo-section bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen suporte-container suporte-responsive">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🎧 Central de Suporte
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Estamos aqui para ajudar você a aproveitar ao máximo o FluxoAzul
          </p>
        </div>
      </div>



      {/* Conteúdo Principal */}
      <div className="suporte-layout grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Área Principal */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <TabsList className="grid grid-cols-1 sm:grid-cols-2 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg rounded-xl h-auto sm:h-14 p-1">
                <TabsTrigger
                  value="chat"
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white font-semibold text-sm sm:text-base py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat Inteligente
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

            <TabsContent value="chat" className="mt-6">
              <ChatInterface
                messages={messages}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                isLoading={isLoading}
                onSendMessage={sendMessage}
              />
            </TabsContent>



            <TabsContent value="faq" className="mt-6">
              <div className="suporte-faq-container">
                <h3 className="text-lg font-semibold mb-6">Perguntas Frequentes</h3>
                
                {/* Prioridade ALTA - Questões Críticas */}
                <div className="suporte-faq-section">
                  <h4 className="suporte-faq-title text-red-700">
                    🔴 Prioridade Alta - Questões Críticas
                  </h4>
                  <div className="grid gap-3">
                    <div className="suporte-faq-item suporte-faq-alta">
                      <h5 className="suporte-faq-question">Como calcular corretamente o DRE?</h5>
                      <p className="suporte-faq-answer">O DRE é gerado automaticamente com base nos lançamentos. Verifique se todas as receitas e despesas estão categorizadas corretamente.</p>
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


    </div>
  );
};

export default Suporte;
