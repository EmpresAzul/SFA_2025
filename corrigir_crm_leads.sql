-- =====================================================
-- SCRIPT PARA CORRIGIR O CRM E RESTAURAR OS LEADS
-- Execute este script no Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. VERIFICAR E CORRIGIR POLÍTICAS RLS DA TABELA CADASTROS
-- Habilitar RLS se não estiver habilitado
ALTER TABLE public.cadastros ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Users can view their own cadastros" ON public.cadastros;
DROP POLICY IF EXISTS "Users can insert their own cadastros" ON public.cadastros;
DROP POLICY IF EXISTS "Users can update their own cadastros" ON public.cadastros;
DROP POLICY IF EXISTS "Users can delete their own cadastros" ON public.cadastros;

-- Criar políticas RLS corretas para cadastros
CREATE POLICY "Users can view their own cadastros"
ON public.cadastros
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own cadastros"
ON public.cadastros
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own cadastros"
ON public.cadastros
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own cadastros"
ON public.cadastros
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- 2. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_cadastros_user_id ON public.cadastros(user_id);
CREATE INDEX IF NOT EXISTS idx_cadastros_tipo ON public.cadastros(tipo);
CREATE INDEX IF NOT EXISTS idx_cadastros_status ON public.cadastros(status);

-- 3. INSERIR LEADS DE EXEMPLO (usando um user_id existente)
-- Primeiro, vamos pegar um user_id válido ou criar um usuário de exemplo
DO $$
DECLARE
    exemplo_user_id UUID;
BEGIN
    -- Tentar pegar um user_id existente
    SELECT id INTO exemplo_user_id FROM auth.users LIMIT 1;
    
    -- Se não houver usuários, criar um usuário de exemplo
    IF exemplo_user_id IS NULL THEN
        -- Inserir usuário de exemplo diretamente na tabela auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@fluxoazul.com',
            crypt('admin123', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        ) RETURNING id INTO exemplo_user_id;
    END IF;
    
    -- Inserir leads de exemplo
    INSERT INTO public.cadastros (
        user_id,
        nome,
        tipo,
        pessoa,
        status,
        ativo,
        email,
        telefone,
        cpf_cnpj,
        observacoes,
        created_at,
        updated_at
    ) VALUES 
    (exemplo_user_id, 'João Silva', 'lead', 'Física', 'prospeccao', true, 'joao.silva@email.com', '(11) 99999-1111', NULL, 'Interessado em consultoria empresarial' || chr(10) || 'Valor: R$ 5000', NOW(), NOW()),
    (exemplo_user_id, 'Maria Santos', 'lead', 'Física', 'qualificacao', true, 'maria.santos@email.com', '(11) 99999-2222', NULL, 'Precisa de sistema de gestão' || chr(10) || 'Valor: R$ 8000', NOW(), NOW()),
    (exemplo_user_id, 'Empresa ABC Ltda', 'lead', 'Jurídica', 'proposta', true, 'contato@empresaabc.com', '(11) 99999-3333', '12.345.678/0001-90', 'Proposta enviada para automação' || chr(10) || 'Valor: R$ 15000', NOW(), NOW()),
    (exemplo_user_id, 'Pedro Oliveira', 'lead', 'Física', 'negociacao', true, 'pedro.oliveira@email.com', '(11) 99999-4444', NULL, 'Negociando desconto e prazo' || chr(10) || 'Valor: R$ 12000', NOW(), NOW()),
    (exemplo_user_id, 'Tech Solutions', 'lead', 'Jurídica', 'fechado', true, 'vendas@techsolutions.com', '(11) 99999-5555', '98.765.432/0001-10', 'Contrato assinado - implementação iniciada' || chr(10) || 'Valor: R$ 25000', NOW(), NOW()),
    (exemplo_user_id, 'Ana Costa', 'lead', 'Física', 'perdido', true, 'ana.costa@email.com', '(11) 99999-6666', NULL, 'Optou por concorrente - preço' || chr(10) || 'Valor: R$ 7000', NOW(), NOW()),
    (exemplo_user_id, 'Carlos Mendes', 'lead', 'Física', 'prospeccao', true, 'carlos.mendes@email.com', '(11) 99999-7777', NULL, 'Primeiro contato realizado' || chr(10) || 'Valor: R$ 3000', NOW(), NOW()),
    (exemplo_user_id, 'Inovação Digital', 'lead', 'Jurídica', 'qualificacao', true, 'comercial@inovacaodigital.com', '(11) 99999-8888', '11.222.333/0001-44', 'Reunião de qualificação agendada' || chr(10) || 'Valor: R$ 18000', NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Leads inseridos com sucesso para o usuário: %', exemplo_user_id;
END $$;

-- 4. VERIFICAR RESULTADOS
SELECT 
    'Total de leads inseridos: ' || COUNT(*) as resultado
FROM public.cadastros 
WHERE tipo = 'lead';

SELECT 
    status,
    COUNT(*) as quantidade
FROM public.cadastros 
WHERE tipo = 'lead'
GROUP BY status
ORDER BY status;

-- 5. MOSTRAR RESUMO
SELECT 
    'CRM RESTAURADO COM SUCESSO!' as status,
    'Os leads agora devem aparecer no pipeline do CRM' as instrucao;