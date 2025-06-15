
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  DollarSign, 
  Tag, 
  Users, 
  Package, 
  MessageCircle, 
  User,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  CreditCard,
  ShoppingCart,
  Settings,
  Banknote,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './Logo';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'indicadores',
    label: 'Indicadores',
    icon: BarChart3,
    children: [
      { id: 'dashboard-financeiro', label: 'Dashboard Financeiro', icon: TrendingUp, href: '/dashboard' },
      { id: 'dre', label: 'DRE', icon: TrendingUp, href: '/dashboard/dre' },
      { id: 'fluxo-caixa', label: 'Fluxo de Caixa', icon: CreditCard, href: '/dashboard/fluxo-caixa' }
    ]
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: DollarSign,
    children: [
      { id: 'lancamentos', label: 'Lançamentos', icon: CreditCard, href: '/dashboard/lancamentos' },
      { id: 'saldos-bancarios', label: 'Saldos Bancários', icon: Banknote, href: '/dashboard/saldos-bancarios' }
    ]
  },
  {
    id: 'precificacao',
    label: 'Precificação',
    icon: Tag,
    children: [
      { id: 'produtos-servicos', label: 'Produtos e Serviços', icon: ShoppingCart, href: '/dashboard/produtos-servicos' }
    ]
  },
  {
    id: 'cadastro',
    label: 'Cadastro',
    icon: Users,
    href: '/dashboard/cadastro'
  },
  {
    id: 'estoque',
    label: 'Estoque',
    icon: Package,
    href: '/dashboard/estoque'
  },
  {
    id: 'consultor-virtual',
    label: 'Consultor Virtual',
    icon: MessageCircle,
    href: '/dashboard/consultor-virtual'
  },
  {
    id: 'perfil',
    label: 'Perfil',
    icon: User,
    href: '/dashboard/perfil'
  }
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['indicadores', 'financeiro']);
  const location = useLocation();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
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
        <div key={item.id} className="mb-2">
          <button
            onClick={() => toggleExpanded(item.id)}
            className={cn(
              "w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 group backdrop-blur-md border border-white/10",
              parentActive 
                ? "bg-gradient-to-r from-fluxo-blue-600/90 via-fluxo-blue-500/80 to-fluxo-blue-400/70 text-white shadow-lg shadow-fluxo-blue-500/25 border-fluxo-blue-300/30" 
                : "bg-gradient-to-r from-white/10 to-white/5 text-fluxo-black-700 hover:bg-gradient-to-r hover:from-fluxo-blue-50/80 hover:to-fluxo-blue-100/60 hover:text-fluxo-blue-700 hover:shadow-md hover:shadow-fluxo-blue-200/30",
              collapsed && "justify-center px-2"
            )}
          >
            <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-5 h-5 mr-3")} />
            {!collapsed && (
              <>
                <span className="flex-1 font-medium">{item.label}</span>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </>
            )}
          </button>

          {!collapsed && isExpanded && (
            <div className="ml-4 mt-2 space-y-1 animate-fade-in">
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
            "flex items-center px-4 py-3 rounded-xl transition-all duration-300 group mb-2 backdrop-blur-md border border-white/10",
            level > 0 && "ml-4",
            isActive(item.href) 
              ? "bg-gradient-to-r from-fluxo-blue-600/90 via-fluxo-blue-500/80 to-fluxo-blue-400/70 text-white shadow-lg shadow-fluxo-blue-500/25 border-fluxo-blue-300/30" 
              : "bg-gradient-to-r from-white/10 to-white/5 text-fluxo-black-700 hover:bg-gradient-to-r hover:from-fluxo-blue-50/80 hover:to-fluxo-blue-100/60 hover:text-fluxo-blue-700 hover:shadow-md hover:shadow-fluxo-blue-200/30",
            collapsed && "justify-center px-2"
          )}
        >
          <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-5 h-5 mr-3")} />
          {!collapsed && <span className="font-medium">{item.label}</span>}
        </NavLink>
      );
    }

    return (
      <div
        key={item.id}
        className={cn(
          "flex items-center px-4 py-3 rounded-xl transition-all duration-300 group mb-2 backdrop-blur-md border border-white/10",
          level > 0 && "ml-4",
          "bg-gradient-to-r from-white/10 to-white/5 text-fluxo-black-700 hover:bg-gradient-to-r hover:from-fluxo-blue-50/80 hover:to-fluxo-blue-100/60 hover:text-fluxo-blue-700 hover:shadow-md hover:shadow-fluxo-blue-200/30",
          collapsed && "justify-center px-2"
        )}
      >
        <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-5 h-5 mr-3")} />
        {!collapsed && <span className="font-medium">{item.label}</span>}
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

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map(item => renderMenuItem(item))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
