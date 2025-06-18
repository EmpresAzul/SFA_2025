
-- Configurar o Assistant ID da OpenAI nas configurações do sistema
INSERT INTO system_settings (key, value, description, updated_at)
VALUES 
  ('openai_assistant_id', 'asst_wVZILLTcuPg3HklluEP9mT6P', 'Assistant ID da OpenAI para o agente inteligente', NOW())
ON CONFLICT (key) 
DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();
