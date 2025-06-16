
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarNavigation from './sidebar/SidebarNavigation';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
        <SidebarHeader collapsed={collapsed} />
        
        <SidebarNavigation
          collapsed={collapsed}
          expandedItems={expandedItems}
          onToggleExpanded={toggleExpanded}
        />
      </div>
    </div>
  );
};

export default Sidebar;
