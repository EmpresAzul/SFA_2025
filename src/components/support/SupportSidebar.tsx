import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";

interface SupportSidebarProps {
  onOpenWhatsApp: () => void;
}

const SupportSidebar: React.FC<SupportSidebarProps> = ({ onOpenWhatsApp }) => {
  return (
    <div className="space-y-6">
      {/* Suporte WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle>Suporte Direto</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onOpenWhatsApp}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            <Phone className="w-4 h-4 mr-2" />
            Suporte WhatsApp
          </Button>
        </CardContent>
      </Card>

      {/* Informações de Contato */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium">E-mail</p>
              <p className="text-sm text-gray-600">suporte@fluxoazul.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium">Localização</p>
              <p className="text-sm text-gray-600">São Paulo | SP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dicas Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Dicas Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Use o chat para dúvidas sobre o sistema</p>
            <p>• WhatsApp para suporte urgente</p>
            <p>• E-mail para solicitações detalhadas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportSidebar;
