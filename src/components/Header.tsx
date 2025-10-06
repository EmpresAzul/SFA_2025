import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="hover:bg-blue-50 md:hidden"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </Button>

      {/* Logo ou título no mobile */}
      <div className="flex-1 md:hidden flex justify-center">
        <span className="text-lg font-bold text-blue-600">FluxoAzul</span>
      </div>

      {/* Espaço vazio para desktop */}
      <div className="hidden md:flex flex-1"></div>
    </header>
  );
};

export default Header;
