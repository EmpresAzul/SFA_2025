
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, User, Building, Phone, Mail, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Cadastro } from '@/hooks/useCadastros';

interface CadastroViewModalProps {
  cadastro: Cadastro;
}

const CadastroViewModal: React.FC<CadastroViewModalProps> = ({ cadastro }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatSalary = (salary: number | null) => {
    if (!salary) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(salary);
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'cliente':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fornecedor':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'funcionario':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-blue-50"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg">
            <User className="h-5 w-5 mr-2 text-blue-600" />
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
              <Badge className={getTipoColor(cadastro.tipo)}>
                {cadastro.tipo.charAt(0).toUpperCase() + cadastro.tipo.slice(1)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Nome</p>
                <p className="text-gray-900">{cadastro.nome}</p>
              </div>
              {cadastro.cpf && (
                <div>
                  <p className="text-sm font-medium text-gray-600">CPF</p>
                  <p className="text-gray-900">{cadastro.cpf}</p>
                </div>
              )}
              {cadastro.cnpj && (
                <div>
                  <p className="text-sm font-medium text-gray-600">CNPJ</p>
                  <p className="text-gray-900">{cadastro.cnpj}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">Data de Cadastro</p>
                <p className="text-gray-900 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(cadastro.data)}
                </p>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Telefone</p>
                <p className="text-gray-900">{cadastro.telefone || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  E-mail
                </p>
                <p className="text-gray-900">{cadastro.email || 'Não informado'}</p>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Logradouro</p>
                <p className="text-gray-900">{cadastro.logradouro || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Número</p>
                <p className="text-gray-900">{cadastro.numero || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Complemento</p>
                <p className="text-gray-900">{cadastro.complemento || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Bairro</p>
                <p className="text-gray-900">{cadastro.bairro || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Cidade</p>
                <p className="text-gray-900">{cadastro.cidade || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Estado</p>
                <p className="text-gray-900">{cadastro.estado || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">CEP</p>
                <p className="text-gray-900">{cadastro.cep || 'Não informado'}</p>
              </div>
            </div>
          </div>

          {/* Informações Específicas por Tipo */}
          {cadastro.tipo === 'funcionario' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Informações Profissionais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cargo</p>
                  <p className="text-gray-900">{cadastro.cargo || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Salário</p>
                  <p className="text-gray-900">{formatSalary(cadastro.salario)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Observações */}
          {cadastro.observacoes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Observações</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{cadastro.observacoes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CadastroViewModal;
