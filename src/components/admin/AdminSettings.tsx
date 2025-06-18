
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Key, MessageSquare, Bot, CheckCircle, XCircle } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [threadId, setThreadId] = useState('');
  const [assistantId, setAssistantId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', ['openai_api_key', 'openai_thread_id', 'openai_assistant_id']);

      data?.forEach(setting => {
        switch (setting.key) {
          case 'openai_api_key':
            setOpenaiApiKey(setting.value || '');
            break;
          case 'openai_thread_id':
            setThreadId(setting.value || '');
            break;
          case 'openai_assistant_id':
            setAssistantId(setting.value || '');
            break;
        }
      });
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const saveSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      return false;
    }
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    
    try {
      const results = await Promise.all([
        saveSetting('openai_api_key', openaiApiKey),
        saveSetting('openai_thread_id', threadId),
        saveSetting('openai_assistant_id', assistantId)
      ]);

      if (results.every(r => r)) {
        toast({
          title: "Sucesso",
          description: "Configurações salvas com sucesso!",
        });
      } else {
        throw new Error('Erro ao salvar algumas configurações');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    if (!openaiApiKey || !assistantId) {
      toast({
        title: "Configuração incompleta",
        description: "API Key e Assistant ID são obrigatórios para o teste.",
        variant: "destructive",
      });
      return;
    }

    setTestingConnection(true);
    setConnectionStatus('idle');

    try {
      const { data, error } = await supabase.functions.invoke('test-openai-connection', {
        body: { 
          apiKey: openaiApiKey,
          assistantId: assistantId,
          threadId: threadId || undefined
        }
      });

      if (error) throw error;

      if (data.success) {
        setConnectionStatus('success');
        if (data.threadId && !threadId) {
          setThreadId(data.threadId);
          await saveSetting('openai_thread_id', data.threadId);
        }
        toast({
          title: "Conexão bem-sucedida",
          description: "OpenAI Assistant está funcionando corretamente!",
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Erro na conexão",
          description: data.error || "Não foi possível conectar ao OpenAI Assistant.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Erro no teste",
        description: "Erro ao testar conexão. Verifique suas configurações.",
        variant: "destructive",
      });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-500" />
            Configurações do Agente Inteligente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="credentials">Credenciais</TabsTrigger>
              <TabsTrigger value="test">Teste de Conexão</TabsTrigger>
            </TabsList>
            
            <TabsContent value="credentials" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apikey" className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    API Key da OpenAI
                  </Label>
                  <Input
                    id="apikey"
                    type="password"
                    placeholder="sk-..."
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                  />
                  <p className="text-sm text-gray-600">
                    Chave de API para acessar os serviços da OpenAI
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assistantid" className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    Assistant ID
                  </Label>
                  <Input
                    id="assistantid"
                    placeholder="asst_..."
                    value={assistantId}
                    onChange={(e) => setAssistantId(e.target.value)}
                  />
                  <p className="text-sm text-gray-600">
                    ID do Assistant configurado na OpenAI
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threadid" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Thread ID (Opcional)
                  </Label>
                  <Input
                    id="threadid"
                    placeholder="thread_..."
                    value={threadId}
                    onChange={(e) => setThreadId(e.target.value)}
                  />
                  <p className="text-sm text-gray-600">
                    ID da Thread para manter contexto. Será criado automaticamente se vazio.
                  </p>
                </div>

                <Button 
                  onClick={handleSaveAll}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="test" className="space-y-6">
              <div className="text-center">
                <Button 
                  onClick={testConnection}
                  disabled={testingConnection || !openaiApiKey || !assistantId}
                  className="mb-4"
                >
                  {testingConnection ? 'Testando...' : 'Testar Conexão'}
                </Button>

                {connectionStatus !== 'idle' && (
                  <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
                    connectionStatus === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {connectionStatus === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span>
                      {connectionStatus === 'success' 
                        ? 'Conexão estabelecida com sucesso!' 
                        : 'Falha na conexão. Verifique suas configurações.'}
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
