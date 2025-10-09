import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select-white";
import { AlertCircle, Send } from "lucide-react";
import { TicketFormData } from "@/types/support";
import { useToast } from "@/hooks/use-toast";

interface TicketFormProps {
  onSubmit: (data: TicketFormData) => Promise<void>;
  loading?: boolean;
}

export const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<TicketFormData>({
    title: "",
    description: "",
    category: "",
    priority: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.priority) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "",
      });
      toast({
        title: "Chamado criado com sucesso!",
        description: "Nossa equipe entrará em contato em breve.",
      });
    } catch (error) {
      toast({
        title: "Erro ao criar chamado",
        description: "Tente novamente ou entre em contato via WhatsApp.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          Abrir Novo Chamado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Categoria *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tecnico">Suporte Técnico</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Prioridade *
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título do Chamado *
            </Label>
            <Input
              id="title"
              placeholder="Descreva brevemente o problema ou solicitação"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição Detalhada *
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva detalhadamente o problema, incluindo passos para reproduzir, mensagens de erro, ou qualquer informação relevante..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border-gray-300 focus:border-blue-500 min-h-[120px]"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Abrir Chamado
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};