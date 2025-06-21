
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAutoSave = (userId?: string) => {
  const saveFormData = useCallback(async () => {
    if (!userId) return;

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
          .insert({
            user_id: userId,
            page: window.location.pathname,
            unsaved_data: unsavedData,
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Erro ao salvar dados da sessão:', error);
      throw error;
    }
  }, [userId]);

  return { saveFormData };
};
