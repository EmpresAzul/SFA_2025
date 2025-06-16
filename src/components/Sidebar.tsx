
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  DollarSign, 
  Tag, 
  Package, 
  MessageCircle, 
  User,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Banknote,
  Calendar,
  Users,
  UserCheck,
  Building2,
  UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './Logo';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  iconColor?: string;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'indicadores',
    label: 'Indicadores',
    icon: BarChart3,
    iconColor: 'text-blue-500',
    children: [
      { id: 'bancos', label: 'Bancos', icon: Banknote, iconColor: 'text-green-500', href: '/dashboard/saldos-bancarios' },
      { id: 'dre', label: 'DRE', icon: TrendingUp, iconColor: 'text-purple-500', href: '/dashboard/dre' },
      { id: 'fluxo-caixa', label: 'Fluxo de Caixa', icon: CreditCard, iconColor: 'text-orange-500', href: '/dashboard/fluxo-caixa' },
      { id: 'metricas', label: 'Métricas', icon: TrendingUp, iconColor: 'text-cyan-500', href: '/dashboard' }
    ]
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    icon: Users,
    iconColor: 'text-indigo-500',
    children: [
      { id: 'clientes', label: 'Clientes', icon: UserCheck, iconColor: 'text-blue-500', href: '/dashboard/cadastros/clientes' },
      { id: 'fornecedores', label: 'Fornecedores', icon: Building2, iconColor: 'text-green-500', href: '/dashboard/cadastros/fornecedores' },
      { id: 'funcionarios', label: 'Funcionários', icon: UserCog, iconColor: 'text-purple-500', href: '/dashboard/cadastros/funcionarios' }
    ]
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

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      // Se o item já está expandido, feche-o
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      // Caso contrário, feche todos os outros e abra apenas este
      return [itemId];
    });
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (item: MenuItem) => {
    if (item.href && isActive(item.href)) return true;
    return item.children?.some(child => child.href && isActive(child.href)) || false;
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const parentActive = isParentActive(item);

    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <button
            onClick={() => toggleExpanded(item.id)}
            className={cn(
              "w-full flex items-center px-3 py-2 text-left rounded-lg transition-all duration-300 group backdrop-blur-md border border-white/10",
              parentActive 
                ? "bg-gradient-to-r from-fluxo-blue-600/90 via-fluxo-blue-500/80 to-fluxo-blue-400/70 text-white shadow-lg shadow-fluxo-blue-500/25 border-fluxo-blue-300/30" 
                : "bg-gradient-to-r from-white/10 to-white/5 text-fluxo-black-700 hover:bg-gradient-to-r hover:from-fluxo-blue-50/80 hover:to-fluxo-blue-100/60 hover:text-fluxo-blue-700 hover:shadow-md hover:shadow-fluxo-blue-200/30",
              collapsed && "justify-center px-2"
            )}
          >
            <item.icon className={cn("flex-shrink-0", collapsed ? "w-4 h-4" : "w-4 h-4 mr-2", item.iconColor || "text-current")} />
            {!collapsed && (
              <>
                <span className="flex-1 font-medium text-sm">{item.label}</span>
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </>
            )}
          </button>

          {!collapsed && isExpanded && (
            <div className="ml-3 mt-1 space-y-0.5 animate-fade-in">
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    if (item.href) {
      return (
        <NavLink
          key={item.id}
          to={item.href}
          className={cn(
            "flex items-center px-3 py-2 rounded-lg transition-all duration-300 group mb-1 backdrop-blur-md border border-white/10",
            level > 0 && "ml-3",
            isActive(item.href) 
              ? "bg-gradient-to-r from-fluxo-blue-600/90 via-fluxo-blue-500/80 to-fluxo-blue-400/70 text-white shadow-lg shadow-fluxo-blue-500/25 border-fluxo-blue-300/30" 
              : "bg-gradient-to-r from-white/10 to-white/5 text-fluxo-black-700 hover:bg-gradient-to-r hover:from-fluxo-blue-50/80 hover:to-fluxo-blue-100/60 hover:text-fluxo-blue-700 hover:shadow-md hover:shadow-fluxo-blue-200/30",
            collapsed && "justify-center px-2"
          )}
        >
          <item.icon className={cn("flex-shrink-0", collapsed ? "w-4 h-4" : "w-4 h-4 mr-2", item.iconColor || "text-current")} />
          {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
        </NavLink>
      );
    }

    return (
      <div
        key={item.id}
        className={cn(
          "flex items-center px-3 py-2 rounded-lg transition-all duration-300 group mb-1 backdrop-blur-md border border-white/10",
          level > 0 && "ml-3",
          "bg-gradient-to-r from-white/10 to-white/5 text-fluxo-black-700 hover:bg-gradient-to-r hover:from-fluxo-blue-50/80 hover:to-fluxo-blue-100/60 hover:text-fluxo-blue-700 hover:shadow-md hover:shadow-fluxo-blue-200/30",
          collapsed && "justify-center px-2"
        )}
      >
        <item.icon className={cn("flex-shrink-0", collapsed ? "w-4 h-4" : "w-4 h-4 mr-2", item.iconColor || "text-current")} />
        {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
      </div>
    );
  };

  return (
    <div className={cn(
      "h-screen transition-all duration-300 flex flex-col relative overflow-hidden",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-fluxo-blue-50/40 via-white/30 to-fluxo-blue-100/20 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-fluxo-black-900/5 via-transparent to-fluxo-black-900/10"></div>
      
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-fluxo-blue-200/50 via-fluxo-blue-300/30 to-fluxo-blue-200/50"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="p-4 border-b border-white/20 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm">
          {collapsed ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-fluxo-blue-600 to-fluxo-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-fluxo-blue-500/30 border border-white/20">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          ) : (
            <Logo size="sm" />
          )}
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map(item => renderMenuItem(item))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
