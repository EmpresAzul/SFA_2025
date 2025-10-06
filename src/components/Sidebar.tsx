import React, { useState } from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarLogoutButton from "./sidebar/SidebarLogoutButton";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, isMobile = false, onMobileClose }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      // Se o item já está expandido, feche-o
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      // Caso contrário, feche todos os outros e abra apenas este
      return [itemId];
    });
  };

  return (
    <div
      className={cn(
        "h-screen transition-all duration-300 flex flex-col relative overflow-hidden",
        isMobile ? "w-64" : (collapsed ? "w-16" : "w-64"),
      )}
    >
      {/* Background com cores corrigidas para mobile */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-700/95 to-blue-800/90 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-blue-900/20"></div>

      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-blue-400/30 via-blue-500/20 to-blue-400/30"></div>

      <div className="relative z-10 h-full flex flex-col">
        <SidebarHeader collapsed={collapsed && !isMobile} isMobile={isMobile} />

        <SidebarNavigation
          collapsed={collapsed && !isMobile}
          expandedItems={expandedItems}
          onToggleExpanded={toggleExpanded}
          isMobile={isMobile}
          onMobileClose={onMobileClose}
        />

        {/* Botão Sair do Sistema - Canto Inferior Esquerdo */}
        <SidebarLogoutButton collapsed={collapsed && !isMobile} isMobile={isMobile} />
      </div>
    </div>
  );
};

export default Sidebar;
