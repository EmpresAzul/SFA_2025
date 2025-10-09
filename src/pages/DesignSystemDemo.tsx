import React, { useState } from 'react';
import { 
  ResponsiveLayout, 
  ResponsiveGrid, 
  ResponsiveCard, 
  ResponsiveButton, 
  ResponsiveInput,
  ResponsiveTable 
} from '@/components/layout/ResponsiveLayout';
import { useResponsiveClasses, useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Palette, 
  Type, 
  Layout,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';

/**
 * Página de demonstração do Design System FluxoAzul
 * Mostra como todas as versões mantêm a identidade visual desktop
 */
export const DesignSystemDemo: React.FC = () => {
  const { getTextClass, isMobile, screenSize } = useResponsiveClasses();
  const { orientation, isPWA, isStandalone } = useResponsiveDesign();
  const [activeTab, setActiveTab] = useState('overview');

  const deviceInfo = {
    screenSize,
    isMobile,
    orientation,
    isPWA,
    isStandalone,
    viewport: `${window.innerWidth}x${window.innerHeight}`
  };

  const colorPalette = [
    { name: 'Primary', class: 'fluxo-brand-primary', hex: '#1e3a8a' },
    { name: 'Secondary', class: 'fluxo-brand-secondary', hex: '#0f172a' },
    { name: 'Accent', class: 'fluxo-brand-accent', hex: '#3b82f6' },
    { name: 'Success', class: 'bg-green-500', hex: '#10b981' },
    { name: 'Warning', class: 'bg-yellow-500', hex: '#f59e0b' },
    { name: 'Danger', class: 'bg-red-500', hex: '#ef4444' }
  ];

  const typographyExamples = [
    { class: 'fluxo-heading-xl', text: 'Heading XL - Títulos Principais', level: 'H1' },
    { class: 'fluxo-heading-lg', text: 'Heading LG - Seções Principais', level: 'H2' },
    { class: 'fluxo-heading-md', text: 'Heading MD - Subsections', level: 'H3' },
    { class: 'fluxo-heading-sm', text: 'Heading SM - Elementos Menores', level: 'H4' },
    { class: 'fluxo-body-lg', text: 'Body LG - Texto principal para leitura', level: 'P' },
    { class: 'fluxo-body-md', text: 'Body MD - Texto secundário e descrições', level: 'P' },
    { class: 'fluxo-body-sm', text: 'Body SM - Texto auxiliar e legendas', level: 'SMALL' }
  ];

  const componentExamples = [
    { 
      title: 'Métricas Dashboard',
      icon: BarChart3,
      value: 'R$ 125.430,00',
      change: '+12.5%',
      color: 'success'
    },
    {
      title: 'Vendas Mensais', 
      icon: TrendingUp,
      value: '1.234',
      change: '+8.2%',
      color: 'primary'
    },
    {
      title: 'Clientes Ativos',
      icon: Users, 
      value: '856',
      change: '+15.3%',
      color: 'warning'
    },
    {
      title: 'Receita Líquida',
      icon: DollarSign,
      value: 'R$ 89.250,00', 
      change: '+5.7%',
      color: 'info'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: Layout },
    { id: 'colors', label: 'Cores', icon: Palette },
    { id: 'typography', label: 'Tipografia', icon: Type },
    { id: 'components', label: 'Componentes', icon: Zap }
  ];

  return (
    <ResponsiveLayout spacing="lg">
      {/* Header com informações do dispositivo */}
      <ResponsiveCard variant="elevated">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className={getTextClass('xl')}>
              FluxoAzul Design System
            </h1>
            <p className={getTextClass('body-lg')}>
              Sistema unificado - Identidade visual consistente em todas as plataformas
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="fluxo-badge-primary flex items-center gap-1">
              {isMobile ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
              {screenSize}
            </span>
            <span className="fluxo-badge-secondary">
              {deviceInfo.viewport}
            </span>
            {isPWA && (
              <span className="fluxo-badge-success">
                PWA Ativo
              </span>
            )}
          </div>
        </div>
      </ResponsiveCard>

      {/* Navegação por abas */}
      <div className="fluxo-card">
        <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${activeTab === tab.id 
                  ? 'fluxo-brand-primary text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <tab.icon className="h-4 w-4" />
              <span className={isMobile ? 'hidden sm:inline' : ''}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          {/* Visão Geral */}
          {activeTab === 'overview' && (
            <div className="fluxo-spacing-lg">
              <h2 className={getTextClass('lg')}>Informações do Dispositivo</h2>
              
              <ResponsiveGrid columns={2} gap="md">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={getTextClass('body-md')}>Tamanho da Tela:</span>
                    <span className="fluxo-badge-primary">{screenSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={getTextClass('body-md')}>Orientação:</span>
                    <span className="fluxo-badge-secondary">{orientation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={getTextClass('body-md')}>Viewport:</span>
                    <span className={getTextClass('body-sm')}>{deviceInfo.viewport}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={getTextClass('body-md')}>PWA:</span>
                    <span className={isPWA ? 'fluxo-badge-success' : 'fluxo-badge-secondary'}>
                      {isPWA ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={getTextClass('body-md')}>Standalone:</span>
                    <span className={isStandalone ? 'fluxo-badge-success' : 'fluxo-badge-secondary'}>
                      {isStandalone ? 'Sim' : 'Não'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={getTextClass('body-md')}>Mobile:</span>
                    <span className={isMobile ? 'fluxo-badge-warning' : 'fluxo-badge-primary'}>
                      {isMobile ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </div>
              </ResponsiveGrid>
            </div>
          )}

          {/* Paleta de Cores */}
          {activeTab === 'colors' && (
            <div className="fluxo-spacing-lg">
              <h2 className={getTextClass('lg')}>Paleta de Cores FluxoAzul</h2>
              
              <ResponsiveGrid columns={3} gap="md">
                {colorPalette.map((color) => (
                  <div key={color.name} className="fluxo-card p-4">
                    <div className={`${color.class} h-16 rounded-lg mb-3`}></div>
                    <h3 className={getTextClass('md')}>{color.name}</h3>
                    <p className={getTextClass('body-sm')}>{color.hex}</p>
                  </div>
                ))}
              </ResponsiveGrid>

              <div className="mt-8">
                <h3 className={getTextClass('md')}>Gradientes da Marca</h3>
                <ResponsiveGrid columns={2} gap="md">
                  <div className="fluxo-brand-primary h-20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium">Primary Gradient</span>
                  </div>
                  <div className="fluxo-brand-secondary h-20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium">Secondary Gradient</span>
                  </div>
                </ResponsiveGrid>
              </div>
            </div>
          )}

          {/* Tipografia */}
          {activeTab === 'typography' && (
            <div className="fluxo-spacing-lg">
              <h2 className={getTextClass('lg')}>Hierarquia Tipográfica</h2>
              
              <div className="space-y-6">
                {typographyExamples.map((example, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <span className="fluxo-badge-primary text-xs">{example.level}</span>
                      <code className={getTextClass('body-sm')}>.{example.class}</code>
                    </div>
                    <div className={example.class}>{example.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Componentes */}
          {activeTab === 'components' && (
            <div className="fluxo-spacing-lg">
              <h2 className={getTextClass('lg')}>Componentes Unificados</h2>
              
              {/* Cards de Métricas */}
              <div>
                <h3 className={getTextClass('md')}>Cards de Métricas</h3>
                <ResponsiveGrid columns={4} gap="md">
                  {componentExamples.map((metric, index) => (
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
              </div>

              {/* Botões */}
              <div>
                <h3 className={getTextClass('md')}>Botões Responsivos</h3>
                <div className="flex flex-wrap gap-4">
                  <ResponsiveButton variant="primary" size="lg">
                    Botão Primário
                  </ResponsiveButton>
                  <ResponsiveButton variant="secondary" size="lg">
                    Botão Secundário
                  </ResponsiveButton>
                  <ResponsiveButton variant="ghost" size="lg">
                    Botão Ghost
                  </ResponsiveButton>
                </div>
              </div>

              {/* Formulário */}
              <div>
                <h3 className={getTextClass('md')}>Formulário Responsivo</h3>
                <ResponsiveGrid columns={2} gap="md">
                  <ResponsiveInput placeholder="Nome completo..." />
                  <ResponsiveInput placeholder="Email..." type="email" />
                  <ResponsiveInput placeholder="Telefone..." />
                  <ResponsiveInput placeholder="Valor..." />
                </ResponsiveGrid>
              </div>

              {/* Badges */}
              <div>
                <h3 className={getTextClass('md')}>Badges e Indicadores</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="fluxo-badge-primary">Primary</span>
                  <span className="fluxo-badge-success">Success</span>
                  <span className="fluxo-badge-warning">Warning</span>
                  <span className="fluxo-badge-danger">Danger</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rodapé com informações */}
      <ResponsiveCard>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className={getTextClass('md')}>Design System Ativo</span>
          </div>
          <p className={getTextClass('body-sm')}>
            Identidade visual FluxoAzul unificada em todas as plataformas
          </p>
        </div>
      </ResponsiveCard>
    </ResponsiveLayout>
  );
};

export default DesignSystemDemo;