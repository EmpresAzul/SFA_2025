
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactFormData } from '@/types/contact';
import { BasicInfoFields } from './BasicInfoFields';
import { DocumentInput } from './DocumentInput';
import { AddressFields } from './AddressFields';
import { ContactFields } from './ContactFields';
import { SalaryField } from './SalaryField';
import { AdditionalFields } from './AdditionalFields';
import { FormActions } from './FormActions';

interface ContactEnhancedFormProps {
  formData: ContactFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
  editingContact: any;
  formatDocument: (value: string, pessoa: string) => string;
  formatTelefone: (value: string) => string;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  isLoading: boolean;
  fixedType?: string;
}

export const ContactEnhancedForm: React.FC<ContactEnhancedFormProps> = ({
  formData,
  setFormData,
  editingContact,
  formatDocument,
  formatTelefone,
  handleSubmit,
  resetForm,
  isLoading,
  fixedType
}) => {
  const handleDocumentChange = (value: string) => {
    const formatted = formatDocument(value, formData.pessoa);
    setFormData({ ...formData, documento: formatted });
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatTelefone(value);
    setFormData({ ...formData, telefone: formatted });
  };

  const handleSalaryChange = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    setFormData({ ...formData, salario: numericValue });
  };

  const tipoOptions = fixedType 
    ? [{ value: fixedType, label: fixedType }]
    : [
        { value: 'Cliente', label: 'Cliente' },
        { value: 'Fornecedor', label: 'Fornecedor' },
        { value: 'Funcionário', label: 'Funcionário' }
      ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardHeader>
        <CardTitle className="gradient-fluxo-text">
          {editingContact ? 'Editar Cadastro' : `Novo ${fixedType || 'Cadastro'}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <BasicInfoFields
              formData={formData}
              setFormData={setFormData}
              tipoOptions={tipoOptions}
              hideTypeField={!!fixedType}
            />
            
            <DocumentInput
              pessoa={formData.pessoa}
              documento={formData.documento}
              onDocumentChange={handleDocumentChange}
            />

            <AddressFields
              formData={formData}
              setFormData={setFormData}
            />

            <ContactFields
              formData={formData}
              setFormData={setFormData}
              onPhoneChange={handlePhoneChange}
            />

            <SalaryField
              salario={formData.salario}
              onSalaryChange={handleSalaryChange}
              showSalary={formData.tipo === 'Funcionário' || fixedType === 'Funcionário'}
            />
          </div>

          <AdditionalFields
            formData={formData}
            setFormData={setFormData}
          />
          
          <FormActions
            isLoading={isLoading}
            editingContact={editingContact}
            onCancel={resetForm}
          />
        </form>
      </CardContent>
    </Card>
  );
};
