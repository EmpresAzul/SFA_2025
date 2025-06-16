
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cadastro } from '@/hooks/useCadastros';

interface CadastroSummaryCardsProps {
  cadastros: Cadastro[];
  icon: React.ComponentType<{ className?: string }>;
  tipo: string;
}

export const CadastroSummaryCards: React.FC<CadastroSummaryCardsProps> = ({
  cadastros,
  icon: Icon,
  tipo,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Icon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total de {tipo}</p>
              <p className="text-2xl font-bold text-blue-900">{cadastros.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
