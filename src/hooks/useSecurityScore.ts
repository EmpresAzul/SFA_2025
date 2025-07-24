import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSecurityScore = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['security-score', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('calculate_user_security_score', {
        user_uuid: user.id
      });

      if (error) throw error;
      return data as number;
    },
    enabled: !!user?.id,
    refetchInterval: 60000, // Refetch every minute
  });
};