import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Building,
  UserCog,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Clock,
} from "lucide-react";
import { Cadastro } from "@/hooks/useCadastros";

interface CadastroViewModalProps {
  cadastro: Cadastro;
  isOpen: boolean;
  onClose: () => void;
}

const CadastroViewModal: React.FC<CadastroViewModalProps> = ({ 
  cadastro, 
  isOpen, 
  onClose 
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSalary = (salary: number | null) => {
    if (!salary) return "Não informado";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(salary);
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Cliente":
        return <User className="h-5 w-5 text-blue-600" />;
      case "Fornecedor":
        return <Building className="h-5 w-5 text-green-600" />;
      case "Funcionário":
        return <UserCog className="h-5 w-5 text-purple-600" />;
      default:
        return <User className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTipoBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "Cliente":
        return "default";
      case "Fornecedor":
        return "secondary";
      case "Funcionário":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            {getTipoIcon(cadastro.tipo)}
            Detalhes do Cadastro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Building className="h-4 w-4 mr-1" />
                Informações Básicas
              </h3>
              <Badge variant={getTipoBadgeVariant(cadastro.tipo)}>
                {cadastro.tipo}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nome Completo
                </label>
                <p className="text-gray-900 font-medium">{cadastro.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tipo de Pessoa
                </label>
                <p className="text-gray-900">{cadastro.pessoa}</p>
              </div>
              {cadastro.cpf_cnpj && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {cadastro.pessoa === "Física" ? "CPF" : "CNPJ"}
                  </label>
                  <p className="text-gray-900 font-mono">{cadastro.cpf_cnpj}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Data de Cadastro
                </label>
                <p className="text-gray-900 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(cadastro.data)}
                </p>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              Informações de Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Telefone
                </label>
                <p className="text-gray-900 flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {cadastro.telefone || "Não informado"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  E-mail
                </label>
                <p className="text-gray-900 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {cadastro.email || "Não informado"}
                </p>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Endereço
                </label>
                <p className="text-gray-900 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {cadastro.endereco || "Não informado"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Número
                </label>
                <p className="text-gray-900">
                  {cadastro.numero || "Não informado"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Bairro
                </label>
                <p className="text-gray-900">
                  {cadastro.bairro || "Não informado"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Cidade
                </label>
                <p className="text-gray-900">
                  {cadastro.cidade || "Não informado"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Estado
                </label>
                <p className="text-gray-900">
                  {cadastro.estado || "Não informado"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  CEP
                </label>
                <p className="text-gray-900 font-mono">
                  {cadastro.cep || "Não informado"}
                </p>
              </div>
            </div>
          </div>

          {/* Informações Específicas por Tipo */}
          {cadastro.tipo === "Funcionário" && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Informações Profissionais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Salário
                  </label>
                  <p className="text-gray-900 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {formatSalary(cadastro.salario)}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Observações */}
          {cadastro.observacoes && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Observações
              </h3>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  {cadastro.observacoes}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CadastroViewModal;
