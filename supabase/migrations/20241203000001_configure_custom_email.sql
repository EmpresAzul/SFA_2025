-- ============================================
-- CONFIGURAÇÃO DE EMAIL CUSTOMIZADO
-- Email: contato@empresazul.com
-- ============================================

-- Esta migration documenta a configuração necessária no Supabase Dashboard
-- As configurações de SMTP devem ser feitas manualmente no dashboard

-- INSTRUÇÕES PARA CONFIGURAR NO SUPABASE DASHBOARD:
-- 
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Selecione seu projeto
-- 3. Vá em: Settings > Auth > Email Templates
-- 4. Configure o SMTP:
--    - SMTP Host: smtp.empresazul.com (ou seu provedor)
--    - SMTP Port: 587 (TLS) ou 465 (SSL)
--    - SMTP User: contato@empresazul.com
--    - SMTP Password: [sua senha]
--    - Sender Email: contato@empresazul.com
--    - Sender Name: FluxoAzul - Gestão Financeira
--
-- 5. Atualize os templates de email com os arquivos em supabase/templates/

-- Nota: Esta configuração é feita via Dashboard do Supabase
-- pois envolve credenciais sensíveis que não devem estar no código

-- Verificar se a tabela auth.users existe (apenas para validação)
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'auth' 
    AND table_name = 'users'
  ) THEN
    RAISE NOTICE 'Tabela auth.users existe - configuração de email pode ser aplicada';
  ELSE
    RAISE NOTICE 'Tabela auth.users não encontrada';
  END IF;
END $$;
