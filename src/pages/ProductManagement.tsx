import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Product, ProductVariant } from '../types';
import AddProductModal from '../components/AddProductModal';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const handleAddProduct = (name: string, variants: ProductVariant[], minWholesaleQty: number) => {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name,
      variants,
      minWholesaleQty
    };
    saveProducts([...products, newProduct]);
  };

  const handleEditProduct = (name: string, variants: ProductVariant[], minWholesaleQty: number) => {
    if (!editingProduct) return;
    
    const updatedProducts = products.map(product => {
      if (product.id === editingProduct.id) {
        return {
          ...product,
          name,
          variants,
          minWholesaleQty
        };
      }
      return product;
    });
    
    saveProducts(updatedProducts);
  };

  const handleSaveProduct = (name: string, variants: ProductVariant[], minWholesaleQty: number) => {
    if (editingProduct) {
      handleEditProduct(name, variants, minWholesaleQty);
    } else {
      handleAddProduct(name, variants, minWholesaleQty);
    }
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    saveProducts(updatedProducts);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-900">Manajemen Produk</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {isModalOpen && (
        <AddProductModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          editingProduct={editingProduct}
        />
      )}

      <div className="bg-white/50 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-emerald-600 text-white">
              <th className="px-6 py-3 text-left">Nama</th>
              <th className="px-6 py-3 text-left">Varian</th>
              <th className="px-6 py-3 text-right">Min. Jumlah Grosir</th>
              <th className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-white/20">
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {Object.entries(
                      product.variants.reduce((acc, variant) => {
                        if (!acc[variant.type]) acc[variant.type] = [];
                        acc[variant.type].push(variant);
                        return acc;
                      }, {} as Record<string, ProductVariant[]>)
                    ).map(([type, variants]) => (
                      <div key={type} className="text-sm">
                        <span className="font-medium capitalize">{type}:</span>{' '}
                        {variants.map(v => v.value).join(', ')}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">{product.minWholesaleQty}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => startEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
