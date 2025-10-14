import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Settings,
  Key,
  MessageSquare,
  Bot,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
} from "lucide-react";
import UserManagement from "./UserManagement";

const AdminSettings: React.FC = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [threadId, setThreadId] = useState("");
  const [assistantId, setAssistantId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoadingSettings(true);
    try {
      console.log("Carregando configurações...");
      const { data, error } = await supabase
        .from("system_settings" as any)
        .select("key, value")
        .in("key", [
          "openai_api_key",
          "openai_thread_id",
          "openai_assistant_id",
        ]);

      if (error) {
        console.error("Erro ao carregar configurações:", error);
        throw error;
      }

      console.log("Configurações carregadas:", data);

      (data as any[])?.forEach((setting: any) => {
        switch (setting.key) {
          case "openai_api_key":
            setOpenaiApiKey(setting.value || "");
            break;
          case "openai_thread_id":
            setThreadId(setting.value || "");
            break;
          case "openai_assistant_id":
            setAssistantId(setting.value || "");
            break;
        }
      });
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const saveSetting = async (key: string, value: string) => {
    try {
      console.log(
        `Salvando configuração: ${key} = ${value ? "[SET]" : "[EMPTY]"}`,
      );

      const { data, error } = await supabase
        .from("system_settings" as any)
        .upsert(
          {
            key,
            value: value || null,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "key",
          },
        )
        .select();

      if (error) {
        console.error(`Erro ao salvar ${key}:`, error);
        throw error;
      }

      console.log(`Configuração ${key} salva com sucesso:`, data);
      return true;
    } catch (error) {
      console.error(`Erro ao salvar configuração ${key}:`, error);
      return false;
    }
  };

  const handleSaveAll = async () => {
    setIsLoading(true);

    try {
      console.log("Iniciando salvamento de todas as configurações...");

      const results = await Promise.all([
        saveSetting("openai_api_key", openaiApiKey),
        saveSetting("openai_thread_id", threadId),
        saveSetting("openai_assistant_id", assistantId),
      ]);

      const allSucceeded = results.every((r) => r);
      console.log(
        "Resultados do salvamento:",
        results,
        "Todos bem-sucedidos:",
        allSucceeded,
      );

      if (allSucceeded) {
        toast({
          title: "Sucesso",
          description: "Configurações salvas com sucesso!",
        });

        // Recarregar as configurações para confirmar que foram salvas
        await loadSettings();
      } else {
        throw new Error("Erro ao salvar algumas configurações");
      }
    } catch (error) {
      console.error("Erro no salvamento:", error);
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
    setConnectionStatus("idle");

    try {
      console.log("Testando conexão com OpenAI...");
      const { data, error } = await supabase.functions.invoke(
        "test-openai-connection",
        {
          body: {
            apiKey: openaiApiKey,
            assistantId: assistantId,
            threadId: threadId || undefined,
          },
        },
      );

      if (error) {
        console.error("Erro na função de teste:", error);
        throw error;
      }

      console.log("Resultado do teste de conexão:", data);

      if (data.success) {
        setConnectionStatus("success");
        if (data.threadId && !threadId) {
          setThreadId(data.threadId);
          await saveSetting("openai_thread_id", data.threadId);
        }
        toast({
          title: "Conexão bem-sucedida",
          description: "OpenAI Assistant está funcionando corretamente!",
        });
      } else {
        setConnectionStatus("error");
        toast({
          title: "Erro na conexão",
          description:
            data.error || "Não foi possível conectar ao OpenAI Assistant.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro no teste de conexão:", error);
      setConnectionStatus("error");
      toast({
        title: "Erro no teste",
        description: "Erro ao testar conexão. Verifique suas configurações.",
        variant: "destructive",
      });
    } finally {
      setTestingConnection(false);
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-violet-500 mx-auto mb-4" />
            <p className="text-gray-600">Carregando configurações...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="credentials">Credenciais</TabsTrigger>
              <TabsTrigger value="test">Teste de Conexão</TabsTrigger>
              <TabsTrigger value="users">
                <Users className="w-4 h-4 mr-2" />
                Usuários
              </TabsTrigger>
            </TabsList>

            <TabsContent value="credentials" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apikey" className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    API Key da OpenAI *
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
                  <Label
                    htmlFor="assistantid"
                    className="flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4" />
                    Assistant ID *
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
                    ID da Thread para manter contexto. Será criado
                    automaticamente se vazio.
                  </p>
                </div>

                <Button
                  onClick={handleSaveAll}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Configurações"
                  )}
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
                  {testingConnection ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    "Testar Conexão"
                  )}
                </Button>

                {connectionStatus !== "idle" && (
                  <div
                    className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
                      connectionStatus === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {connectionStatus === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span>
                      {connectionStatus === "success"
                        ? "Conexão estabelecida com sucesso!"
                        : "Falha na conexão. Verifique suas configurações."}
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
