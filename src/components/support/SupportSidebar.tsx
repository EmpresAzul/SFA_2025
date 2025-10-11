import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, MessageCircle, Clock, Users } from "lucide-react";

interface SupportSidebarProps {
  onOpenWhatsApp: () => void;
}

const SupportSidebar: React.FC<SupportSidebarProps> = ({ onOpenWhatsApp }) => {
  return (
    <div className="w-full space-y-4">
      {/* Suporte Direto */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="text-base sm:text-lg font-semibold text-green-800 flex items-center gap-2 mb-4">
          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          Suporte Direto
        </div>
        <Button
          onClick={onOpenWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 mb-3 text-sm sm:text-base py-2 sm:py-3"
        >
          <Phone className="w-4 h-4 mr-2" />
          Suporte WhatsApp
        </Button>
        <p className="text-xs sm:text-sm text-green-700 text-center font-medium">
          Resposta em até 30 minutos
        </p>
      </div>

      {/* Informações de Contato */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="text-base sm:text-lg font-semibold flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          Informações de Contato
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-medium text-gray-600">E-mail</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-800 break-all">suporte@fluxoazul.com</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-medium text-gray-600">Localização</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-800">São Paulo | SP</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-medium text-gray-600">Horário</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-800">Seg-Sex: 8h às 18h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSidebar;
