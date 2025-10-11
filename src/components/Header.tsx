import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 md:px-6 shadow-sm safe-area-inset">
      {/* Menu button - Touch friendly */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="hover:bg-blue-50 md:hidden touch-target min-w-[44px] min-h-[44px]"
        aria-label="Abrir menu"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </Button>

      {/* Logo mobile - Centered */}
      <div className="flex-1 md:hidden flex justify-center">
        <span className="text-base sm:text-lg font-bold text-blue-600 tracking-tight">
          FluxoAzul
        </span>
      </div>

      {/* Desktop spacer */}
      <div className="hidden md:flex flex-1"></div>

      {/* Empty space for balance on mobile */}
      <div className="md:hidden w-[44px]"></div>
    </header>
  );
};

export default Header;
