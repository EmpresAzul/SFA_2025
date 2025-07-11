import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const LancamentosTableEmptyState: React.FC = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum lançamento encontrado
        </h3>
        <p className="text-gray-500 text-center">
          Não há lançamentos que correspondam aos filtros aplicados.
        </p>
      </CardContent>
    </Card>
  );
};

export default LancamentosTableEmptyState;