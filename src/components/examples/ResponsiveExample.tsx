import React from 'react';
import { 
  ResponsiveLayout, 
  ResponsiveGrid, 
  ResponsiveCard, 
  ResponsiveButton, 
  ResponsiveInput 
} from '@/components/layout/ResponsiveLayout';
import { useResponsiveClasses } from '@/hooks/useResponsiveDesign';
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';

/**
 * Componente de exemplo demonstrando o uso do sistema de design unificado
 * Mantém a identidade visual desktop em todas as plataformas
 */
export const ResponsiveExample: React.FC = () => {
  const { getTextClass, isMobile, screenSize } = useResponsiveClasses();

  const metrics = [
    {
      title: 'Receita Total',
      value: 'R$ 125.430,00',
      change: '+12.5%',
      icon: DollarSign,
      color: 'success'
    },
    {
      title: 'Vendas',
      value: '1.234',
      change: '+8.2%',
      icon: TrendingUp,
      color: 'primary'
    },
    {
      title: 'Clientes',
      value: '856',
      change: '+15.3%',
      icon: Users,
      color: 'warning'
    },
    {
      title: 'Produtos',
      value: '2.145',
      change: '+5.7%',
      icon: BarChart3,
      color: 'info'
    }
  ];

  return (
    <ResponsiveLayout spacing="lg">
      {/* Header Section */}
      <div className="fluxo-card-header">
        <h1 className={getTextClass('xl')}>
          Dashboard FluxoAzul
        </h1>
        <p className={getTextClass('body-lg')}>
          Visão geral do seu negócio - Design unificado em todas as plataformas
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="fluxo-badge-primary">
            Tela: {screenSize}
          </span>
          <span className="fluxo-badge-secondary">
            {isMobile ? 'Mobile' : 'Desktop'} Layout
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <ResponsiveGrid columns={4} gap="md">
        {metrics.map((metric, index) => (
          <ResponsiveCard key={index} variant="elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${getTextClass('body-sm')} text-gray-600 mb-1`}>
                  {metric.title}
                </p>
                <p className={`${getTextClass('lg')} font-bold`}>
                  {metric.value}
                </p>
                <p className={`${getTextClass('body-sm')} text-green-600 mt-1`}>
                  {metric.change}
                </p>
              </div>
              <div className="fluxo-brand-primary p-3 rounded-lg">
                <metric.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </ResponsiveCard>
        ))}
      </ResponsiveGrid>

      {/* Form Example */}
      <ResponsiveCard 
        variant="default"
        header={
          <h2 className={getTextClass('lg')}>
            Formulário Responsivo
          </h2>
        }
      >
        <ResponsiveGrid columns={2} gap="md">
          <div>
            <label className={`${getTextClass('body-md')} font-medium block mb-2`}>
              Nome do Cliente
            </label>
            <ResponsiveInput 
              placeholder="Digite o nome..."
              className="w-full"
            />
          </div>
          <div>
            <label className={`${getTextClass('body-md')} font-medium block mb-2`}>
              Email
            </label>
            <ResponsiveInput 
              type="email"
              placeholder="email@exemplo.com"
              className="w-full"
            />
          </div>
          <div>
            <label className={`${getTextClass('body-md')} font-medium block mb-2`}>
              Telefone
            </label>
            <ResponsiveInput 
              placeholder="(11) 99999-9999"
              className="w-full"
            />
          </div>
          <div>
            <label className={`${getTextClass('body-md')} font-medium block mb-2`}>
              Valor
            </label>
            <ResponsiveInput 
              placeholder="R$ 0,00"
              className="w-full"
            />
          </div>
        </ResponsiveGrid>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <ResponsiveButton variant="primary" size="md">
            Salvar Cliente
          </ResponsiveButton>
          <ResponsiveButton variant="secondary" size="md">
            Cancelar
          </ResponsiveButton>
          <ResponsiveButton variant="ghost" size="md">
            Limpar Formulário
          </ResponsiveButton>
        </div>
      </ResponsiveCard>

      {/* Table Example */}
      <ResponsiveCard
        header={
          <h2 className={getTextClass('lg')}>
            Tabela Responsiva
          </h2>
        }
      >
        <div className="fluxo-table-container mobile-table-scroll">
          <table className="fluxo-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Email</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item}>
                  <td>Cliente {item}</td>
                  <td>cliente{item}@email.com</td>
                  <td>R$ {(item * 1000).toLocaleString('pt-BR')},00</td>
                  <td>
                    <span className="fluxo-badge-success">
                      Ativo
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <ResponsiveButton variant="ghost" size="sm">
                        Editar
                      </ResponsiveButton>
                      <ResponsiveButton variant="ghost" size="sm">
                        Ver
                      </ResponsiveButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResponsiveCard>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <ResponsiveButton variant="primary" size="lg">
          Novo Lançamento
        </ResponsiveButton>
        <ResponsiveButton variant="secondary" size="lg">
          Relatórios
        </ResponsiveButton>
        <ResponsiveButton variant="ghost" size="lg">
          Configurações
        </ResponsiveButton>
      </div>
    </ResponsiveLayout>
  );
};