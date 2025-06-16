
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MenuItem } from './types';

interface SidebarMenuItemProps {
  item: MenuItem;
  level?: number;
  collapsed: boolean;
  expandedItems: string[];
  onToggleExpanded: (itemId: string) => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  level = 0,
  collapsed,
  expandedItems,
  onToggleExpanded
}) => {
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;
  
  const isParentActive = (menuItem: MenuItem): boolean => {
    if (menuItem.href && isActive(menuItem.href)) return true;
    return menuItem.children?.some(child => child.href && isActive(child.href)) || false;
  };

  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.includes(item.id);
  const parentActive = isParentActive(item);

  if (hasChildren) {
    return (
      <div className="mb-1">
        <button
          onClick={() => onToggleExpanded(item.id)}
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
            {item.children?.map(child => (
              <SidebarMenuItem
                key={child.id}
                item={child}
                level={level + 1}
                collapsed={collapsed}
                expandedItems={expandedItems}
                onToggleExpanded={onToggleExpanded}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.href) {
    return (
      <NavLink
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

export default SidebarMenuItem;
