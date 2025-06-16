
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Estoque } from '@/types/estoque';

export const useEstoqueForm = (fetchEstoques: () => void) => {
  const [selectedEstoque, setSelectedEstoque] = useState<Estoque | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    data: '',
    nome_produto: '',
    unidade_medida: '',
    quantidade: '',
    valor_unitario: '',
    valor_total: '',
    quantidade_bruta: '',
    quantidade_liquida: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode && selectedEstoque) {
        // Atualizar estoque existente
        const { error } = await supabase
          .from('estoques')
          .update({
            data: formData.data,
            nome_produto: formData.nome_produto,
            unidade_medida: formData.unidade_medida,
            quantidade: parseFloat(formData.quantidade),
            valor_unitario: parseFloat(formData.valor_unitario),
            valor_total: parseFloat(formData.valor_total),
            quantidade_bruta: parseFloat(formData.quantidade_bruta),
            quantidade_liquida: parseFloat(formData.quantidade_liquida),
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedEstoque.id)
          .eq('user_id', user?.id);

        if (error) throw error;

        toast({
          title: "Estoque atualizado com sucesso!",
          description: "As alterações foram salvas.",
        });
      } else {
        // Criar novo estoque
        const { error } = await supabase
          .from('estoques')
          .insert([{
            user_id: user?.id,
            data: formData.data,
            nome_produto: formData.nome_produto,
            unidade_medida: formData.unidade_medida,
            quantidade: parseFloat(formData.quantidade),
            valor_unitario: parseFloat(formData.valor_unitario),
            valor_total: parseFloat(formData.valor_total),
            quantidade_bruta: parseFloat(formData.quantidade_bruta),
            quantidade_liquida: parseFloat(formData.quantidade_liquida)
          }]);

        if (error) throw error;

        toast({
          title: "Estoque cadastrado com sucesso!",
          description: "O item foi adicionado ao estoque.",
        });
      }

      resetForm();
      fetchEstoques();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar estoque",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (estoque: Estoque) => {
    setSelectedEstoque(estoque);
    setFormData({
      data: estoque.data,
      nome_produto: estoque.nome_produto,
      unidade_medida: estoque.unidade_medida,
      quantidade: estoque.quantidade.toString(),
      valor_unitario: estoque.valor_unitario.toString(),
      valor_total: estoque.valor_total.toString(),
      quantidade_bruta: estoque.quantidade_bruta.toString(),
      quantidade_liquida: estoque.quantidade_liquida.toString()
    });
    setIsEditMode(true);
  };

  const resetForm = () => {
    setFormData({
      data: '',
      nome_produto: '',
      unidade_medida: '',
      quantidade: '',
      valor_unitario: '',
      valor_total: '',
      quantidade_bruta: '',
      quantidade_liquida: ''
    });
    setSelectedEstoque(null);
    setIsEditMode(false);
  };

  return {
    formData,
    setFormData,
    selectedEstoque,
    setSelectedEstoque,
    isEditMode,
    loading,
    handleSubmit,
    handleEdit,
    resetForm
  };
};
