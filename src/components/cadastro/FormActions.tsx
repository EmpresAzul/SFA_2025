
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isLoading: boolean;
  editingContact: any;
  onCancel: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({
  isLoading,
  editingContact,
  onCancel
}) => {
  return (
    <div className="flex space-x-4">
      <Button
        type="submit"
        disabled={isLoading}
        className="gradient-fluxo hover:gradient-fluxo-light text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isLoading ? 'Salvando...' : editingContact ? 'Atualizar' : 'Cadastrar'}
      </Button>
      
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="px-6"
      >
        Cancelar
      </Button>
    </div>
  );
};
