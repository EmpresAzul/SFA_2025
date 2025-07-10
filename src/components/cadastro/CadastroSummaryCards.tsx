import React from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => (
  <div className="flex flex-col items-start justify-between p-4 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-white border border-blue-100 min-w-[180px] transition-transform hover:scale-[1.03]">
    <div className="flex items-center gap-2 mb-2 text-blue-600">{icon}</div>
    <div className="text-xs font-medium text-gray-500 mb-1">{title}</div>
    <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      {value}
    </div>
  </div>
);

interface CadastroSummaryCardsProps {
  cards: Array<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
  }>;
}

export const CadastroSummaryCards: React.FC<CadastroSummaryCardsProps> = ({ cards }) => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <SummaryCard key={idx} {...card} />
      ))}
    </div>
  );
};
