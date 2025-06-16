
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { Contact } from '@/types/contact';

export const useContactData = () => {
  const { user, session } = useAuth();
  const { useCadastros, useCreateCadastro, useDeleteCadastro } = useSupabaseQuery();

  console.log('useContactData - User:', user);
  console.log('useContactData - Session:', session);

  const { data: contacts = [], isLoading, refetch } = useCadastros();
  const createCadastroMutation = useCreateCadastro();
  const deleteCadastroMutation = useDeleteCadastro();

  return {
    contacts,
    isLoading,
    refetch,
    createCadastroMutation,
    deleteCadastroMutation,
    session
  };
};
