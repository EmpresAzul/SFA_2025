import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  cost: number;
  supplier: string;
  barcode: string;
  location: string;
  status: "ativo" | "inativo";
  dateAdded: string;
  lastUpdated: string;
  description?: string;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Notebook Dell Inspiron",
      category: "Eletrônicos",
      quantity: 15,
      minQuantity: 5,
      price: 2500.0,
      cost: 2000.0,
      supplier: "Tech Supply Ltda",
      barcode: "7891234567890",
      location: "Estante A-01",
      status: "ativo",
      dateAdded: "2024-01-15",
      lastUpdated: "2024-01-20",
      description: "Notebook para uso corporativo",
    },
    {
      id: "2",
      name: "Mouse Logitech MX",
      category: "Periféricos",
      quantity: 2,
      minQuantity: 10,
      price: 89.9,
      cost: 65.0,
      supplier: "Periféricos SA",
      barcode: "7891234567891",
      location: "Estante B-03",
      status: "ativo",
      dateAdded: "2024-01-10",
      lastUpdated: "2024-01-18",
      description: "Mouse wireless profissional",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    minQuantity: "",
    price: "",
    cost: "",
    supplier: "",
    barcode: "",
    location: "",
    status: "ativo" as "ativo" | "inativo",
    description: "",
  });

  const { toast } = useToast();

  const categories = [
    "Eletrônicos",
    "Periféricos",
    "Móveis",
    "Papelaria",
    "Limpeza",
    "Outros",
  ];

  const calculateStats = () => {
    const activeItems = items.filter((item) => item.status === "ativo");
    const inactiveItems = items.filter((item) => item.status === "inativo");
    const totalValue = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
    const lowStockItems = activeItems.filter(
      (item) => item.quantity <= item.minQuantity,
    );

    return {
      activeCount: activeItems.length,
      inactiveCount: inactiveItems.length,
      totalValue,
      lowStockCount: lowStockItems.length,
    };
  };

  const stats = calculateStats();

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.includes(searchTerm);
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    const matchesDate = !dateFilter || item.dateAdded >= dateFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.quantity ||
      !formData.minQuantity ||
      !formData.price ||
      !formData.cost ||
      !formData.supplier
    ) {
      toast({
        title: "Erro no cadastro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newItem: InventoryItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      minQuantity: parseInt(formData.minQuantity),
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      supplier: formData.supplier,
      barcode: formData.barcode,
      location: formData.location,
      status: formData.status,
      dateAdded:
        editingItem?.dateAdded || new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      description: formData.description,
    };

    if (editingItem) {
      setItems(
        items.map((item) => (item.id === editingItem.id ? newItem : item)),
      );
      toast({
        title: "Produto atualizado!",
        description: "As informações do produto foram atualizadas com sucesso.",
      });
    } else {
      setItems([...items, newItem]);
      toast({
        title: "Produto cadastrado!",
        description: "O produto foi adicionado ao estoque com sucesso.",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      quantity: "",
      minQuantity: "",
      price: "",
      cost: "",
      supplier: "",
      barcode: "",
      location: "",
      status: "ativo",
      description: "",
    });
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      minQuantity: item.minQuantity.toString(),
      price: item.price.toString(),
      cost: item.cost.toString(),
      supplier: item.supplier,
      barcode: item.barcode,
      location: item.location,
      status: item.status,
      description: item.description || "",
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    setDeleteItemId(null);
    toast({
      title: "Produto excluído!",
      description: "O produto foi removido do estoque.",
      variant: "destructive",
    });
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-fluxo-text">
            Controle de Estoque
          </h1>
          <p className="text-fluxo-black-600 mt-1">
            Gerencie produtos e controle seu estoque
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="gradient-professional hover:gradient-fluxo-light text-white shadow-professional"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-fluxo-black-200 shadow-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-fluxo-black-600">
                  Produtos Ativos
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-fluxo-black-200 shadow-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-fluxo-black-600">
                  Produtos Inativos
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.inactiveCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-fluxo-black-200 shadow-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-fluxo-black-600">
                  Valor Total
                </p>
                <p className="text-2xl font-bold text-fluxo-blue-600">
                  {formatCurrency(stats.totalValue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-fluxo-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-fluxo-black-200 shadow-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-fluxo-black-600">
                  Estoque Baixo
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.lowStockCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-fluxo-black-200 shadow-professional">
        <CardHeader>
          <CardTitle className="text-fluxo-black-800 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fluxo-black-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, fornecedor ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-fluxo-black-200"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="border-fluxo-black-200">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="border-fluxo-black-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fluxo-black-400 w-4 h-4" />
              <Input
                type="date"
                placeholder="Data de cadastro"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 border-fluxo-black-200"
              />
            </div>

            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSelectedStatus("");
                setDateFilter("");
              }}
              variant="outline"
              className="border-fluxo-black-200 text-fluxo-black-600 hover:bg-fluxo-black-50"
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-fluxo-black-200 shadow-professional">
        <CardHeader>
          <CardTitle className="text-fluxo-black-800">
            Produtos Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-fluxo-black-200">
                <TableHead className="text-fluxo-black-700">Produto</TableHead>
                <TableHead className="text-fluxo-black-700">
                  Categoria
                </TableHead>
                <TableHead className="text-fluxo-black-700">
                  Quantidade
                </TableHead>
                <TableHead className="text-fluxo-black-700">Preço</TableHead>
                <TableHead className="text-fluxo-black-700">
                  Fornecedor
                </TableHead>
                <TableHead className="text-fluxo-black-700">Status</TableHead>
                <TableHead className="text-fluxo-black-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-fluxo-black-100 hover:bg-fluxo-black-50"
                >
                  <TableCell className="font-medium text-fluxo-black-800">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-fluxo-black-600">
                    {item.category}
                  </TableCell>
                  <TableCell
                    className={`font-semibold ${item.quantity <= item.minQuantity ? "text-red-600" : "text-fluxo-black-600"}`}
                  >
                    {item.quantity}
                    {item.quantity <= item.minQuantity && (
                      <span className="ml-1 text-xs text-red-500">(Baixo)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-fluxo-black-600">
                    {formatCurrency(item.price)}
                  </TableCell>
                  <TableCell className="text-fluxo-black-600">
                    {item.supplier}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-fluxo-black-200"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="border-fluxo-black-200"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteItemId(item.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-95 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-fluxo-black-200 shadow-professional-lg">
            <CardHeader>
              <CardTitle className="text-fluxo-black-800">
                {editingItem ? "Editar Produto" : "Cadastrar Novo Produto"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-fluxo-black-700">
                      Nome do Produto *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="border-fluxo-black-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-fluxo-black-700">
                      Categoria *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger className="border-fluxo-black-200">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity" className="text-fluxo-black-700">
                      Quantidade *
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      required
                      className="border-fluxo-black-200"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="minQuantity"
                      className="text-fluxo-black-700"
                    >
                      Quantidade Mínima *
                    </Label>
                    <Input
                      id="minQuantity"
                      type="number"
                      value={formData.minQuantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minQuantity: e.target.value,
                        })
                      }
                      required
                      className="border-fluxo-black-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price" className="text-fluxo-black-700">
                      Preço de Venda (R$) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                      className="border-fluxo-black-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cost" className="text-fluxo-black-700">
                      Custo (R$) *
                    </Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) =>
                        setFormData({ ...formData, cost: e.target.value })
                      }
                      required
                      className="border-fluxo-black-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="supplier" className="text-fluxo-black-700">
                      Fornecedor *
                    </Label>
                    <Input
                      id="supplier"
                      value={formData.supplier}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier: e.target.value })
                      }
                      required
                      className="border-fluxo-black-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="barcode" className="text-fluxo-black-700">
                      Código de Barras
                    </Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) =>
                        setFormData({ ...formData, barcode: e.target.value })
                      }
                      className="border-fluxo-black-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-fluxo-black-700">
                      Localização
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Ex: Estante A-01"
                      className="border-fluxo-black-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-fluxo-black-700">
                      Status *
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "ativo" | "inativo") =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="border-fluxo-black-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-fluxo-black-700">
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="border-fluxo-black-200"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="border-fluxo-black-200 text-fluxo-black-600"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="gradient-professional hover:gradient-fluxo-light text-white shadow-professional"
                  >
                    {editingItem ? "Atualizar" : "Cadastrar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItemId && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-95 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md border-fluxo-black-200 shadow-professional-lg">
            <CardHeader>
              <CardTitle className="text-fluxo-black-800">
                Confirmar Exclusão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-fluxo-black-600 mb-6">
                Tem certeza que deseja excluir este produto? Esta ação não pode
                ser desfeita.
              </p>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setDeleteItemId(null)}
                  className="border-fluxo-black-200 text-fluxo-black-600"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleDelete(deleteItemId)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Inventory;
