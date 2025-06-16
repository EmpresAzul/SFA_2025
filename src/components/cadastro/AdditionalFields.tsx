
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

      <div>
        <Label htmlFor="anexo" className="text-fluxo-blue-900 font-medium">
          Anexo
        </Label>
        <Input
          id="anexo"
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 200 * 1024 * 1024) {
                alert('Arquivo muito grande. O limite é 200MB.');
                return;
              }
              setFormData({ ...formData, anexo_url: file.name });
            }
          }}
          accept="*/*"
        />
        <p className="text-xs text-gray-500 mt-1">Máximo 200MB</p>
      </div>
    </div>
  );
};
