
import { useAuth } from '@/contexts/AuthContext';
import { useCadastros } from '@/hooks/useCadastros';

export const useContactData = () => {
  const { user, session } = useAuth();
  const { useCadastrosQuery, useCreateCadastro, useDeleteCadastro } = useCadastros();

  console.log('useContactData - User:', user);
  console.log('useContactData - Session:', session);

  const { data: contacts = [], isLoading, refetch, error } = useCadastrosQuery();
  const createCadastroMutation = useCreateCadastro();
  const deleteCadastroMutation = useDeleteCadastro();

  console.log('useContactData - Contacts loaded:', contacts.length);
  console.log('useContactData - Loading state:', isLoading);
  console.log('useContactData - Error:', error);

  return {
    contacts,
    isLoading,
    refetch,
    createCadastroMutation,
    deleteCadastroMutation,
    session,
    error
  };
};
