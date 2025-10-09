import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, MessageCircle, Clock, Users } from "lucide-react";

interface SupportSidebarProps {
  onOpenWhatsApp: () => void;
}

const SupportSidebar: React.FC<SupportSidebarProps> = ({ onOpenWhatsApp }) => {
  return (
    <div className="suporte-sidebar space-y-4">
      {/* Suporte Direto */}
      <div className="suporte-sidebar-section">
        <div className="suporte-sidebar-title text-green-800 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Suporte Direto
        </div>
        <Button
          onClick={onOpenWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 mb-2"
        >
          <Phone className="w-4 h-4 mr-2" />
          Suporte WhatsApp
        </Button>
        <p className="text-xs text-green-700 text-center">
          Resposta em até 30 minutos
        </p>
      </div>

      {/* Informações de Contato */}
      <div className="suporte-sidebar-section">
        <div className="suporte-sidebar-title flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Informações de Contato
        </div>
        <div className="space-y-3">
          <div className="suporte-contact-item">
            <div className="suporte-contact-icon">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="suporte-contact-info">
              <div className="suporte-contact-label">E-mail</div>
              <div className="suporte-contact-value">suporte@fluxoazul.com</div>
            </div>
          </div>

          <div className="suporte-contact-item">
            <div className="suporte-contact-icon">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <div className="suporte-contact-info">
              <div className="suporte-contact-label">Localização</div>
              <div className="suporte-contact-value">São Paulo | SP</div>
            </div>
          </div>

          <div className="suporte-contact-item">
            <div className="suporte-contact-icon">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div className="suporte-contact-info">
              <div className="suporte-contact-label">Horário</div>
              <div className="suporte-contact-value">Seg-Sex: 8h às 18h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSidebar;
