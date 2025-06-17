
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProdutoFormFieldsProps {
  produtoData: {
    nome: string;
    categoria: string;
    margemLucro: number;
  };
  onUpdateProduto: (updates: Partial<typeof produtoData>) => void;
}

const ProdutoFormFields: React.FC<ProdutoFormFieldsProps> = ({
  produtoData,
  onUpdateProduto,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="nome-produto">Nome do Produto *</Label>
        <Input
          id="nome-produto"
          value={produtoData.nome}
          onChange={(e) => onUpdateProduto({ nome: e.target.value })}
          placeholder="Digite o nome do produto"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoria-produto">Categoria *</Label>
        <Input
          id="categoria-produto"
          value={produtoData.categoria}
          onChange={(e) => onUpdateProduto({ categoria: e.target.value })}
          placeholder="Ex: Eletrônicos, Roupas, Alimentação"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="margem-lucro">Margem de Lucro (%) *</Label>
        <Input
          id="margem-lucro"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={produtoData.margemLucro}
          onChange={(e) => onUpdateProduto({ margemLucro: parseFloat(e.target.value) || 0 })}
          placeholder="30"
        />
      </div>
    </div>
  );
};

export default ProdutoFormFields;
