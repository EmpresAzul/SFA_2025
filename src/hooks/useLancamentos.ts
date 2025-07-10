import { useLancamentosQuery } from "./lancamentos/useLancamentosQuery";
import { useLancamentosMutations } from "./lancamentos/useLancamentosMutations";

export * from "@/types/lancamentos";

export const useLancamentos = () => {
  const { useCreate, useUpdate, useDelete } = useLancamentosMutations();

  return {
    useQuery: useLancamentosQuery,
    useCreate,
    useUpdate,
    useDelete,
  };
};
