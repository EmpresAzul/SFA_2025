
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Eye, Edit, UserCheck, UserX, Trash2 } from 'lucide-react';
import { Contact } from '@/types/contact';
import { formatCurrency } from '@/utils/formatters';

interface ContactListProps {
  filteredContacts: Contact[];
  isLoading: boolean;
  viewingContact: Contact | null;
  handleView: (contact: Contact) => void;
  handleEdit: (contact: Contact) => void;
  handleToggleActive: (contact: Contact) => void;
  handleDelete: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  filteredContacts,
  isLoading,
  viewingContact,
  handleView,
  handleEdit,
  handleToggleActive,
  handleDelete
}) => {
  // Função para normalizar a exibição do tipo
  const displayTipo = (tipo: string) => {
    if (tipo === 'Funcionario') return 'Funcionário';
    return tipo;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardHeader>
        <CardTitle className="gradient-fluxo-text flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Lista de Cadastros ({filteredContacts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <p>Carregando cadastros...</p>
            </div>
          ) : filteredContacts.map((contact) => (
            <React.Fragment key={contact.id}>
              <div className={`border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${viewingContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge 
                        variant={contact.tipo === 'Cliente' ? 'default' : 
                                contact.tipo === 'Fornecedor' ? 'secondary' : 'outline'}
                        className="gradient-fluxo text-white"
                      >
                        {displayTipo(contact.tipo)}
                      </Badge>
                      <Badge 
                        variant={contact.pessoa === 'Física' ? 'default' : 'secondary'}
                        className="bg-blue-600"
                      >
                        {contact.pessoa}
                      </Badge>
                      <Badge 
                        variant={contact.status === 'ativo' ? 'default' : 'destructive'}
                        className={contact.status === 'ativo' ? 'bg-green-600' : ''}
                      >
                        {contact.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg text-gray-900">{contact.nome}</h3>
                    <p className="text-gray-600">{contact.documento}</p>
                    <p className="text-sm text-gray-500">
                      Data: {new Date(contact.data).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {contact.endereco && `${contact.endereco}${contact.numero ? `, ${contact.numero}` : ''}, ${contact.cidade}/${contact.estado}`}
                    </p>
                    {contact.email && (
                      <p className="text-sm text-gray-500">E-mail: {contact.email}</p>
                    )}
                    {contact.telefone && (
                      <p className="text-sm text-gray-500">Telefone: {contact.telefone}</p>
                    )}
                    {(contact.tipo === 'Funcionário' || contact.tipo === 'Funcionario') && contact.salario && (
                      <p className="text-sm text-gray-500">Salário: {formatCurrency(contact.salario)}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleView(contact)}
                      className="hover:bg-blue-50"
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(contact)}
                      className="hover:bg-green-50"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleToggleActive(contact)}
                      className={contact.status === 'ativo' ? 'hover:bg-orange-50' : 'hover:bg-green-50'}
                      title={contact.status === 'ativo' ? 'Desativar' : 'Ativar'}
                    >
                      {contact.status === 'ativo' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(contact)}
                      className="hover:bg-red-50 text-red-600"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {viewingContact?.id === contact.id && (
                <div className="ml-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Detalhes Completos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">ID:</span> {contact.id}</div>
                    <div><span className="font-medium">Data:</span> {new Date(contact.data).toLocaleDateString('pt-BR')}</div>
                    <div><span className="font-medium">Tipo:</span> {displayTipo(contact.tipo)}</div>
                    <div><span className="font-medium">Pessoa:</span> {contact.pessoa}</div>
                    <div><span className="font-medium">Documento:</span> {contact.documento}</div>
                    <div><span className="font-medium">Endereço completo:</span> {contact.endereco}{contact.numero ? `, ${contact.numero}` : ''}</div>
                    <div><span className="font-medium">Cidade/UF:</span> {contact.cidade}/{contact.estado}</div>
                    {contact.email && <div><span className="font-medium">E-mail:</span> {contact.email}</div>}
                    {contact.telefone && <div><span className="font-medium">Telefone:</span> {contact.telefone}</div>}
                    {(contact.tipo === 'Funcionário' || contact.tipo === 'Funcionario') && contact.salario && (
                      <div><span className="font-medium">Salário:</span> {formatCurrency(contact.salario)}</div>
                    )}
                    {contact.observacoes && <div className="col-span-2"><span className="font-medium">Observações:</span> {contact.observacoes}</div>}
                    {contact.anexo_url && <div><span className="font-medium">Anexo:</span> {contact.anexo_url}</div>}
                    <div><span className="font-medium">Status:</span> {contact.status}</div>
                    <div><span className="font-medium">Cadastrado em:</span> {new Date(contact.created_at).toLocaleDateString('pt-BR')}</div>
                    <div><span className="font-medium">Última atualização:</span> {new Date(contact.updated_at).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
          
          {!isLoading && filteredContacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>Nenhum cadastro encontrado</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
