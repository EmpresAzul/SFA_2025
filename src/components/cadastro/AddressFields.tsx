
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ContactFormData } from '@/types/contact';

interface AddressFieldsProps {
  formData: ContactFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
}

export const AddressFields: React.FC<AddressFieldsProps> = ({
  formData,
  setFormData
}) => {
  return (
    <>
      <div>
        <Label htmlFor="endereco" className="text-fluxo-blue-900 font-medium">
          Endereço
        </Label>
        <Input
          id="endereco"
          value={formData.endereco}
          onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
          placeholder="Rua, Avenida..."
        />
      </div>

      <div>
        <Label htmlFor="numero" className="text-fluxo-blue-900 font-medium">
          Número
        </Label>
        <Input
          id="numero"
          value={formData.numero}
          onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
          placeholder="123"
        />
      </div>
      
      <div>
        <Label htmlFor="cidade" className="text-fluxo-blue-900 font-medium">
          Cidade
        </Label>
        <Input
          id="cidade"
          value={formData.cidade}
          onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
          placeholder="São Paulo"
        />
      </div>
      
      <div>
        <Label htmlFor="estado" className="text-fluxo-blue-900 font-medium">
          UF
        </Label>
        <Input
          id="estado"
          value={formData.estado}
          onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
          placeholder="SP"
          maxLength={2}
        />
      </div>
    </>
  );
};
