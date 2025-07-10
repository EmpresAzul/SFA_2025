import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar API key da OpenAI
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "openai_api_key")
      .single();

    if (apiKeyError || !apiKeyData?.value) {
      throw new Error("API key da OpenAI não configurada");
    }

    const openAIApiKey = apiKeyData.value;

    // Prompt do sistema para o agente de suporte
    const systemPrompt = `Você é um assistente inteligente do FluxoAzul, um sistema de gestão financeira empresarial. 

Funcionalidades do sistema:
- Dashboard: Visão geral dos indicadores financeiros
- Lançamentos: Gestão de receitas e despesas
- Fluxo de Caixa: Controle de entradas e saídas
- DRE: Demonstrativo de Resultado do Exercício
- Precificação: Cálculo de preços de produtos e serviços
- Estoque: Controle de produtos
- Cadastros: Gestão de clientes, fornecedores e funcionários
- Saldos Bancários: Controle bancário
- Lembretes: Agenda e notificações
- Ponto de Equilíbrio: Análise de viabilidade

Responda de forma clara, objetiva e amigável. Ajude o usuário com dúvidas sobre:
- Como usar as funcionalidades
- Navegação no sistema
- Interpretação de relatórios
- Melhores práticas de gestão financeira

Se não souber algo específico, oriente o usuário a entrar em contato pelo WhatsApp ou e-mail.
Mantenha respostas concisas e práticas.`;

    // Fazer chamada para OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro na chamada para OpenAI");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro no chat de suporte:", error);
    return new Response(
      JSON.stringify({
        error: "Erro interno do servidor",
        response:
          "Desculpe, ocorreu um erro. Por favor, tente novamente ou entre em contato pelo WhatsApp.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
