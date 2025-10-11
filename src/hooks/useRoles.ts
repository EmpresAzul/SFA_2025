import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type AppRole = 'admin' | 'moderator' | 'user';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export const useUserRoles = (userId?: string) => {
  return useQuery({
    queryKey: ['user-roles', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId || '');
      
      if (error) throw error;
      return data as UserRole[];
    },
    enabled: !!userId,
  });
};

export const useIsAdmin = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });
      
      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      
      return data as boolean;
    },
    enabled: !!user?.id,
  });
};

export const useCurrentUserRole = () => {
  const { user } = useAuth();
  const { data: roles } = useUserRoles(user?.id);
  
  if (!roles || roles.length === 0) return 'user';
  
  // Return highest priority role
  if (roles.some(r => r.role === 'admin')) return 'admin';
  if (roles.some(r => r.role === 'moderator')) return 'moderator';
  return 'user';
};

export const useAddRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-roles', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['is-admin', variables.userId] });
      toast({
        title: 'Role adicionada',
        description: 'A role foi adicionada com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao adicionar role',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useRemoveRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-roles', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['is-admin', variables.userId] });
      toast({
        title: 'Role removida',
        description: 'A role foi removida com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao remover role',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
