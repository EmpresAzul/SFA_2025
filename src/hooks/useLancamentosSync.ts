
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Hook para sincronizar mudanças nos lançamentos entre DRE e Fluxo de Caixa
export const useLancamentosSync = (onSync?: () => void) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.queryKey?.[0] === 'lancamentos') {
        console.log('Sincronizando dados após mudança nos lançamentos...');
        onSync?.();
      }
    });

    return () => unsubscribe();
  }, [queryClient, onSync]);

  const triggerSync = () => {
    queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
    onSync?.();
  };

  return { triggerSync };
};
