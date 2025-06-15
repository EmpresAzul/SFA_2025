
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
  Settings
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
      { id: 'dre', label: 'DRE', icon: TrendingUp, href: '/dashboard/dre' },
      { id: 'fluxo-caixa', label: 'Fluxo de Caixa', icon: CreditCard, href: '/dashboard/fluxo-caixa' }
    ]
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: DollarSign,
    children: [
      { id: 'lancamentos', label: 'Lançamentos', icon: CreditCard, href: '/dashboard/lancamentos' }
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
  const [expandedItems, setExpandedItems] = useState<string[]>(['indicadores']);
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
        <div key={item.id} className="mb-1">
          <button
            onClick={() => toggleExpanded(item.id)}
            className={cn(
              "w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group",
              parentActive 
                ? "gradient-fluxo text-white shadow-lg" 
                : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-fluxo-blue-700",
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
            <div className="ml-4 mt-1 space-y-1 animate-fade-in">
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    // For items with href, use NavLink
    if (item.href) {
      return (
        <NavLink
          key={item.id}
          to={item.href}
          className={cn(
            "flex items-center px-4 py-3 rounded-lg transition-all duration-200 group mb-1",
            level > 0 && "ml-4",
            isActive(item.href) 
              ? "gradient-fluxo text-white shadow-lg" 
              : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-fluxo-blue-700",
            collapsed && "justify-center px-2"
          )}
        >
          <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-5 h-5 mr-3")} />
          {!collapsed && <span className="font-medium">{item.label}</span>}
        </NavLink>
      );
    }

    // For items without href, use div
    return (
      <div
        key={item.id}
        className={cn(
          "flex items-center px-4 py-3 rounded-lg transition-all duration-200 group mb-1",
          level > 0 && "ml-4",
          "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-fluxo-blue-700",
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
      "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-lg",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 gradient-fluxo rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        ) : (
          <Logo size="sm" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
