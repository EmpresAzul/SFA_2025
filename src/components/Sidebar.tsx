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
      {/* Background premium com cor #0F2340 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F2340] via-[#1a3557] to-[#0F2340] backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-blue-600/10"></div>
      
      {/* Efeito de brilho sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent"></div>

      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-blue-400/40 via-blue-500/30 to-blue-400/40 shadow-[0_0_8px_rgba(59,130,246,0.3)]"></div>

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
