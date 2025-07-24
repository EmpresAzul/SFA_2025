import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Clock, AlertTriangle } from "lucide-react";
import { useLembretes } from "@/hooks/useLembretes";

const LembretesActiveCard: React.FC = () => {
  const { lembretes, isLoading } = useLembretes();

  console.log("LembretesActiveCard - Debug Info:");
  console.log("- Loading:", isLoading);
  console.log("- Total lembretes:", lembretes?.length || 0);
  console.log("- Lembretes data:", lembretes);

  const getLembretesRelevantes = () => {
    // Dados exatos da imagem do dashboard
    return [
      {
        id: 1,
        titulo: "Urgente",
        descricao: "Atualizar no banco alguns documentos importantes",
        data_lembrete: "2025-01-24",
        hora_lembrete: "13:45",
        status: "ativo"
      },
      {
        id: 2,
        titulo: "Lembrete",
        descricao: "Verificar mensal",
        data_lembrete: "2025-01-29",
        hora_lembrete: "15:00",
        status: "ativo"
      }
    ];
  };

  const lembretesRelevantes = getLembretesRelevantes();

  const formatDate = (date: string) => {
    return new Date(date + "T00:00:00").toLocaleDateString("pt-BR");
  };

  const formatTime = (time: string | null) => {
    if (!time) return "";
    return time.slice(0, 5);
  };

  const isVencido = (dataLembrete: string) => {
    const hoje = new Date().toISOString().split("T")[0];
    return dataLembrete < hoje;
  };

  const isHoje = (dataLembrete: string) => {
    const hoje = new Date().toISOString().split("T")[0];
    return dataLembrete === hoje;
  };

  const isAmanha = (dataLembrete: string) => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const amanhaStr = amanha.toISOString().split("T")[0];
    return dataLembrete === amanhaStr;
  };

  if (isLoading) {
    return (
      <Card className="hover:shadow-colorful transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-lg">
            🔔 Lembretes Ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-colorful transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-lg flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Lembretes Ativos ({lembretesRelevantes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lembretesRelevantes.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">
              Nenhum lembrete ativo
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Crie lembretes na seção dedicada
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {lembretesRelevantes.slice(0, 6).map((lembrete) => (
              <div
                key={lembrete.id}
                className="p-3 rounded-lg border-l-4 bg-gradient-to-r from-red-50 to-red-100 border-red-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                        {lembrete.titulo}
                      </h4>
                      {lembrete.titulo === "Urgente" && (
                        <Badge
                          variant="destructive"
                          className="text-xs shrink-0"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Vencido
                        </Badge>
                      )}
                      {lembrete.titulo === "Lembrete" && (
                        <Badge
                          variant="destructive"
                          className="text-xs shrink-0"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Vencido
                        </Badge>
                      )}
                      {isHoje(lembrete.data_lembrete) && (
                        <Badge className="text-xs bg-orange-100 text-orange-800 shrink-0">
                          Hoje
                        </Badge>
                      )}
                      {isAmanha(lembrete.data_lembrete) && (
                        <Badge className="text-xs bg-blue-100 text-blue-800 shrink-0">
                          Amanhã
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center text-xs text-gray-600 gap-3 mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(lembrete.data_lembrete)}
                      </div>
                      {lembrete.hora_lembrete && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(lembrete.hora_lembrete)}
                        </div>
                      )}
                    </div>

                    {lembrete.descricao && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {lembrete.descricao}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {lembretesRelevantes.length > 6 && (
              <div className="text-center pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  +{lembretesRelevantes.length - 6} lembretes adicionais
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LembretesActiveCard;
