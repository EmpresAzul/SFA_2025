import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CadastroHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onNewClick: () => void;
}

export const CadastroHeader: React.FC<CadastroHeaderProps> = ({
  icon: Icon,
  title,
  description,
  onNewClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        <p className="text-gray-600 mt-2 text-sm">{description}</p>
      </div>
      <Button
        onClick={onNewClick}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Novo {title.replace("s", "")}
      </Button>
    </div>
  );
};
