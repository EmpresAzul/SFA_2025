import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Save, FolderOpen, Edit2, Trash2, Plus } from "lucide-react";
import type { Projecao } from "@/hooks/usePontoEquilibrio";

interface ProjecoesSalvasProps {
  projecoes: Projecao[];
  projecaoAtual: string | null;
  onSalvarProjecao: (nome: string) => void;
  onAtualizarProjecao?: (id: string, nome?: string) => void;
  onCarregarProjecao: (projecao: Projecao) => void;
  onDeletarProjecao: (id: string) => void;
  onNovaProjecao: () => void;
  isSaving: boolean;
  isDeleting: boolean;
}

const ProjecoesSalvas: React.FC<ProjecoesSalvasProps> = ({
  projecoes,
  projecaoAtual,
  onSalvarProjecao,
  onAtualizarProjecao,
  onCarregarProjecao,
  onDeletarProjecao,
  onNovaProjecao,
  isSaving,
  isDeleting,
}) => {
  const [nomeProjecao, setNomeProjecao] = useState("");
  const [dialogAberto, setDialogAberto] = useState(false);

  const handleSalvar = () => {
    if (nomeProjecao.trim()) {
      if (projecaoAtual && onAtualizarProjecao) {
        // Atualizar projeção existente
        onAtualizarProjecao(projecaoAtual, nomeProjecao.trim());
      } else {
        // Criar nova projeção
        onSalvarProjecao(nomeProjecao.trim());
      }
      setNomeProjecao("");
      setDialogAberto(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-blue-700 text-lg">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Projeções Salvas
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onNovaProjecao}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nova
            </Button>
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-1" />
                  {projecaoAtual ? "Atualizar" : "Salvar"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {projecaoAtual ? "Atualizar Projeção" : "Salvar Projeção"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="nome-projecao"
                      className="text-sm font-medium"
                    >
                      Nome da Projeção
                    </label>
                    <Input
                      id="nome-projecao"
                      value={nomeProjecao}
                      onChange={(e) => setNomeProjecao(e.target.value)}
                      placeholder="Ex: Cenário Conservador 2024"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDialogAberto(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSalvar}
                      disabled={!nomeProjecao.trim() || isSaving}
                    >
                      {isSaving 
                        ? (projecaoAtual ? "Atualizando..." : "Salvando...") 
                        : (projecaoAtual ? "Atualizar" : "Salvar")
                      }
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {projecoes.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma projeção salva ainda</p>
            <p className="text-xs">
              Clique em "Salvar" para criar sua primeira projeção
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {projecoes.map((projecao) => (
              <div
                key={projecao.id}
                className={`p-3 border rounded-lg transition-all duration-200 ${
                  projecaoAtual === projecao.id
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">
                      {projecao.nome_projecao}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {formatarData(projecao.created_at)}
                    </p>
                    <div className="text-xs text-gray-600 mt-1">
                      PE: R${" "}
                      {projecao.dados_projecao.resultados.pontoEquilibrio.toLocaleString(
                        "pt-BR",
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCarregarProjecao(projecao)}
                      className="h-8 w-8 p-0"
                      title="Carregar projeção"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setNomeProjecao(projecao.nome_projecao);
                        setDialogAberto(true);
                      }}
                      className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700"
                      title="Editar nome da projeção"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          title="Excluir projeção"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Projeção</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a projeção "
                            {projecao.nome_projecao}"? Esta ação não pode ser
                            desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeletarProjecao(projecao.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isDeleting ? "Excluindo..." : "Excluir"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjecoesSalvas;
