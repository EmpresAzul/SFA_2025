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
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 text-fluxo-blue-600" />
          <h1 className="text-3xl font-bold text-fluxo-black-900">{title}</h1>
        </div>
        <p className="text-fluxo-black-600 mt-2">{description}</p>
      </div>
      <Button
        onClick={onNewClick}
        className="bg-gradient-to-r from-fluxo-blue-600 to-fluxo-blue-500 hover:from-fluxo-blue-700 hover:to-fluxo-blue-600 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        {title.replace("s", "")}
      </Button>
    </div>
  );
};
