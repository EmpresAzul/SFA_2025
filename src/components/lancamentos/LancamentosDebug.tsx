import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const LancamentosDebug: React.FC = () => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testarCriacao = async () => {
    if (!user) {
      alert('Usuário não autenticado');
      return;
    }

    setLoading(true);
    const info: any = {
      userId: user.id,
      timestamp: new Date().toISOString(),
      steps: []
    };

    try {
      // Passo 1: Verificar lançamentos existentes
      info.steps.push({ step: 1, action: 'Buscando lançamentos existentes' });
      const { data: existing, error: fetchError } = await supabase
        .from('lancamentos')
        .select('*')
        .limit(3);

      if (fetchError) {
        info.steps.push({ step: 1, error: fetchError });
      } else {
        info.steps.push({ step: 1, success: true, count: existing?.length || 0, data: existing });
      }

      // Passo 2: Criar lançamento de teste
      info.steps.push({ step: 2, action: 'Criando lançamento de teste' });
      const testData = {
        user_id: user.id,
        data: new Date().toISOString().split('T')[0],
        tipo: 'receita',
        categoria: 'Teste Debug',
        valor: 99.99,
        descricao: 'Teste de debug do sistema',
        status: 'confirmado',
        recorrente: false,
        meses_recorrencia: null,
        observacoes: 'Criado via componente de debug'
      };

      info.steps.push({ step: 2, testData });

      const { data: created, error: createError } = await supabase
        .from('lancamentos')
        .insert([testData])
        .select()
        .single();

      if (createError) {
        info.steps.push({ 
          step: 2, 
          error: {
            message: createError.message,
            details: createError.details,
            hint: createError.hint,
            code: createError.code
          }
        });
      } else {
        info.steps.push({ step: 2, success: true, created });

        // Passo 3: Deletar lançamento de teste
        info.steps.push({ step: 3, action: 'Deletando lançamento de teste' });
        const { error: deleteError } = await supabase
          .from('lancamentos')
          .delete()
          .eq('id', created.id);

        if (deleteError) {
          info.steps.push({ step: 3, error: deleteError });
        } else {
          info.steps.push({ step: 3, success: true });
        }
      }

    } catch (error) {
      info.steps.push({ error: String(error) });
    }

    setDebugInfo(info);
    setLoading(false);
  };

  return (
    <Card className="mt-4 border-2 border-yellow-400">
      <CardHeader>
        <CardTitle className="text-yellow-600">🐛 Debug de Lançamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testarCriacao} 
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Testando...' : 'Testar Criação de Lançamento'}
        </Button>

        {debugInfo && (
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-xs">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
};
