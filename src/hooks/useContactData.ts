
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';

export const useContactData = () => {
  const { user, session } = useAuth();
  const { useCadastros, useCreateCadastro, useDeleteCadastro } = useSupabaseQuery();

  console.log('useContactData - User:', user);
  console.log('useContactData - Session:', session);

  const { data: contacts = [], isLoading, refetch, error } = useCadastros();
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
