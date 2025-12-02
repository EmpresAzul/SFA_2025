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
    return lembretes.filter((l) => l.status === "ativo" || l.status === null).length;
  };

  const getLembretesHoje = () => {
    const hoje = new Date().toISOString().split("T")[0];
    return lembretes.filter(
      (l) => (l.status === "ativo" || l.status === null) && l.data_vencimento === hoje,
    ).length;
  };

  const getLembretesVencidos = () => {
    const hoje = new Date().toISOString().split("T")[0];
    return lembretes.filter(
      (l) => (l.status === "ativo" || l.status === null) && l.data_vencimento < hoje,
    ).length;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Total Lembretes</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{getTotalLembretes()}</p>
              <p className="text-xs text-white/80">Todos os lembretes</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bell className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Ativos</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{getLembretesAtivos()}</p>
              <p className="text-xs text-white/80">Lembretes ativos</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Para Hoje</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{getLembretesHoje()}</p>
              <p className="text-xs text-white/80">Lembretes de hoje</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-400 via-red-500 to-rose-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-6 w-6 text-white/90" />
                <p className="text-sm font-medium text-white/90">Vencidos</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{getLembretesVencidos()}</p>
              <p className="text-xs text-white/80">Precisam atenção</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LembretesSummaryCards;
