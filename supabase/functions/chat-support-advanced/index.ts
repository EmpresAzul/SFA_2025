
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    // Criar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar configurações
    const { data: settings, error: settingsError } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', ['openai_api_key', 'openai_thread_id', 'openai_assistant_id']);

    if (settingsError) {
      throw new Error('Erro ao buscar configurações: ' + settingsError.message);
    }

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    const openAIApiKey = settingsMap['openai_api_key'];
    const threadId = settingsMap['openai_thread_id'];
    const assistantId = settingsMap['openai_assistant_id'];

    if (!openAIApiKey || !assistantId) {
      throw new Error('Configurações da OpenAI não encontradas');
    }

    // Função para fazer requisições à OpenAI
    const makeOpenAIRequest = async (url: string, method: string, body?: any) => {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        ...(body && { body: JSON.stringify(body) })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
      }

      return await response.json();
    };

    // Obter or criar thread
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const threadResponse = await makeOpenAIRequest('https://api.openai.com/v1/threads', 'POST');
      currentThreadId = threadResponse.id;

      // Salvar o novo thread ID
      await supabase
        .from('system_settings')
        .upsert({
          key: 'openai_thread_id',
          value: currentThreadId,
          updated_at: new Date().toISOString()
        });
    }

    // Adicionar mensagem à thread
    await makeOpenAIRequest(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, 'POST', {
      role: 'user',
      content: message
    });

    // Executar assistant
    const runResponse = await makeOpenAIRequest(`https://api.openai.com/v1/threads/${currentThreadId}/runs`, 'POST', {
      assistant_id: assistantId
    });

    const runId = runResponse.id;

    // Aguardar conclusão da execução
    let runStatus = 'in_progress';
    let attempts = 0;
    const maxAttempts = 30; // 30 segundos de timeout

    while (runStatus === 'in_progress' || runStatus === 'queued') {
      if (attempts >= maxAttempts) {
        throw new Error('Timeout: Assistant demorou muito para responder');
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1 segundo
      
      const statusResponse = await makeOpenAIRequest(`https://api.openai.com/v1/threads/${currentThreadId}/runs/${runId}`, 'GET');
      runStatus = statusResponse.status;
      attempts++;
    }

    if (runStatus !== 'completed') {
      throw new Error(`Execução falhou com status: ${runStatus}`);
    }

    // Obter mensagens da thread
    const messagesResponse = await makeOpenAIRequest(`https://api.openai.com/v1/threads/${currentThreadId}/messages?order=desc&limit=1`, 'GET');
    const latestMessage = messagesResponse.data[0];
    
    if (!latestMessage || latestMessage.role !== 'assistant') {
      throw new Error('Nenhuma resposta do assistant encontrada');
    }

    const assistantResponse = latestMessage.content[0]?.text?.value || 'Desculpe, não consegui processar sua mensagem.';

    // Obter user_id do token
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id;
    }

    // Salvar conversa no histórico (se o usuário estiver autenticado)
    if (userId) {
      try {
        await supabase
          .from('chat_conversations')
          .insert({
            user_id: userId,
            thread_id: currentThreadId,
            message,
            response: assistantResponse
          });
      } catch (error) {
        console.error('Erro ao salvar conversa:', error);
        // Não falhar a resposta por causa do histórico
      }
    }

    return new Response(JSON.stringify({ 
      response: assistantResponse,
      threadId: currentThreadId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no chat avançado:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        response: 'Desculpe, ocorreu um erro. Por favor, tente novamente ou entre em contato pelo WhatsApp.',
        details: error.message
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
