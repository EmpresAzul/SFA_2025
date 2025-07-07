import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SystemVideo {
  id: string;
  title: string;
  youtube_url: string;
  description?: string;
  order_position: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useSystemVideos = () => {
  return useQuery({
    queryKey: ['system-videos'],
    queryFn: async (): Promise<SystemVideo[]> => {
      const { data, error } = await supabase
        .from('system_videos')
        .select('*')
        .eq('status', 'active')
        .order('order_position', { ascending: true });

      if (error) {
        console.error('Erro ao buscar vídeos do sistema:', error);
        throw error;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};