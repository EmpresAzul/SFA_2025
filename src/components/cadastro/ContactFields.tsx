
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ContactFormData } from '@/types/contact';

interface ContactFieldsProps {
  formData: ContactFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
  onPhoneChange: (value: string) => void;
}

export const ContactFields: React.FC<ContactFieldsProps> = ({
  formData,
  setFormData,
  onPhoneChange
}) => {
  return (
    <>
      <div>
        <Label htmlFor="email" className="text-fluxo-blue-900 font-medium">
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@exemplo.com"
        />
      </div>
      
      <div>
        <Label htmlFor="telefone" className="text-fluxo-blue-900 font-medium">
          Telefone
        </Label>
        <Input
          id="telefone"
          value={formData.telefone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="(11) 99999-9999"
        />
      </div>
    </>
  );
};
