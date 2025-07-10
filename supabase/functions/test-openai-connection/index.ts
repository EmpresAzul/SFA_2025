import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { apiKey, assistantId, threadId } = await req.json();

    if (!apiKey || !assistantId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "API Key e Assistant ID são obrigatórios",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Testar API Key verificando o assistant
    const assistantResponse = await fetch(
      `https://api.openai.com/v1/assistants/${assistantId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "OpenAI-Beta": "assistants=v2",
        },
      },
    );

    if (!assistantResponse.ok) {
      const errorData = await assistantResponse.json();
      return new Response(
        JSON.stringify({
          success: false,
          error: `Erro ao verificar Assistant: ${errorData.error?.message || "ID inválido"}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Se não há thread ID, criar uma para teste
    let testThreadId = threadId;
    if (!testThreadId) {
      const threadResponse = await fetch("https://api.openai.com/v1/threads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2",
        },
      });

      if (!threadResponse.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Erro ao criar Thread de teste",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const threadData = await threadResponse.json();
      testThreadId = threadData.id;
    }

    // Testar envio de mensagem (sem executar)
    const messageResponse = await fetch(
      `https://api.openai.com/v1/threads/${testThreadId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2",
        },
        body: JSON.stringify({
          role: "user",
          content: "Teste de conexão",
        }),
      },
    );

    if (!messageResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Erro ao testar envio de mensagem",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        threadId: testThreadId !== threadId ? testThreadId : undefined,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Erro no teste de conexão:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Erro interno no teste de conexão",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
