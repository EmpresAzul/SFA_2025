-- Script para criar lançamentos de exemplo
-- Execute este script no SQL Editor do Supabase

-- Primeiro, vamos verificar se há usuários
SELECT id, email FROM auth.users LIMIT 5;

-- Substitua 'SEU_USER_ID_AQUI' pelo ID do seu usuário
-- Você pode pegar o ID executando a query acima

-- Inserir lançamentos de receita
INSERT INTO public.lancamentos (user_id, data, tipo, categoria, valor, descricao, status, observacoes)
VALUES
  -- Substitua 'SEU_USER_ID_AQUI' pelo seu user_id real
  ('SEU_USER_ID_AQUI', '2025-11-01', 'receita', 'Receitas Financeiras', 1000.00, 'Cobrança de Juros', 'confirmado', 'Juros recebidos de aplicação'),
  ('SEU_USER_ID_AQUI', '2025-11-05', 'receita', 'Venda de Produtos', 2500.00, 'Venda de Capa', 'confirmado', 'Venda de produtos diversos'),
  ('SEU_USER_ID_AQUI', '2025-11-10', 'receita', 'Venda de Produtos', 14000.00, 'Venda parcelada de 28 mil reais', 'confirmado', 'Primeira parcela'),
  ('SEU_USER_ID_AQUI', '2025-11-12', 'receita', 'Venda de Produtos', 14000.00, 'Venda parcelada de 28 mil reais', 'confirmado', 'Segunda parcela'),
  ('SEU_USER_ID_AQUI', '2025-11-15', 'receita', 'Venda de Produtos', 250.00, 'Venda de Capa', 'confirmado', 'Venda adicional');

-- Inserir lançamentos de despesa
INSERT INTO public.lancamentos (user_id, data, tipo, categoria, valor, descricao, status, observacoes)
VALUES
  ('SEU_USER_ID_AQUI', '2025-11-04', 'despesa', 'Custo da Matéria-Prima', 17500.00, 'Matéria Prima', 'confirmado', 'Compra de matéria prima'),
  ('SEU_USER_ID_AQUI', '2025-11-05', 'despesa', 'Custo da Matéria-Prima', 17500.00, 'Matéria Prima', 'confirmado', 'Compra adicional de matéria prima');

-- Verificar os lançamentos inseridos
SELECT 
  id,
  data,
  tipo,
  categoria,
  valor,
  descricao,
  status,
  created_at
FROM public.lancamentos
ORDER BY data DESC;

-- Calcular totais
SELECT 
  tipo,
  COUNT(*) as quantidade,
  SUM(valor) as total
FROM public.lancamentos
GROUP BY tipo;
