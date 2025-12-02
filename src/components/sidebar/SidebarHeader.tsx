import React from "react";

interface SidebarHeaderProps {
  collapsed: boolean;
  isMobile?: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed, isMobile = false }) => {
  return (
    <div className="p-4 border-b border-white/20 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm">
      {collapsed && !isMobile ? (
        <div className="flex justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-blue-500/30 rounded-xl flex items-center justify-center shadow-lg border border-white/30">
            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>FA</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <span className="text-white">FLUXO</span>
              <span style={{ color: '#3676DC' }}>AZUL</span>
            </h1>
            <p className="text-white/60 text-xs mt-0.5 font-medium">Gestão Financeira</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
