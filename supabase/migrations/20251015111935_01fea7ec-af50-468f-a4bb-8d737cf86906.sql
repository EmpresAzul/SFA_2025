-- ✅ SECURITY FIX #4: Remover policy pública de system_settings
-- Isso previne a exposição da chave OpenAI e outros segredos

-- Primeiro, remover a policy existente que permite leitura pública
DROP POLICY IF EXISTS "Anyone can view system_settings" ON public.system_settings;

-- Criar policy restritiva: apenas administradores podem ler configurações do sistema
CREATE POLICY "Admins can view system_settings" 
ON public.system_settings
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Criar policy para admins poderem atualizar configurações
CREATE POLICY "Admins can update system_settings" 
ON public.system_settings
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Criar policy para admins poderem inserir novas configurações
CREATE POLICY "Admins can insert system_settings" 
ON public.system_settings
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Comentário: A chave OpenAI não é mais necessária pois migramos para Lovable AI
-- Se houver uma chave OpenAI armazenada, ela agora está protegida e acessível apenas para admins