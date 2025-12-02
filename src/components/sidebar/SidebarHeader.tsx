import React from "react";
import Logo from "../Logo";

interface SidebarHeaderProps {
  collapsed: boolean;
  isMobile?: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed, isMobile = false }) => {
  return (
    <div className="p-4 border-b border-white/20 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm">
      {collapsed && !isMobile ? (
        <div className="flex justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center shadow-lg border border-white/20">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="text-white font-bold text-lg uppercase tracking-wide">
            FLUXOAZUL
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
