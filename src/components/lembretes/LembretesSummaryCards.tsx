import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Calendar, Clock, AlertTriangle } from "lucide-react";
import type { Lembrete } from "@/hooks/useLembretes";

interface LembretesSummaryCardsProps {
  lembretes: Lembrete[];
}

const LembretesSummaryCards: React.FC<LembretesSummaryCardsProps> = ({
  lembretes,
}) => {
  const getTotalLembretes = () => lembretes.length;

  const getLembretesAtivos = () => {
    return lembretes.filter((l) => l.status === "ativo").length;
  };

  const getLembretesHoje = () => {
    const hoje = new Date().toISOString().split("T")[0];
    return lembretes.filter(
      (l) => l.status === "ativo" && l.data_lembrete === hoje,
    ).length;
  };

  const getLembretesVencidos = () => {
    const hoje = new Date().toISOString().split("T")[0];
    return lembretes.filter(
      (l) => l.status === "ativo" && l.data_lembrete < hoje,
    ).length;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Bell className="h-10 w-10 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">
                Total Lembretes
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {getTotalLembretes()}
              </p>
              <p className="text-xs text-blue-600 mt-1">Todos os lembretes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Calendar className="h-10 w-10 text-emerald-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-emerald-600">Ativos</p>
              <p className="text-2xl font-bold text-emerald-900">
                {getLembretesAtivos()}
              </p>
              <p className="text-xs text-emerald-600 mt-1">Lembretes ativos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Clock className="h-10 w-10 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">Para Hoje</p>
              <p className="text-2xl font-bold text-orange-900">
                {getLembretesHoje()}
              </p>
              <p className="text-xs text-orange-600 mt-1">Lembretes de hoje</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-10 w-10 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-red-600">Vencidos</p>
              <p className="text-2xl font-bold text-red-900">
                {getLembretesVencidos()}
              </p>
              <p className="text-xs text-red-600 mt-1">Precisam atenção</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LembretesSummaryCards;
