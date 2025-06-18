
-- Criação da tabela system_settings para armazenar configurações do sistema
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca por chave
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);

-- Inserir configuração inicial para API key da OpenAI
INSERT INTO system_settings (key, description) 
VALUES ('openai_api_key', 'API key da OpenAI para o agente inteligente de suporte')
ON CONFLICT (key) DO NOTHING;

-- Habilitar RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Política para permitir acesso completo a usuários autenticados
CREATE POLICY "Allow authenticated users full access to system_settings" ON system_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
