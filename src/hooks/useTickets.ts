import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ticket, TicketFormData, SupportStats } from "@/types/support";
import { useToast } from "@/hooks/use-toast";

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SupportStats>({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    avgResponseTime: "2h",
  });
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Por enquanto, vamos simular dados até que a tabela seja criada no Supabase
      const mockTickets: Ticket[] = [
        {
          id: "ticket_001",
          user_id: "user1",
          title: "Erro no cálculo do DRE - valores inconsistentes",
          description: "Estou enfrentando problemas com o cálculo do DRE. Os valores de receita e despesa não estão batendo com os lançamentos que fiz. Já verifiquei os dados várias vezes e não consigo identificar o problema. Preciso de ajuda urgente pois tenho que apresentar o relatório amanhã.",
          category: "tecnico",
          priority: "urgente",
          status: "em_andamento",
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
          updated_at: new Date(Date.now() - 1800000).toISOString(), // 30 min atrás
        },
        {
          id: "ticket_002",
          user_id: "user1",
          title: "Dúvida sobre precificação de produtos",
          description: "Gostaria de entender melhor como funciona o cálculo de precificação. Especificamente sobre como definir a margem de lucro ideal e como os impostos são calculados no preço final.",
          category: "comercial",
          priority: "media",
          status: "resolvido",
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
          updated_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
          resolved_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "ticket_003",
          user_id: "user1",
          title: "Problema na sincronização do estoque",
          description: "O sistema não está atualizando automaticamente as quantidades do estoque quando faço vendas. Preciso atualizar manualmente toda vez.",
          category: "tecnico",
          priority: "alta",
          status: "aguardando_cliente",
          created_at: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
          updated_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        },
        {
          id: "ticket_004",
          user_id: "user1",
          title: "Solicitação de nova funcionalidade - relatórios personalizados",
          description: "Seria possível adicionar a opção de criar relatórios personalizados? Gostaria de poder filtrar por período específico e categorias customizadas.",
          category: "comercial",
          priority: "baixa",
          status: "aberto",
          created_at: new Date(Date.now() - 432000000).toISOString(), // 5 dias atrás
          updated_at: new Date(Date.now() - 432000000).toISOString(),
        },
        {
          id: "ticket_005",
          user_id: "user1",
          title: "Erro ao exportar dados financeiros",
          description: "Quando tento exportar os dados financeiros para Excel, o arquivo vem corrompido ou incompleto. Já tentei em diferentes navegadores.",
          category: "tecnico",
          priority: "media",
          status: "fechado",
          created_at: new Date(Date.now() - 604800000).toISOString(), // 7 dias atrás
          updated_at: new Date(Date.now() - 518400000).toISOString(), // 6 dias atrás
          resolved_at: new Date(Date.now() - 518400000).toISOString(),
        },
      ];

      setTickets(mockTickets);
      
      // Calcular estatísticas
      const totalTickets = mockTickets.length;
      const openTickets = mockTickets.filter(t => ['aberto', 'em_andamento', 'aguardando_cliente'].includes(t.status)).length;
      const resolvedTickets = mockTickets.filter(t => ['resolvido', 'fechado'].includes(t.status)).length;
      
      setStats({
        totalTickets,
        openTickets,
        resolvedTickets,
        avgResponseTime: "1.5h",
      });

    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
      toast({
        title: "Erro ao carregar chamados",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (data: TicketFormData): Promise<void> => {
    try {
      // Simular criação de chamado
      const newTicket: Ticket = {
        id: Date.now().toString(),
        user_id: "current_user",
        title: data.title,
        description: data.description,
        category: data.category as any,
        priority: data.priority as any,
        status: "aberto",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTickets(prev => [newTicket, ...prev]);
      
      // Atualizar estatísticas
      setStats(prev => ({
        ...prev,
        totalTickets: prev.totalTickets + 1,
        openTickets: prev.openTickets + 1,
      }));

      // Em produção, aqui faria a chamada para o Supabase:
      /*
      const { data: newTicket, error } = await supabase
        .from('support_tickets')
        .insert([{
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          status: 'aberto'
        }])
        .select()
        .single();

      if (error) throw error;
      */

    } catch (error) {
      console.error("Erro ao criar chamado:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    stats,
    loading,
    createTicket,
    refetch: fetchTickets,
  };
};