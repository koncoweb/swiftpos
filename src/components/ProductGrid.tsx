import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Product, ProductVariant } from '../types';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product, variant: ProductVariant) => void;
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const handleVariantChange = (productId: string, variantId: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantId
    }));
  };

  const getGroupedVariants = (variants: ProductVariant[]) => {
    return variants.reduce((acc, variant) => {
      if (!acc[variant.type]) {
        acc[variant.type] = [];
      }
      acc[variant.type].push(variant);
      return acc;
    }, {} as Record<string, ProductVariant[]>);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
      {products.map((product) => {
        const groupedVariants = getGroupedVariants(product.variants);
        const selectedVariant = product.variants.find(
          v => v.id === selectedVariants[product.id]
        ) || product.variants[0];

        return (
          <div
            key={product.id}
            className="p-4 rounded-xl bg-white/30 backdrop-blur-lg border border-white/20 shadow-lg"
          >
            <div className="text-lg font-medium mb-2">{product.name}</div>
            
            {/* Variant Selectors */}
            {Object.entries(groupedVariants).map(([type, variants]) => (
              <div key={type} className="mb-2">
                <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                  {type}
                </label>
                <select
                  value={selectedVariant?.id}
                  onChange={(e) => handleVariantChange(product.id, e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-white/50 border border-white/30 text-sm"
                >
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.value} - ${variant.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Price Display */}
            <div className="text-sm mb-2">
              <div className="text-emerald-600 font-bold">
                ${selectedVariant.price.toFixed(2)}
              </div>
              <div className="text-xs text-emerald-700">
                Wholesale: ${selectedVariant.wholesalePrice.toFixed(2)}
                (min. {product.minWholesaleQty} items)
              </div>
              <div className="text-xs text-gray-500">
                Stock: {selectedVariant.stock}
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => onProductClick(product, selectedVariant)}
              disabled={selectedVariant.stock <= 0}
              className="w-full mt-2 p-2 rounded-lg bg-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              <span>Add to Cart</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
