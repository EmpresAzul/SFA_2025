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
    // ✅ SECURITY FIX #1: Verificar autenticação JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized', response: 'Autenticação necessária.' }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', response: 'Autenticação inválida.' }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('User authenticated:', user.id);

    const { message } = await req.json();

    // ✅ SECURITY FIX #2: Validar e sanitizar entrada
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid input', response: 'Mensagem é obrigatória e deve ser texto.' }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitizedMessage = message.trim();
    
    if (sanitizedMessage.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Empty message', response: 'Mensagem não pode estar vazia.' }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (sanitizedMessage.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Message too long', response: 'Mensagem muito longa (máximo 1000 caracteres).' }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Detectar tentativas de prompt injection
    const suspiciousPatterns = [
      /ignore\s+(previous|above|all)\s+instructions?/i,
      /system\s*:\s*you\s+are/i,
      /new\s+instructions?/i,
      /forget\s+(everything|all)/i,
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(sanitizedMessage))) {
      console.warn('Suspicious content detected from user:', user.id);
      return new Response(
        JSON.stringify({ error: 'Suspicious content', response: 'Conteúdo suspeito detectado.' }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ✅ SECURITY FIX #3: Usar Lovable AI ao invés de chave OpenAI exposta
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error("Lovable AI não configurada");
    }

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

    // Fazer chamada para Lovable AI (gateway seguro)
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: sanitizedMessage },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded', response: 'Limite de requisições excedido. Tente novamente em alguns minutos.' }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required', response: 'Créditos esgotados. Entre em contato com o suporte.' }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("Erro na chamada para IA");
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
        error: error instanceof Error ? error.message : "Erro interno do servidor",
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
