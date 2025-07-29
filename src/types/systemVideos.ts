export interface SystemVideo {
  id: string;
  title: string;
  youtube_url: string;
  description?: string;
  order_position: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export type SystemVideoFormData = Omit<SystemVideo, 'id' | 'created_at' | 'updated_at'>;