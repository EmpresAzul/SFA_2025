
import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserCheck, Truck, BadgeDollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NovosCadastros: React.FC = () => {
  const cadastroOptions = [
    {
      title: 'Novo Cliente',
      description: 'Cadastre um novo cliente no sistema',
      icon: UserCheck,
      href: '/dashboard/novos-cadastros/clientes',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Novo Fornecedor',
      description: 'Cadastre um novo fornecedor no sistema',
      icon: Truck,
      href: '/dashboard/novos-cadastros/fornecedores',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Novo Funcionário',
      description: 'Cadastre um novo funcionário no sistema',
      icon: BadgeDollarSign,
      href: '/dashboard/novos-cadastros/funcionarios',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-fluxo-text mb-2">
          Novos Cadastros
        </h1>
        <p className="text-gray-600">
          Escolha o tipo de cadastro que deseja realizar
        </p>
      </div>

      {/* Grid de opções */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cadastroOptions.map((option) => (
          <NavLink
            key={option.title}
            to={option.href}
            className="group"
          >
            <Card className={`${option.borderColor} ${option.bgColor} hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto w-16 h-16 ${option.bgColor} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <option.icon className={`w-8 h-8 ${option.color}`} />
                </div>
                <CardTitle className={`text-xl ${option.color} group-hover:text-opacity-80`}>
                  {option.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  {option.description}
                </CardDescription>
              </CardContent>
            </Card>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default NovosCadastros;
