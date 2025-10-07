import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, MessageCircle, Clock, Users } from "lucide-react";

interface SupportSidebarProps {
  onOpenWhatsApp: () => void;
}

const SupportSidebar: React.FC<SupportSidebarProps> = ({ onOpenWhatsApp }) => {
  return (
    <div className="space-y-4">
      {/* Suporte Direto */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-800 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Suporte Direto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onOpenWhatsApp}
            className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Phone className="w-4 h-4 mr-2" />
            Suporte WhatsApp
          </Button>
          <p className="text-xs text-green-700 mt-2 text-center">
            Resposta em até 30 minutos
          </p>
        </CardContent>
      </Card>

      {/* Informações de Contato */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">E-mail</p>
              <p className="text-sm text-blue-600">suporte@fluxoazul.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg bg-red-50">
            <MapPin className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Localização</p>
              <p className="text-sm text-red-600">São Paulo | SP</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg bg-purple-50">
            <Clock className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-purple-800">Horário</p>
              <p className="text-sm text-purple-600">Seg-Sex: 8h às 18h</p>
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  );
};

export default SupportSidebar;
