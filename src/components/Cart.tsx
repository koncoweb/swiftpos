import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: () => void;
}

export default function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showChange, setShowChange] = useState(false);

  const total = items.reduce((sum, item) => {
    const isWholesale = item.quantity >= (item.variant.minWholesaleQty || 0);
    const price = isWholesale ? item.variant.wholesalePrice : item.variant.price;
    return sum + (price * item.quantity);
  }, 0);

  const change = Number(paymentAmount) - total;
  const isPaymentValid = Number(paymentAmount) >= total;

  const handleQuantityInput = (id: string, value: string, stock: number) => {
    const newQuantity = parseInt(value) || 0;
    if (newQuantity < 0 || newQuantity > stock) return;
    
    const item = items.find(item => item.id === id);
    if (!item) return;

    const delta = newQuantity - item.quantity;
    onUpdateQuantity(id, delta);
  };

  const handlePaymentInput = (value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) return;
    setPaymentAmount(value);
    setShowChange(false);
  };

  const handleCalculateChange = () => {
    if (!isPaymentValid) return;
    setShowChange(true);
  };

  const handleCheckout = () => {
    if (!isPaymentValid) return;
    onCheckout();
    setPaymentAmount('');
    setShowChange(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/20 backdrop-blur-lg flex items-center gap-2">
        <ShoppingCart className="text-emerald-600" />
        <h2 className="text-lg font-semibold">Keranjang Belanja</h2>
      </div>
      
      <div className="flex-1 overflow-auto">
        {items.map((item) => {
          const isWholesale = item.quantity >= (item.variant.minWholesaleQty || 0);
          const price = isWholesale ? item.variant.wholesalePrice : item.variant.price;
          const itemTotal = price * item.quantity;
          const remainingForWholesale = !isWholesale ? (item.variant.minWholesaleQty || 0) - item.quantity : 0;
          
          return (
            <div key={item.id} className="p-4 border-b border-white/10">
              <div className="flex justify-between mb-2">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    {item.variant.type}: {item.variant.value}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1 rounded-full hover:bg-white/10 text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="text-sm">
                    {isWholesale ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-medium">
                            Rp {price.toFixed(2)}
                          </span>
                          <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                            Harga Grosir
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Harga normal: Rp {item.variant.price.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Rp {price.toFixed(2)}</span>
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                            Harga Normal
                          </span>
                        </div>
                        {remainingForWholesale > 0 && (
                          <div className="text-xs text-blue-600">
                            Tambah {remainingForWholesale} lagi untuk harga grosir (Rp {item.variant.wholesalePrice.toFixed(2)})
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 rounded-full hover:bg-white/10"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityInput(item.id, e.target.value, item.variant.stock)}
                    className={`w-16 text-center px-2 py-1 rounded-lg bg-white/50 border focus:outline-none focus:ring-2 ${
                      isWholesale 
                        ? 'border-emerald-200 focus:ring-emerald-500'
                        : 'border-white/30 focus:ring-blue-500'
                    }`}
                    min="1"
                    max={item.variant.stock}
                  />
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 rounded-full hover:bg-white/10"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div className="text-right text-sm mt-1">
                Subtotal: <span className="font-medium text-emerald-600">Rp {itemTotal.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/20 backdrop-blur-lg space-y-4">
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-emerald-600">Rp {total.toFixed(2)}</span>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Jumlah Pembayaran</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
              <input
                type="text"
                value={paymentAmount}
                onChange={(e) => handlePaymentInput(e.target.value)}
                className={`w-full pl-8 pr-4 py-2 rounded-lg bg-white/50 border focus:outline-none focus:ring-2 ${
                  showChange
                    ? isPaymentValid
                      ? 'border-emerald-300 focus:ring-emerald-500'
                      : 'border-red-300 focus:ring-red-500'
                    : 'border-white/30 focus:ring-blue-500'
                }`}
                placeholder="0.00"
              />
            </div>
            <button
              onClick={handleCalculateChange}
              disabled={!paymentAmount || Number(paymentAmount) <= 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              Hitung
            </button>
          </div>
        </div>

        {showChange && (
          <div className={`p-4 rounded-lg ${
            isPaymentValid ? 'bg-emerald-50' : 'bg-red-50'
          }`}>
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {isPaymentValid ? 'Kembalian' : 'Pembayaran Kurang'}
              </span>
              {isPaymentValid && (
                <span className="font-bold text-emerald-600">
                  Rp {Math.max(0, change).toFixed(2)}
                </span>
              )}
            </div>
            {!isPaymentValid && (
              <p className="text-sm text-red-600 mt-1">
                Kurang: Rp {Math.abs(change).toFixed(2)}
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={items.length === 0 || !isPaymentValid}
          className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
        >
          Selesaikan Transaksi
        </button>
      </div>
    </div>
  );
}
