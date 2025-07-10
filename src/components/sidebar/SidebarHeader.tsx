import React from "react";
import Logo from "../Logo";

interface SidebarHeaderProps {
  collapsed: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed }) => {
  return (
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
  );
};

export default SidebarHeader;
