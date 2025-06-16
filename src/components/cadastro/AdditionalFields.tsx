
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ContactFormData } from '@/types/contact';

interface AdditionalFieldsProps {
  formData: ContactFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
}

export const AdditionalFields: React.FC<AdditionalFieldsProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Label htmlFor="observacoes" className="text-fluxo-blue-900 font-medium">
          Observações
        </Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
          placeholder="Observações adicionais..."
          rows={3}
        />
      </div>
    </div>
  );
};
