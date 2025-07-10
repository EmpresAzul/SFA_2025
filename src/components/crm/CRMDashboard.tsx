import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCRMLeads } from "@/hooks/useCRM";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
);

const statusLabels = {
  prospeccao: "Prospecção",
  qualificacao: "Qualificação",
  proposta: "Proposta",
  negociacao: "Negociação",
  fechamento: "Fechamento",
  perdido: "Perdido",
};

const statusColors = {
  prospeccao: "#3b82f6",
  qualificacao: "#eab308",
  proposta: "#a21caf",
  negociacao: "#f59e42",
  fechamento: "#22c55e",
  perdido: "#ef4444",
};

const sourceColors = {
  Website: "#3b82f6",
  LinkedIn: "#0ea5e9",
  Indicação: "#10b981",
  "Email Marketing": "#f59e0b",
  Evento: "#8b5cf6",
  "Cold Call": "#ef4444",
  Outros: "#6b7280",
};

export function CRMDashboard() {
  const { data: leads = [], isLoading } = useCRMLeads();

  // Métricas principais
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const avgProbability =
    leads.length > 0
      ? Math.round(
          leads.reduce((sum, lead) => sum + lead.probability, 0) / leads.length,
        )
      : 0;
  const closedLeads = leads.filter((l) => l.status === "fechamento").length;
  const lostLeads = leads.filter((l) => l.status === "perdido").length;
  const activeLeads = leads.filter(
    (l) => l.status !== "perdido" && l.status !== "fechamento",
  ).length;
  const conversionRate =
    totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;
  const winRate =
    closedLeads + lostLeads > 0
      ? Math.round((closedLeads / (closedLeads + lostLeads)) * 100)
      : 0;

  // Próximos follow-ups
  const nextFollowUps = leads
    .filter((l) => l.next_follow_up && new Date(l.next_follow_up) >= new Date())
    .sort((a, b) => (a.next_follow_up || "").localeCompare(b.next_follow_up))
    .slice(0, 5);

  // Leads por status
  const statusCounts = Object.keys(statusLabels).map(
    (status) => leads.filter((l) => l.status === status).length,
  );
  const statusValues = Object.keys(statusLabels).map((status) =>
    leads
      .filter((l) => l.status === status)
      .reduce((sum, l) => sum + l.value, 0),
  );

  // Leads por origem
  const sourceCounts = leads.reduce(
    (acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Evolução mensal (últimos 6 meses)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString("pt-BR", { month: "short" });
    const monthLeads = leads.filter((lead) => {
      const leadDate = new Date(lead.created_at);
      return (
        leadDate.getMonth() === date.getMonth() &&
        leadDate.getFullYear() === date.getFullYear()
      );
    }).length;
    return { month, count: monthLeads };
  }).reverse();

  // Gráfico de funil (barras)
  const funnelData = {
    labels: Object.values(statusLabels),
    datasets: [
      {
        label: "Quantidade de Leads",
        data: statusCounts,
        backgroundColor: Object.keys(statusLabels).map((s) => statusColors[s]),
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Valor Total (R$)",
        data: statusValues,
        backgroundColor: Object.keys(statusLabels).map(
          (s) => statusColors[s] + "99",
        ),
        borderRadius: 8,
        borderSkipped: false,
        yAxisID: "y1",
      },
    ],
  };

  // Gráfico de pizza (distribuição por status)
  const pieData = {
    labels: Object.values(statusLabels),
    datasets: [
      {
        data: statusCounts,
        backgroundColor: Object.keys(statusLabels).map((s) => statusColors[s]),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // Gráfico de rosca (origem dos leads)
  const doughnutData = {
    labels: Object.keys(sourceCounts),
    datasets: [
      {
        data: Object.values(sourceCounts),
        backgroundColor: Object.keys(sourceCounts).map(
          (source) =>
            sourceColors[source as keyof typeof sourceColors] || "#6b7280",
        ),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // Gráfico de linha (evolução mensal)
  const lineData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Leads Criados",
        data: monthlyData.map((d) => d.count),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Total de Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{totalLeads}</div>
            <div className="text-xs text-blue-600 mt-1">
              {activeLeads} ativos • {closedLeads} fechados
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Valor Potencial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">
              R$ {totalValue.toLocaleString("pt-BR")}
            </div>
            <div className="text-xs text-green-600 mt-1">
              Média: R${" "}
              {totalLeads > 0
                ? (totalValue / totalLeads).toLocaleString("pt-BR", {
                    maximumFractionDigits: 0,
                  })
                : "0"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {conversionRate}%
            </div>
            <Progress value={conversionRate} className="mt-2 h-2" />
            <div className="text-xs text-purple-600 mt-1">
              {closedLeads} de {totalLeads} leads
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Probabilidade Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-800">
              {avgProbability}%
            </div>
            <Progress value={avgProbability} className="mt-2 h-2" />
            <div className="text-xs text-orange-600 mt-1">
              {winRate}% de win rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Funil de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Funil de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={funnelData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        if (context.datasetIndex === 0) {
                          return `Leads: ${context.parsed.y}`;
                        } else {
                          return `Valor: R$ ${context.parsed.y.toLocaleString("pt-BR")}`;
                        }
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: "Quantidade" },
                    grid: { color: "rgba(0,0,0,0.1)" },
                  },
                  y1: {
                    beginAtZero: true,
                    position: "right",
                    title: { display: true, text: "Valor (R$)" },
                    grid: { drawOnChartArea: false },
                    ticks: {
                      callback: function (value) {
                        return "R$ " + Number(value).toLocaleString("pt-BR");
                      },
                    },
                  },
                  x: {
                    grid: { color: "rgba(0,0,0,0.1)" },
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Distribuição por Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Distribuição por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Pie
              data={pieData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const total = context.dataset.data.reduce(
                          (a: number, b: number) => a + b,
                          0,
                        );
                        const percentage = (
                          (context.parsed / total) *
                          100
                        ).toFixed(1);
                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Origem dos Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Origem dos Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const total = context.dataset.data.reduce(
                          (a: number, b: number) => a + b,
                          0,
                        );
                        const percentage = (
                          (context.parsed / total) *
                          100
                        ).toFixed(1);
                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Evolução Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              Evolução Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={lineData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `Leads: ${context.parsed.y}`;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: "rgba(0,0,0,0.1)" },
                  },
                  x: {
                    grid: { color: "rgba(0,0,0,0.1)" },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Próximos Follow-ups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            Próximos Follow-ups
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nextFollowUps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📅</div>
              <p>Nenhum follow-up agendado para os próximos dias.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {nextFollowUps.map((lead, index) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <span className="mr-2">{lead.company}</span>
                        <Badge
                          className={statusColors[lead.status] + " text-xs"}
                        >
                          {statusLabels[lead.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {lead.next_follow_up
                        ? new Date(lead.next_follow_up).toLocaleDateString(
                            "pt-BR",
                          )
                        : "Não agendado"}
                    </div>
                    <div className="text-xs text-gray-500">
                      R$ {lead.value.toLocaleString("pt-BR")} •{" "}
                      {lead.probability}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo por Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(statusLabels).map(([status, label]) => {
          const statusLeads = leads.filter((l) => l.status === status);
          const statusValue = statusLeads.reduce((sum, l) => sum + l.value, 0);
          const avgProb =
            statusLeads.length > 0
              ? Math.round(
                  statusLeads.reduce((sum, l) => sum + l.probability, 0) /
                    statusLeads.length,
                )
              : 0;

          return (
            <Card key={status} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{label}</CardTitle>
                  <Badge className={statusColors[status] + " text-xs"}>
                    {statusLeads.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor Total:</span>
                  <span className="font-medium">
                    R$ {statusValue.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Prob. Média:</span>
                  <span className="font-medium">{avgProb}%</span>
                </div>
                <Progress value={avgProb} className="h-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
