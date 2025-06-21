
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAutoSave = () => {
  const { user } = useAuth();

  const saveFormData = useCallback(async () => {
    if (!user) return;

    try {
      // Capturar dados de formulários não submetidos
      const forms = document.querySelectorAll('form');
      const unsavedData: any[] = [];

      forms.forEach((form, index) => {
        const formData = new FormData(form);
        const data: Record<string, any> = {};
        let hasData = false;

        formData.forEach((value, key) => {
          if (value && value.toString().trim() !== '') {
            data[key] = value;
            hasData = true;
          }
        });

        if (hasData) {
          unsavedData.push({
            form_index: index,
            page: window.location.pathname,
            data: data,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Salvar dados não submetidos se houver algum
      if (unsavedData.length > 0) {
        await supabase
          .from('user_session_data')
          .upsert({
            user_id: user.id,
            page: window.location.pathname,
            unsaved_data: unsavedData,
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Erro ao salvar dados da sessão:', error);
      throw error;
    }
  }, [user]);

  return { saveFormData };
};
