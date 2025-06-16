
import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFluxoCaixaData } from './useFluxoCaixaData';
import { useFluxoCaixaCalculations } from './useFluxoCaixaCalculations';

export const useIntegratedFluxoCaixa = (periodoFilter: string) => {
  const queryClient = useQueryClient();
  const { lancamentos, loading, refetch } = useFluxoCaixaData(periodoFilter);
  
  const calculations = useFluxoCaixaCalculations(lancamentos);

  // Escutar mudanças nos lançamentos e atualizar automaticamente
  const invalidateFluxoCaixa = () => {
    refetch();
  };

  // Função para ser chamada quando lançamentos são modificados
  const onLancamentosChange = () => {
    // Invalidar o cache dos lançamentos
    queryClient.invalidateQueries({ queryKey: ['lancamentos'] });
    // Recarregar dados do fluxo de caixa
    invalidateFluxoCaixa();
  };

  return {
    lancamentos,
    loading,
    refetch,
    onLancamentosChange,
    ...calculations
  };
};
