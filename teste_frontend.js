// Script para testar salvamento do frontend
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase (mesmas do frontend)
const SUPABASE_URL = 'https://tssbhjqnptffswnyynhq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzc2JoanFucHRmZnN3bnl5bmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzY3MjUsImV4cCI6MjA2OTAxMjcyNX0.bnU7rPhFZghN50Sqd_xaLLEZOFjpvtwsMDBP_v3G3EY';

// Criar cliente Supabase com configurações idênticas ao frontend
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Simular dados do formulário
const simularDadosFormulario = () => {
  return {
    tipo: 'receita',
    data: '2025-01-29',
    valor: '15000,00',
    categoria: 'Venda de Mercadorias',
    cliente_id: null,
    fornecedor_id: null,
    observacoes: 'Teste de salvamento'
  };
};

// Simular processamento do valor
const parseStringToNumber = (value) => {
  if (typeof value === "number") return value;
  if (!value || typeof value !== "string") return 0;

  let cleanValue = value.replace(/[^\d,.-]/g, "");
  if (!cleanValue) return 0;

  if (cleanValue.includes(",")) {
    cleanValue = cleanValue.replace(/\./g, "").replace(",", ".");
  } else {
    const parts = cleanValue.split(".");
    if (parts.length > 1 && parts[parts.length - 1].length === 2) {
      parts[parts.length - 2] = parts.slice(0, -1).join("");
      cleanValue = parts[parts.length - 2] + "." + parts[parts.length - 1];
    } else {
      cleanValue = cleanValue.replace(/\./g, "");
    }
  }

  const result = parseFloat(cleanValue);
  return isNaN(result) ? 0 : result;
};

async function testarSalvamentoFrontend() {
  try {
    console.log('🧪 Testando salvamento do frontend...');
    
    // Simular dados do formulário
    const formData = simularDadosFormulario();
    console.log('📝 Dados do formulário:', formData);
    
    // Processar valor
    const valorNumerico = parseStringToNumber(formData.valor);
    console.log('💰 Valor processado:', valorNumerico);
    
    // Verificar sessão
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erro ao verificar sessão:', sessionError);
      return;
    }
    
    if (!session) {
      console.log('⚠️ Nenhuma sessão ativa - simulando com ID fictício');
      
      // Simular dados de lançamento como no frontend
      const lancamentoData = {
        tipo: formData.tipo,
        data: formData.data,
        valor: valorNumerico,
        categoria: formData.categoria,
        descricao: formData.observacoes || `${formData.tipo} - ${formData.categoria}`,
        cliente_id: formData.cliente_id || null,
        fornecedor_id: formData.fornecedor_id || null,
        observacoes: formData.observacoes || `${formData.tipo} - ${formData.categoria}`,
        status: "ativo",
        user_id: '00000000-0000-0000-0000-000000000000' // ID fictício para teste
      };
      
      console.log('📋 Dados do lançamento (simulado):', lancamentoData);
      
      // Tentar inserir
      const { data, error } = await supabase
        .from('lancamentos')
        .insert([lancamentoData])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao inserir lançamento:', error);
        console.error('📋 Detalhes do erro:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
      } else {
        console.log('✅ Lançamento inserido com sucesso:', data);
      }
    } else {
      console.log('✅ Sessão ativa encontrada');
      console.log('👤 Usuário ID:', session.user.id);
      
      // Usar dados reais do usuário
      const lancamentoData = {
        tipo: formData.tipo,
        data: formData.data,
        valor: valorNumerico,
        categoria: formData.categoria,
        descricao: formData.observacoes || `${formData.tipo} - ${formData.categoria}`,
        cliente_id: formData.cliente_id || null,
        fornecedor_id: formData.fornecedor_id || null,
        observacoes: formData.observacoes || `${formData.tipo} - ${formData.categoria}`,
        status: "ativo",
        user_id: session.user.id
      };
      
      console.log('📋 Dados do lançamento (real):', lancamentoData);
      
      // Tentar inserir
      const { data, error } = await supabase
        .from('lancamentos')
        .insert([lancamentoData])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao inserir lançamento:', error);
        console.error('📋 Detalhes do erro:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
      } else {
        console.log('✅ Lançamento inserido com sucesso:', data);
      }
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

// Executar teste
testarSalvamentoFrontend();