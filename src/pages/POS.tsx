import { useEffect, useState } from 'react';
import Cart from '../components/Cart';
import ProductGrid from '../components/ProductGrid';
import SalesReceipt from '../components/SalesReceipt';
import { CartItem, Product, Sale, ProductVariant } from '../types';
import { useAuth } from '../context/AuthContext';

export default function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const { user } = useAuth();
  
  const loadProducts = () => {
    try {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductClick = (product: Product, variant: ProductVariant) => {
    if (variant.stock <= 0) return;
    
    const existingItem = cartItems.find(item => 
      item.productId === product.id && item.variantId === variant.id
    );

    if (existingItem) {
      if (existingItem.quantity >= variant.stock) return;
      setCartItems(cartItems.map(item =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newCartItem: CartItem = {
        id: crypto.randomUUID(),
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        variant: {
          ...variant,
          minWholesaleQty: product.minWholesaleQty
        },
        quantity: 1
      };
      setCartItems([...cartItems, newCartItem]);
    }
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === cartItemId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) return item;
        if (newQuantity > item.variant.stock) return item;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== cartItemId));
  };

  const handleCheckout = () => {
    const sale: Sale = {
      id: crypto.randomUUID(),
      items: cartItems,
      total: cartItems.reduce((sum, item) => {
        const isWholesale = item.quantity >= item.variant.minWholesaleQty;
        const price = isWholesale ? item.variant.wholesalePrice : item.variant.price;
        return sum + (price * item.quantity);
      }, 0),
      timestamp: Date.now(),
      cashierId: user?.id || ''
    };

    // Update product stock
    const updatedProducts = products.map(product => ({
      ...product,
      variants: product.variants.map(variant => {
        const cartItem = cartItems.find(item => 
          item.productId === product.id && item.variantId === variant.id
        );
        if (cartItem) {
          return {
            ...variant,
            stock: variant.stock - cartItem.quantity
          };
        }
        return variant;
      })
    }));

    // Update localStorage and refresh products state
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);

    // Save sale
    const sales: Sale[] = JSON.parse(localStorage.getItem('sales') || '[]');
    localStorage.setItem('sales', JSON.stringify([...sales, sale]));

    setCurrentSale(sale);
    setCartItems([]);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 backdrop-blur-lg border-b border-white/20">
        <h1 className="text-2xl font-bold text-emerald-900">Kasir</h1>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <ProductGrid
              products={products}
              onProductClick={handleProductClick}
            />
          </div>
        </div>

        <div className="w-96 bg-white/30 backdrop-blur-xl border-l border-white/20">
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {currentSale && (
        <SalesReceipt
          sale={currentSale}
          onClose={() => setCurrentSale(null)}
        />
      )}
    </div>
  );
}
