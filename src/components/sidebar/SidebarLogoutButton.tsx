import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SidebarLogoutButtonProps {
  collapsed: boolean;
  isMobile?: boolean;
}

const SidebarLogoutButton: React.FC<SidebarLogoutButtonProps> = ({ 
  collapsed, 
  isMobile = false 
}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-3 border-t border-white/10">
      <Button
        onClick={handleLogout}
        variant="ghost"
        className={cn(
          "w-full flex items-center transition-all duration-300 text-white/80 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20",
          collapsed && !isMobile ? "justify-center px-2 py-2" : "justify-start px-3 py-2"
        )}
      >
        <LogOut className={cn(
          "flex-shrink-0",
          collapsed && !isMobile ? "w-4 h-4" : "w-4 h-4 mr-2"
        )} />
        {(!collapsed || isMobile) && (
          <span className="font-medium text-sm">Sair do Sistema</span>
        )}
      </Button>
    </div>
  );
};

export default SidebarLogoutButton;