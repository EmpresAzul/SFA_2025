import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Save, X } from "lucide-react";
import {
  useLembretes,
  type LembreteFormData,
  type Lembrete,
} from "@/hooks/useLembretes";

interface LembretesFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingLembrete?: Lembrete | null;
}

const LembretesForm: React.FC<LembretesFormProps> = ({
  isOpen,
  onClose,
  editingLembrete,
}) => {
  const { createLembrete, updateLembrete } = useLembretes();
  const [formData, setFormData] = useState<LembreteFormData>({
    titulo: "",
    descricao: "",
    data_vencimento: "",
    prioridade: "",
  });

  // Carrega dados quando está editando
  useEffect(() => {
    if (editingLembrete) {
      console.log("Carregando dados para edição:", editingLembrete);
      setFormData({
        titulo: editingLembrete.titulo || "",
        descricao: editingLembrete.descricao || "",
        data_vencimento: editingLembrete.data_vencimento || "",
        prioridade: editingLembrete.prioridade || "",
      });
    } else {
      // Limpa formulário quando não está editando
      setFormData({
        titulo: "",
        descricao: "",
        data_vencimento: "",
        prioridade: "",
      });
    }
  }, [editingLembrete, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingLembrete) {
        console.log("Atualizando lembrete:", editingLembrete.id, formData);
        await updateLembrete.mutateAsync({
          id: editingLembrete.id,
          ...formData,
        });
      } else {
        console.log("Criando novo lembrete:", formData);
        await createLembrete.mutateAsync(formData);
      }

      onClose();
      setFormData({
        titulo: "",
        descricao: "",
        data_vencimento: "",
        prioridade: "",
      });
    } catch (error) {
      console.error("Erro ao salvar lembrete:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" 
         style={{ backgroundColor: 'rgba(30, 58, 138, 0.5)' }}>
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              {editingLembrete ? "Editar Lembrete" : "Novo Lembrete"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                placeholder="Digite o título do lembrete"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Descreva o lembrete (opcional)"
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data_vencimento">Data de Vencimento *</Label>
                <Input
                  id="data_vencimento"
                  type="date"
                  value={formData.data_vencimento}
                  onChange={(e) =>
                    setFormData({ ...formData, data_vencimento: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <select
                  id="prioridade"
                  value={formData.prioridade || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, prioridade: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                >
                  <option value="">Selecione</option>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={createLembrete.isPending || updateLembrete.isPending}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingLembrete ? "Atualizar" : "Salvar"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LembretesForm;
