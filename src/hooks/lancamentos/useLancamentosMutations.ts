import { useLancamentoCreateMutation } from "./mutations/useLancamentoCreateMutation";
import { useLancamentoUpdateMutation } from "./mutations/useLancamentoUpdateMutation";
import { useLancamentoDeleteMutation } from "./mutations/useLancamentoDeleteMutation";

export const useLancamentosMutations = () => {
  const createMutation = useLancamentoCreateMutation();
  const updateMutation = useLancamentoUpdateMutation();
  const deleteMutation = useLancamentoDeleteMutation();

  return {
    useCreate: () => ({
      mutateAsync: createMutation.mutateAsync,
      isPending: createMutation.isPending,
    }),
    useUpdate: () => ({
      mutateAsync: updateMutation.mutateAsync,
      isPending: updateMutation.isPending,
    }),
    useDelete: () => ({
      mutateAsync: deleteMutation.mutateAsync,
      isPending: deleteMutation.isPending,
    }),
  };
};
