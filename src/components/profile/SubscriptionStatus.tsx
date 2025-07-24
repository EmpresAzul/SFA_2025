import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CreditCard, CheckCircle } from "lucide-react";
import { SubscriptionInfo } from "@/types/profile";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SubscriptionStatusProps {
  subscription: SubscriptionInfo;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ subscription }) => {
  const dataAtivacao = new Date(subscription.data_ativacao);
  const dataExpiracao = new Date(subscription.data_expiracao);
  const hoje = new Date();
  const diasRestantes = differenceInDays(dataExpiracao, hoje);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'expirado':
        return <Badge variant="destructive">Expirado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getPlanoLabel = (plano: string) => {
    switch (plano) {
      case 'basico':
        return 'Básico';
      case 'profissional':
        return 'Profissional';
      case 'empresarial':
        return 'Empresarial';
      default:
        return plano;
    }
  };

  const getDaysRemainingColor = (days: number) => {
    if (days <= 7) return 'text-red-700';
    if (days <= 30) return 'text-yellow-700';
    return 'text-green-700';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Plano Atual</CardTitle>
          <div className="p-2 bg-blue-500 rounded-lg">
            <CreditCard className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700 mb-1">
            {getPlanoLabel(subscription.plano)}
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(subscription.status)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Data de Ativação</CardTitle>
          <div className="p-2 bg-green-500 rounded-lg">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-green-700 mb-1">
            {format(dataAtivacao, "dd/MM/yyyy", { locale: ptBR })}
          </div>
          <p className="text-xs text-green-600">
            {format(dataAtivacao, "EEEE", { locale: ptBR })}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Data de Expiração</CardTitle>
          <div className="p-2 bg-purple-500 rounded-lg">
            <Calendar className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-purple-700 mb-1">
            {format(dataExpiracao, "dd/MM/yyyy", { locale: ptBR })}
          </div>
          <p className="text-xs text-purple-600">
            {format(dataExpiracao, "EEEE", { locale: ptBR })}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">Dias Restantes</CardTitle>
          <div className="p-2 bg-orange-500 rounded-lg">
            <Clock className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold mb-1 ${getDaysRemainingColor(diasRestantes)}`}>
            {diasRestantes > 0 ? diasRestantes : 0}
          </div>
          <p className="text-xs text-orange-600">
            {diasRestantes <= 0 ? 'Expirado' : diasRestantes === 1 ? 'dia' : 'dias'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};