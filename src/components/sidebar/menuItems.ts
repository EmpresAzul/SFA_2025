
import { 
  LayoutDashboard, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Package, 
  Users, 
  CreditCard, 
  Calendar, 
  Target,
  Calculator,
  Shield
} from 'lucide-react';
import type { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    description: 'Visão geral do negócio'
  },
  {
    id: 'lancamentos',
    label: 'Lançamentos',
    icon: TrendingUp,
    href: '/lancamentos',
    description: 'Gestão financeira'
  },
  {
    id: 'fluxo-caixa',
    label: 'Fluxo de Caixa',
    icon: DollarSign,
    href: '/fluxo-caixa',
    description: 'Controle de entradas e saídas'
  },
  {
    id: 'dre',
    label: 'DRE',
    icon: BarChart3,
    href: '/dre',
    description: 'Demonstrativo de resultado'
  },
  {
    id: 'precificacao',
    label: 'Precificação',
    icon: Calculator,
    href: '/precificacao',
    description: 'Cálculo de preços'
  },
  {
    id: 'estoque',
    label: 'Estoque',
    icon: Package,
    href: '/estoque',
    description: 'Controle de produtos'
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    icon: Users,
    href: '/cadastros',
    description: 'Clientes e fornecedores'
  },
  {
    id: 'saldos-bancarios',
    label: 'Saldos Bancários',
    icon: CreditCard,
    href: '/saldos-bancarios',
    description: 'Controle bancário'
  },
  {
    id: 'lembretes',
    label: 'Lembretes',
    icon: Calendar,
    href: '/lembretes',
    description: 'Agenda e notificações'
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: Target,
    href: '/pipeline',
    description: 'Funil de vendas'
  },
  {
    id: 'ponto-equilibrio',
    label: 'Ponto de Equilíbrio',
    icon: TrendingUp,
    href: '/ponto-equilibrio',
    description: 'Análise de viabilidade'
  },
  {
    id: 'security',
    label: 'Segurança',
    icon: Shield,
    href: '/security',
    description: 'Privacidade e logs'
  }
];
