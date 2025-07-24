import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatNumberToDisplay } from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";

interface SaldoBancarioData {
  id?: string;
  banco: string;
  saldo: number;
  data: string;
  user_id: string;
}

interface SaldosBancariosListProps {
  saldos: SaldoBancarioData[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (saldo: SaldoBancarioData) => void;
}

const SaldosBancariosList: React.FC<SaldosBancariosListProps> = ({
  saldos,
  loading,
  onDelete,
  onEdit,
}) => {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este saldo?")) {
      try {
        await onDelete(id);
        toast({
          title: "Sucesso",
          description: "Saldo excluído com sucesso!",
        });
      } catch (error) {
        console.error("Erro ao excluir saldo:", error);
        toast({
          title: "Erro",
          description: "Erro ao excluir saldo.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saldos Cadastrados</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : saldos.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum saldo cadastrado
            </h3>
            <p className="text-gray-500">
              Adicione o primeiro saldo bancário usando o formulário
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {saldos.map((saldo) => (
              <div
                key={saldo.id || `${saldo.banco}-${saldo.data}`}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{saldo.banco}</h3>
                  <p className="text-sm text-gray-500">
                    Data: {new Date(saldo.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`font-semibold text-lg ${
                      saldo.saldo >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatNumberToDisplay(saldo.saldo)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saldo.id && handleDelete(saldo.id)}
                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  >
                    Excluir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit && onEdit(saldo)}
                    className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                  >
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SaldosBancariosList;