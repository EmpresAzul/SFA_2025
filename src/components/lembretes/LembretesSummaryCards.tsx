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
    <div className="lembretes-summary-cards">
      <Card className="lembretes-card bg-gradient-to-br from-blue-400 to-blue-600 text-white">
        <CardContent className="lembretes-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="lembretes-card-title">Total Lembretes</p>
              <p className="lembretes-card-value">{getTotalLembretes()}</p>
              <p className="text-xs text-white/80">Todos os lembretes</p>
            </div>
            <div className="lembretes-card-icon">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lembretes-card bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
        <CardContent className="lembretes-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="lembretes-card-title">Ativos</p>
              <p className="lembretes-card-value">{getLembretesAtivos()}</p>
              <p className="text-xs text-white/80">Lembretes ativos</p>
            </div>
            <div className="lembretes-card-icon">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lembretes-card bg-gradient-to-br from-orange-400 to-orange-600 text-white">
        <CardContent className="lembretes-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="lembretes-card-title">Para Hoje</p>
              <p className="lembretes-card-value">{getLembretesHoje()}</p>
              <p className="text-xs text-white/80">Lembretes de hoje</p>
            </div>
            <div className="lembretes-card-icon">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lembretes-card bg-gradient-to-br from-red-400 to-red-600 text-white">
        <CardContent className="lembretes-card-content">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="lembretes-card-title">Vencidos</p>
              <p className="lembretes-card-value">{getLembretesVencidos()}</p>
              <p className="text-xs text-white/80">Precisam atenção</p>
            </div>
            <div className="lembretes-card-icon">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LembretesSummaryCards;
