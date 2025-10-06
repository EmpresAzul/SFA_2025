
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Cadastro {
  id: string;
  user_id: string;
  nome: string;
  tipo: string;
  pessoa?: string;
  status: string;
  ativo: boolean;
  cpf_cnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  // Legacy properties for compatibility
  data?: string;
  numero?: string;
  bairro?: string;
  salario?: number;
}

export interface CadastroFormData {
  nome: string;
  tipo: string;
  pessoa?: string;
  status?: string;
  ativo?: boolean;
  cpf_cnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  data?: string;
  numero?: string;
  bairro?: string;
  salario?: number;
  user_id: string;
}

interface UseCadastrosReturn {
  cadastros: Cadastro[];
  loading: boolean;
  error: string | null;
  createCadastro: (data: CadastroFormData) => Promise<void>;
  updateCadastro: (id: string, data: Partial<CadastroFormData>) => Promise<void>;
  deleteCadastro: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  refreshCadastros: () => Promise<void>;
  useCreate: () => ({ mutateAsync: (data: CadastroFormData) => Promise<void> });
  useQuery: () => any;
  useUpdate: () => ({ mutateAsync: (data: { id: string } & Partial<CadastroFormData>) => Promise<void> });
  useDelete: () => ({ mutateAsync: (id: string) => Promise<void> });
}

export const useCadastros = (): UseCadastrosReturn => {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchCadastros = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error: fetchError } = await supabase
        .from('cadastros')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setCadastros(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar cadastros';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createCadastro = useCallback(async (data: CadastroFormData) => {
    try {
      setError(null);
      console.log("🚀 useCadastros: Iniciando criação de cadastro:", data);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Limpar dados undefined e preparar para inserção
      const cadastroData = {
        user_id: user.id,
        nome: data.nome,
        tipo: data.tipo,
        pessoa: data.pessoa || 'Física',
        status: data.status || 'ativo',
        ativo: data.ativo !== false,
        ...(data.cpf_cnpj && { cpf_cnpj: data.cpf_cnpj }),
        ...(data.telefone && { telefone: data.telefone }),
        ...(data.email && { email: data.email }),
        ...(data.endereco && { endereco: data.endereco }),
        ...(data.numero && { numero: data.numero }),
        ...(data.bairro && { bairro: data.bairro }),
        ...(data.cidade && { cidade: data.cidade }),
        ...(data.estado && { estado: data.estado }),
        ...(data.cep && { cep: data.cep }),
        ...(data.observacoes && { observacoes: data.observacoes }),
        ...(data.salario && { salario: data.salario }),
      };

      console.log("📦 useCadastros: Dados preparados para inserção:", cadastroData);

      const { data: insertedData, error: insertError } = await supabase
        .from('cadastros')
        .insert([cadastroData])
        .select()
        .single();

      if (insertError) {
        console.error("❌ useCadastros: Erro na inserção:", insertError);
        throw insertError;
      }

      console.log("✅ useCadastros: Cadastro inserido com sucesso:", insertedData);

      // Invalidar cache do dashboard para atualização em tempo real
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });

      await fetchCadastros();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cadastro';
      console.error("❌ useCadastros: Erro geral:", err);
      setError(errorMessage);
      throw err;
    }
  }, [fetchCadastros, queryClient]);

  const updateCadastro = useCallback(async (id: string, data: Partial<CadastroFormData>) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error: updateError } = await supabase
        .from('cadastros')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Sucesso',
        description: 'Cadastro atualizado com sucesso!',
      });

      // Invalidar cache do dashboard para atualização em tempo real
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });

      await fetchCadastros();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cadastro';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [fetchCadastros, toast]);

  const deleteCadastro = useCallback(async (id: string) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error: deleteError } = await supabase
        .from('cadastros')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      toast({
        title: 'Sucesso',
        description: 'Cadastro excluído com sucesso!',
      });

      // Invalidar cache do dashboard para atualização em tempo real
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });

      await fetchCadastros();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir cadastro';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [fetchCadastros, toast]);

  const toggleStatus = useCallback(async (id: string) => {
    try {
      setError(null);

      const cadastro = cadastros.find(c => c.id === id);
      if (!cadastro) {
        throw new Error('Cadastro não encontrado');
      }

      const newStatus = cadastro.status === 'ativo' ? 'inativo' : 'ativo';

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error: updateError } = await supabase
        .from('cadastros')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Sucesso',
        description: `Status alterado para ${newStatus}!`,
      });

      // Invalidar cache do dashboard para atualização em tempo real
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });

      await fetchCadastros();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar status';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  }, [cadastros, fetchCadastros, toast]);

  const refreshCadastros = useCallback(async () => {
    await fetchCadastros();
  }, [fetchCadastros]);

  const useCreate = useCallback(() => ({
    mutateAsync: createCadastro
  }), [createCadastro]);

  const useQuery = useCallback(() => ({
    data: cadastros,
    isLoading: loading,
    error: error
  }), [cadastros, loading, error]);

  const useUpdate = useCallback(() => ({
    mutateAsync: async (data: { id: string } & Partial<CadastroFormData>) => {
      const { id, ...updateData } = data;
      await updateCadastro(id, updateData);
    }
  }), [updateCadastro]);

  const useDelete = useCallback(() => ({
    mutateAsync: deleteCadastro
  }), [deleteCadastro]);

  useEffect(() => {
    fetchCadastros();
  }, [fetchCadastros]);

  return {
    cadastros,
    loading,
    error,
    createCadastro,
    updateCadastro,
    deleteCadastro,
    toggleStatus,
    refreshCadastros,
    useCreate,
    useQuery,
    useUpdate,
    useDelete,
  };
};
