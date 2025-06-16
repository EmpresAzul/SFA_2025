
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContactFormData } from '@/types/contact';

interface BasicInfoFieldsProps {
  formData: ContactFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
  tipoOptions: Array<{ value: string; label: string }>;
  hideTypeField?: boolean;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  formData,
  setFormData,
  tipoOptions,
  hideTypeField = false
}) => {
  const handlePessoaChange = (value: string) => {
    // Garantir que sempre seja salvo sem acentos
    let normalizedValue = value;
    if (value === 'Física' || value === 'física') {
      normalizedValue = 'Fisica';
    } else if (value === 'Jurídica' || value === 'jurídica') {
      normalizedValue = 'Juridica';
    }
    
    console.log('BasicInfoFields - Pessoa changed from', value, 'to', normalizedValue);
    
    setFormData({ 
      ...formData, 
      pessoa: normalizedValue, 
      documento: '' // Limpar documento ao trocar tipo de pessoa
    });
  };

  return (
    <>
      <div>
        <Label htmlFor="data" className="text-fluxo-blue-900 font-medium">
          Data *
        </Label>
        <Input
          id="data"
          type="date"
          value={formData.data}
          onChange={(e) => setFormData({ ...formData, data: e.target.value })}
          required
        />
      </div>

      {!hideTypeField && (
        <div>
          <Label className="text-fluxo-blue-900 font-medium">Tipo *</Label>
          <Select 
            value={formData.tipo} 
            onValueChange={(value) => setFormData({ ...formData, tipo: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tipoOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label className="text-fluxo-blue-900 font-medium">Pessoa *</Label>
        <Select 
          value={formData.pessoa} 
          onValueChange={handlePessoaChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fisica">Física</SelectItem>
            <SelectItem value="Juridica">Jurídica</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="nome" className="text-fluxo-blue-900 font-medium">
          Nome *
        </Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          placeholder="Nome completo"
          required
        />
      </div>
    </>
  );
};
