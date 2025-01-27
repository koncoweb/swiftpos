import { Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types';

interface AddProductModalProps {
  onClose: () => void;
  onSave: (name: string, variants: ProductVariant[], minWholesaleQty: number) => void;
  editingProduct?: Product | null;
}

interface VariantForm {
  type: string;
  value: string;
  price: string;
  wholesalePrice: string;
  stock: string;
}

const defaultVariantForm: VariantForm = {
  type: '',
  value: '',
  price: '',
  wholesalePrice: '',
  stock: ''
};

export default function AddProductModal({ onClose, onSave, editingProduct }: AddProductModalProps) {
  const [name, setName] = useState('');
  const [minWholesaleQty, setMinWholesaleQty] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantForm, setVariantForm] = useState<VariantForm>(defaultVariantForm);
  const [isNewVariantType, setIsNewVariantType] = useState(true);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setMinWholesaleQty(editingProduct.minWholesaleQty.toString());
      setVariants(editingProduct.variants);
    }
  }, [editingProduct]);

  // Get unique existing variant types
  const existingVariantTypes = Array.from(new Set(variants.map(v => v.type)));

  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: crypto.randomUUID(),
      type: variantForm.type.toLowerCase(),
      value: variantForm.value,
      price: Number(variantForm.price),
      wholesalePrice: Number(variantForm.wholesalePrice),
      stock: Number(variantForm.stock)
    };
    setVariants([...variants, newVariant]);
    setVariantForm(defaultVariantForm);
    setIsNewVariantType(existingVariantTypes.length === 0);
  };

  const handleRemoveVariant = (id: string) => {
    const updatedVariants = variants.filter(v => v.id !== id);
    setVariants(updatedVariants);
    
    // Reset to new variant type input if no variants left
    if (updatedVariants.length === 0) {
      setIsNewVariantType(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, variants, Number(minWholesaleQty));
    onClose();
  };

  const handleVariantTypeChange = (value: string) => {
    setVariantForm({ ...variantForm, type: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl z-50">
        <div className="p-4 border-b border-white/20 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Produk</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Min. Jumlah untuk Harga Grosir</label>
              <input
                type="number"
                value={minWholesaleQty}
                onChange={(e) => setMinWholesaleQty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Varian</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipe Varian</label>
                <div className="space-y-2">
                  {existingVariantTypes.length > 0 && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isNewVariantType}
                        onChange={(e) => setIsNewVariantType(e.target.checked)}
                        className="rounded border-white/30 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm">Tambah tipe varian baru</span>
                    </div>
                  )}
                  {isNewVariantType || existingVariantTypes.length === 0 ? (
                    <input
                      type="text"
                      placeholder="contoh: ukuran, rasa"
                      value={variantForm.type}
                      onChange={(e) => handleVariantTypeChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <select
                      value={variantForm.type}
                      onChange={(e) => handleVariantTypeChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Pilih tipe varian</option>
                      {existingVariantTypes.map(type => (
                        <option key={type} value={type} className="capitalize">
                          {type}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nilai</label>
                <input
                  type="text"
                  placeholder="contoh: 250gr, vanilla"
                  value={variantForm.value}
                  onChange={(e) => setVariantForm({ ...variantForm, value: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harga</label>
                <input
                  type="number"
                  step="0.01"
                  value={variantForm.price}
                  onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harga Grosir</label>
                <input
                  type="number"
                  step="0.01"
                  value={variantForm.wholesalePrice}
                  onChange={(e) => setVariantForm({ ...variantForm, wholesalePrice: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stok</label>
                <input
                  type="number"
                  value={variantForm.stock}
                  onChange={(e) => setVariantForm({ ...variantForm, stock: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddVariant}
                  disabled={!variantForm.type || !variantForm.value || !variantForm.price}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Tambah Varian
                </button>
              </div>
            </div>

            {/* Variant List */}
            {variants.length > 0 && (
              <div className="border border-white/30 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-emerald-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">Tipe</th>
                      <th className="px-4 py-2 text-left">Nilai</th>
                      <th className="px-4 py-2 text-right">Harga</th>
                      <th className="px-4 py-2 text-right">Harga Grosir</th>
                      <th className="px-4 py-2 text-right">Stok</th>
                      <th className="px-4 py-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((variant) => (
                      <tr key={variant.id} className="border-t border-white/20">
                        <td className="px-4 py-2 capitalize">{variant.type}</td>
                        <td className="px-4 py-2">{variant.value}</td>
                        <td className="px-4 py-2 text-right">Rp {variant.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">Rp {variant.wholesalePrice.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">{variant.stock}</td>
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(variant.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={variants.length === 0}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50 hover:bg-emerald-700 transition-colors"
            >
              {editingProduct ? 'Perbarui Produk' : 'Tambah Produk'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
