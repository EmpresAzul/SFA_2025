
-- Inserir configurações para Thread ID e Assistant ID da OpenAI
INSERT INTO system_settings (key, description) 
VALUES 
  ('openai_thread_id', 'Thread ID da OpenAI para o agente inteligente'),
  ('openai_assistant_id', 'Assistant ID da OpenAI para o agente inteligente')
ON CONFLICT (key) DO NOTHING;

-- Criar tabela para histórico de conversas
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  thread_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela de conversas
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

-- Política para que usuários vejam apenas suas conversas
CREATE POLICY "Users can view their own conversations" ON chat_conversations
    FOR SELECT USING (auth.uid() = user_id);

-- Política para que usuários criem suas conversas
CREATE POLICY "Users can create their own conversations" ON chat_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
