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
    if (!lembretes || lembretes.length === 0) return [];
    
    // Filtrar lembretes ativos e ordenar por data de vencimento
    return lembretes
      .filter(lembrete => (lembrete.status === "ativo" || lembrete.status === null))
      .sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())
      .slice(0, 6); // Mostrar apenas os 6 mais próximos
  };

  const lembretesRelevantes = getLembretesRelevantes();

  const formatDate = (date: string) => {
    return new Date(date + "T00:00:00").toLocaleDateString("pt-BR");
  };

  const formatTime = (time: string | null) => {
    if (!time) return "";
    return time.slice(0, 5);
  };

  const isVencido = (dataVencimento: string) => {
    const hoje = new Date().toISOString().split("T")[0];
    return dataVencimento < hoje;
  };

  const isHoje = (dataVencimento: string) => {
    const hoje = new Date().toISOString().split("T")[0];
    return dataVencimento === hoje;
  };

  const isAmanha = (dataVencimento: string) => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const amanhaStr = amanha.toISOString().split("T")[0];
    return dataVencimento === amanhaStr;
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
            {lembretesRelevantes.slice(0, 6).map((lembrete) => {
              const vencido = isVencido(lembrete.data_vencimento);
              const hoje = isHoje(lembrete.data_vencimento);
              const amanha = isAmanha(lembrete.data_vencimento);
              
              return (
                <div
                  key={lembrete.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    vencido 
                      ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-500'
                      : hoje
                      ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-500'
                      : amanha
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-500'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {lembrete.titulo}
                        </h4>
                        {vencido && (
                          <Badge
                            variant="destructive"
                            className="text-xs shrink-0"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Vencido
                          </Badge>
                        )}
                        {hoje && (
                          <Badge className="text-xs bg-orange-100 text-orange-800 shrink-0">
                            Hoje
                          </Badge>
                        )}
                        {amanha && (
                          <Badge className="text-xs bg-blue-100 text-blue-800 shrink-0">
                            Amanhã
                          </Badge>
                        )}
                        {lembrete.prioridade && (
                          <Badge className={`text-xs shrink-0 ${
                            lembrete.prioridade === 'alta' ? 'bg-red-100 text-red-800' :
                            lembrete.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {lembrete.prioridade}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center text-xs text-gray-600 gap-3 mb-2">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(lembrete.data_vencimento)}
                        </div>
                      </div>

                      {lembrete.descricao && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {lembrete.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

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
