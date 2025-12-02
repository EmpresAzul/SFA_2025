import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Target, TrendingDown, TrendingUp } from "lucide-react";

interface ResultadosPontoEquilibrioProps {
  faturamentoAtual: number;
  pontoEquilibrio: number;
  percentualPE: number;
  margemContribuicao: number;
}

const ResultadosPontoEquilibrio: React.FC<ResultadosPontoEquilibrioProps> = ({
  faturamentoAtual,
  pontoEquilibrio,
  percentualPE,
  margemContribuicao,
}) => {
  const dadosGrafico = [
    {
      name: "Faturamento Atual",
      valor: faturamentoAtual,
      fill: "#3b82f6",
    },
    {
      name: "Ponto de Equilíbrio",
      valor: pontoEquilibrio,
      fill: "#ef4444",
    },
  ];

  const situacao =
    faturamentoAtual >= pontoEquilibrio ? "positiva" : "negativa";

  return (
    <div className="space-y-6">
      {/* Gráfico Comparativo */}
      <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-red-700 text-lg">
            <Target className="w-5 h-5" />
            Comparativo: Faturamento vs Ponto de Equilíbrio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dadosGrafico}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  stroke="#666"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [
                    `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                    "",
                  ]}
                  labelStyle={{ color: "#333" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Resultado do Ponto de Equilíbrio */}
      <Card
        className={`hover:shadow-lg transition-all duration-300 border-0 shadow-md ${
          situacao === "positiva"
            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
            : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
        }`}
      >
        <CardHeader className="pb-4">
          <CardTitle
            className={`flex items-center gap-2 text-lg ${
              situacao === "positiva" ? "text-green-700" : "text-red-700"
            }`}
          >
            {situacao === "positiva" ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            O Cálculo do PE
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Ponto de Equilíbrio:</p>
            <div
              className={`text-3xl font-bold ${situacao === "positiva" ? "text-green-600" : "text-red-600"}`}
            >
              R${" "}
              {pontoEquilibrio.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Percentual do Faturamento</p>
              <p
                className={`text-xl font-bold ${situacao === "positiva" ? "text-green-600" : "text-red-600"}`}
              >
                {percentualPE.toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Margem de Contribuição</p>
              <p className="text-xl font-bold text-blue-600">
                {margemContribuicao.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Situação do Negócio */}
      <Card
        className={`hover:shadow-lg transition-all duration-300 border-0 shadow-md ${
          situacao === "positiva"
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
            : "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
        }`}
      >
        <CardHeader className="pb-4">
          <CardTitle
            className={`flex items-center gap-2 text-lg ${
              situacao === "positiva" ? "text-blue-700" : "text-orange-700"
            }`}
          >
            <Target className="w-5 h-5" />
            PE considerando a receita atual
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          {situacao === "positiva" ? (
            <>
              <div className="text-green-600 font-semibold">
                ✅ Parabéns! Seu faturamento está acima do ponto de equilíbrio
              </div>
              <div className="text-lg">
                Margem de segurança:
                <span className="font-bold text-green-600 ml-2">
                  R${" "}
                  {(faturamentoAtual - pontoEquilibrio).toLocaleString(
                    "pt-BR",
                    { minimumFractionDigits: 2 },
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                (
                {(
                  ((faturamentoAtual - pontoEquilibrio) / faturamentoAtual) *
                  100
                ).toFixed(1)}
                % do faturamento atual)
              </div>
            </>
          ) : (
            <>
              <div className="text-orange-600 font-semibold">
                ⚠️ Atenção! Seu faturamento está abaixo do ponto de equilíbrio
              </div>
              <div className="text-lg">
                Falta faturar:
                <span className="font-bold text-red-600 ml-2">
                  R${" "}
                  {(pontoEquilibrio - faturamentoAtual).toLocaleString(
                    "pt-BR",
                    { minimumFractionDigits: 2 },
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                (
                {(
                  ((pontoEquilibrio - faturamentoAtual) / pontoEquilibrio) *
                  100
                ).toFixed(1)}
                % a mais do que o faturamento atual)
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultadosPontoEquilibrio;
