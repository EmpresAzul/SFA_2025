
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Contact, ContactStats } from '@/types/contact';

interface ContactStatsProps {
  contacts: Contact[];
}

export const ContactStatsComponent: React.FC<ContactStatsProps> = ({ contacts }) => {
  const stats: ContactStats = {
    activeClients: contacts.filter(c => c.tipo === 'Cliente' && c.status === 'ativo').length,
    inactiveClients: contacts.filter(c => c.tipo === 'Cliente' && c.status === 'inativo').length,
    activeSuppliers: contacts.filter(c => c.tipo === 'Fornecedor' && c.status === 'ativo').length,
    inactiveSuppliers: contacts.filter(c => c.tipo === 'Fornecedor' && c.status === 'inativo').length,
    activeEmployees: contacts.filter(c => c.tipo === 'Funcionário' && c.status === 'ativo').length,
    inactiveEmployees: contacts.filter(c => c.tipo === 'Funcionário' && c.status === 'inativo').length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardContent className="p-3 text-center">
          <div className="text-lg font-bold text-green-600">{stats.activeClients}</div>
          <div className="text-xs text-gray-600">Clientes Ativos</div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardContent className="p-3 text-center">
          <div className="text-lg font-bold text-red-600">{stats.inactiveClients}</div>
          <div className="text-xs text-gray-600">Clientes Inativos</div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardContent className="p-3 text-center">
          <div className="text-lg font-bold text-green-600">{stats.activeSuppliers}</div>
          <div className="text-xs text-gray-600">Fornecedores Ativos</div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardContent className="p-3 text-center">
          <div className="text-lg font-bold text-red-600">{stats.inactiveSuppliers}</div>
          <div className="text-xs text-gray-600">Fornecedores Inativos</div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardContent className="p-3 text-center">
          <div className="text-lg font-bold text-green-600">{stats.activeEmployees}</div>
          <div className="text-xs text-gray-600">Funcionários Ativos</div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardContent className="p-3 text-center">
          <div className="text-lg font-bold text-red-600">{stats.inactiveEmployees}</div>
          <div className="text-xs text-gray-600">Funcionários Inativos</div>
        </CardContent>
      </Card>
    </div>
  );
};
