
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DocumentInputProps {
  pessoa: string;
  documento: string;
  onDocumentChange: (value: string) => void;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({
  pessoa,
  documento,
  onDocumentChange
}) => {
  return (
    <div>
      <Label htmlFor="documento" className="text-fluxo-blue-900 font-medium">
        {pessoa === 'Fisica' ? 'CPF' : 'CNPJ'}
      </Label>
      <Input
        id="documento"
        value={documento}
        onChange={(e) => onDocumentChange(e.target.value)}
        placeholder={pessoa === 'Fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
        required
      />
    </div>
  );
};
