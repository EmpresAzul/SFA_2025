
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Contact } from '@/types/contact';
import { Users, UserCheck, UserX, Building, Briefcase } from 'lucide-react';

interface ContactStatsCardsProps {
  contacts: Contact[];
}

export const ContactStatsCards: React.FC<ContactStatsCardsProps> = ({ contacts }) => {
  const stats = {
    // Funcionários
    activeEmployees: contacts.filter(c => (c.tipo === 'Funcionário' || c.tipo === 'Funcionario') && c.status === 'ativo').length,
    inactiveEmployees: contacts.filter(c => (c.tipo === 'Funcionário' || c.tipo === 'Funcionario') && c.status === 'inativo').length,
    
    // Clientes
    activeClients: contacts.filter(c => c.tipo === 'Cliente' && c.status === 'ativo').length,
    inactiveClients: contacts.filter(c => c.tipo === 'Cliente' && c.status === 'inativo').length,
    
    // Fornecedores
    activeSuppliers: contacts.filter(c => c.tipo === 'Fornecedor' && c.status === 'ativo').length,
    inactiveSuppliers: contacts.filter(c => c.tipo === 'Fornecedor' && c.status === 'inativo').length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {/* Funcionários Ativos */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Briefcase className="h-6 w-6 mr-2" />
            <UserCheck className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold">{stats.activeEmployees}</div>
          <div className="text-sm opacity-90">Funcionários Ativos</div>
        </CardContent>
      </Card>

      {/* Funcionários Inativos */}
      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Briefcase className="h-6 w-6 mr-2" />
            <UserX className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold">{stats.inactiveEmployees}</div>
          <div className="text-sm opacity-90">Funcionários Inativos</div>
        </CardContent>
      </Card>

      {/* Clientes Ativos */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-6 w-6 mr-2" />
            <UserCheck className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold">{stats.activeClients}</div>
          <div className="text-sm opacity-90">Clientes Ativos</div>
        </CardContent>
      </Card>

      {/* Clientes Inativos */}
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-6 w-6 mr-2" />
            <UserX className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold">{stats.inactiveClients}</div>
          <div className="text-sm opacity-90">Clientes Inativos</div>
        </CardContent>
      </Card>

      {/* Fornecedores Ativos */}
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Building className="h-6 w-6 mr-2" />
            <UserCheck className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold">{stats.activeSuppliers}</div>
          <div className="text-sm opacity-90">Fornecedores Ativos</div>
        </CardContent>
      </Card>

      {/* Fornecedores Inativos */}
      <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Building className="h-6 w-6 mr-2" />
            <UserX className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold">{stats.inactiveSuppliers}</div>
          <div className="text-sm opacity-90">Fornecedores Inativos</div>
        </CardContent>
      </Card>
    </div>
  );
};
