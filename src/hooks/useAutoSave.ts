import { useEffect, useRef, useCallback } from 'react';

interface AutoSaveOptions {
  delay?: number;
  onSave: (data: unknown) => Promise<void> | void;
  enabled?: boolean;
}

interface AutoSaveReturn {
  triggerSave: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
}

export const useAutoSave = (
  data: unknown,
  options: AutoSaveOptions
): AutoSaveReturn => {
  const { delay = 2000, onSave, enabled = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const lastSavedRef = useRef<Date | null>(null);

  const triggerSave = useCallback(async () => {
    if (!enabled || isSavingRef.current) return;

    try {
      isSavingRef.current = true;
      await onSave(data);
      lastSavedRef.current = new Date();
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave, enabled]);

  useEffect(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(triggerSave, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, triggerSave, enabled]);

  return {
    triggerSave,
    isSaving: isSavingRef.current,
    lastSaved: lastSavedRef.current,
  };
};
