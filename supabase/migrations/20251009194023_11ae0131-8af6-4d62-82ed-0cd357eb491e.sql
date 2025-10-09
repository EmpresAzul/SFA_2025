-- Security Enhancement Migration: Add explicit RLS denial policies and fix INSERT policies
-- This migration addresses critical security findings from security audit

-- ============================================================================
-- PHASE 1: Add Explicit RLS Denial Policies for Anonymous Access
-- ============================================================================
-- Purpose: Defense-in-depth - explicitly deny all unauthenticated access to sensitive data
-- This prevents potential data exposure if authentication checks fail or are misconfigured

-- 1. Profiles table (contains PII: emails, phone, addresses, company info)
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles FOR ALL TO anon USING (false);

-- 2. Financial transactions (contains complete transaction history)
CREATE POLICY "Deny anonymous access to lancamentos"
ON public.lancamentos FOR ALL TO anon USING (false);

-- 3. Customer/Supplier data (contains business contact information)
CREATE POLICY "Deny anonymous access to cadastros"
ON public.cadastros FOR ALL TO anon USING (false);

-- 4. Bank balances (contains financial account information)
CREATE POLICY "Deny anonymous access to saldos_bancarios"
ON public.saldos_bancarios FOR ALL TO anon USING (false);

-- 5. Inventory data (contains business inventory information)
CREATE POLICY "Deny anonymous access to estoques"
ON public.estoques FOR ALL TO anon USING (false);

-- 6. Pricing data (contains business pricing strategies)
CREATE POLICY "Deny anonymous access to precificacao"
ON public.precificacao FOR ALL TO anon USING (false);

-- 7. Break-even analysis (contains business financial projections)
CREATE POLICY "Deny anonymous access to ponto_equilibrio"
ON public.ponto_equilibrio FOR ALL TO anon USING (false);

-- 8. Reminders (contains user task information)
CREATE POLICY "Deny anonymous access to lembretes"
ON public.lembretes FOR ALL TO anon USING (false);

-- ============================================================================
-- PHASE 2: Fix INSERT Policies - Add WITH CHECK Clauses
-- ============================================================================
-- Purpose: Ensure data integrity by validating user_id on inserts
-- Without WITH CHECK, there's a theoretical risk of inserting data with incorrect user_id

-- Drop and recreate INSERT policies with proper WITH CHECK clauses

-- 1. Cadastros
DROP POLICY IF EXISTS "Users can create own cadastros" ON public.cadastros;
CREATE POLICY "Users can create own cadastros"
ON public.cadastros FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 2. Estoques
DROP POLICY IF EXISTS "Users can create own estoques" ON public.estoques;
CREATE POLICY "Users can create own estoques"
ON public.estoques FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Lancamentos
DROP POLICY IF EXISTS "Users can create own lancamentos" ON public.lancamentos;
CREATE POLICY "Users can create own lancamentos"
ON public.lancamentos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 4. Lembretes
DROP POLICY IF EXISTS "Users can create own lembretes" ON public.lembretes;
CREATE POLICY "Users can create own lembretes"
ON public.lembretes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. Ponto Equilibrio
DROP POLICY IF EXISTS "Users can create own ponto_equilibrio" ON public.ponto_equilibrio;
CREATE POLICY "Users can create own ponto_equilibrio"
ON public.ponto_equilibrio FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 6. Precificacao
DROP POLICY IF EXISTS "Users can create own precificacao" ON public.precificacao;
CREATE POLICY "Users can create own precificacao"
ON public.precificacao FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 7. Saldos Bancarios
DROP POLICY IF EXISTS "Users can create own saldos_bancarios" ON public.saldos_bancarios;
CREATE POLICY "Users can create own saldos_bancarios"
ON public.saldos_bancarios FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 8. Profiles
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- Verification: Ensure RLS is enabled on all tables
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cadastros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saldos_bancarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.precificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ponto_equilibrio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lembretes ENABLE ROW LEVEL SECURITY;