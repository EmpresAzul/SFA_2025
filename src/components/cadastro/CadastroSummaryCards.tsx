
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Building2 } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Icon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-2xl font-bold text-blue-900">{cadastros.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Pessoa Física</p>
              <p className="text-2xl font-bold text-green-900">
                {cadastros.filter(c => c.pessoa === 'Física').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Pessoa Jurídica</p>
              <p className="text-2xl font-bold text-purple-900">
                {cadastros.filter(c => c.pessoa === 'Jurídica').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
