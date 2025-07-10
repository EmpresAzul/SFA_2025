import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building, UserCheck } from "lucide-react";

interface CadastrosStatsProps {
  stats: {
    total: number;
    clientes: number;
    fornecedores: number;
    funcionarios: number;
    ativos: number;
  };
}

const CadastrosStats: React.FC<CadastrosStatsProps> = ({ stats }) => {
  return (
    <div className="responsive-grid mb-6">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-colorful">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white/90" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-white/90">
                Total de Cadastros
              </p>
              <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-colorful">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center">
            <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-white/90" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-white/90">
                Clientes
              </p>
              <p className="text-xl sm:text-2xl font-bold">{stats.clientes}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-colorful">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center">
            <Building className="h-6 w-6 sm:h-8 sm:w-8 text-white/90" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-white/90">
                Fornecedores
              </p>
              <p className="text-xl sm:text-2xl font-bold">
                {stats.fornecedores}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-colorful">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white/90" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm font-medium text-white/90">
                Funcionários
              </p>
              <p className="text-xl sm:text-2xl font-bold">
                {stats.funcionarios}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastrosStats;
