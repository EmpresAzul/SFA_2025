
import { 
  BarChart3, 
  DollarSign, 
  Tag, 
  Package, 
  MessageCircle, 
  User,
  TrendingUp,
  CreditCard,
  Banknote,
  Users,
  Bell,
  Target,
  Calculator
} from 'lucide-react';
import type { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  {
    id: 'indicadores',
    label: 'Indicadores',
    icon: BarChart3,
    iconColor: 'text-blue-500',
    children: [
      { id: 'bancos', label: 'Bancos', icon: Banknote, iconColor: 'text-green-500', href: '/dashboard/saldos-bancarios' },
      { id: 'dre', label: 'DRE', icon: TrendingUp, iconColor: 'text-purple-500', href: '/dashboard/dre' },
      { id: 'fluxo-caixa', label: 'Fluxo de Caixa', icon: CreditCard, iconColor: 'text-orange-500', href: '/dashboard/fluxo-caixa' },
      { id: 'ponto-equilibrio', label: 'Ponto de Equilíbrio', icon: Calculator, iconColor: 'text-red-500', href: '/dashboard/ponto-equilibrio' },
      { id: 'metricas', label: 'Métricas', icon: TrendingUp, iconColor: 'text-cyan-500', href: '/dashboard' }
    ]
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    icon: Users,
    iconColor: 'text-indigo-500',
    href: '/dashboard/cadastros'
  },
  {
    id: 'precificacao',
    label: 'Precificação',
    icon: Tag,
    iconColor: 'text-pink-500',
    href: '/dashboard/precificacao'
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: DollarSign,
    iconColor: 'text-emerald-500',
    children: [
      { id: 'lancamentos', label: 'Lançamentos', icon: CreditCard, iconColor: 'text-indigo-500', href: '/dashboard/lancamentos' }
    ]
  },
  {
    id: 'estoque',
    label: 'Estoque',
    icon: Package,
    iconColor: 'text-amber-500',
    href: '/dashboard/estoque'
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: Target,
    iconColor: 'text-violet-500',
    href: '/dashboard/pipeline'
  },
  {
    id: 'lembretes',
    label: 'Lembretes',
    icon: Bell,
    iconColor: 'text-cyan-500',
    href: '/dashboard/lembretes'
  },
  {
    id: 'consultor-virtual',
    label: 'Consultor Virtual',
    icon: MessageCircle,
    iconColor: 'text-teal-500',
    href: '/dashboard/consultor-virtual'
  },
  {
    id: 'perfil',
    label: 'Perfil',
    icon: User,
    iconColor: 'text-rose-500',
    href: '/dashboard/perfil'
  }
];
