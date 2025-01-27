import { Printer, X } from 'lucide-react';
import { Sale } from '../types';
import { useEffect, useState } from 'react';

interface SalesReceiptProps {
  sale: Sale;
  onClose: () => void;
}

export default function SalesReceipt({ sale, onClose }: SalesReceiptProps) {
  const [cashierName, setCashierName] = useState<string>('');

  useEffect(() => {
    // Get cashier name from users in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const cashier = users.find((user: any) => user.id === sale.cashierId);
    setCashierName(cashier?.name || 'Unknown Cashier');
  }, [sale.cashierId]);

  const handlePrint = () => {
    window.print();
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 receipt-modal">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl receipt-content">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center print-hide">
          <h2 className="text-lg font-semibold">Struk Pembelian</h2>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Printer size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-2">SwiftPOS Glass</h1>
            <p className="text-gray-500 text-sm">
              {formatDateTime(sale.timestamp)}
            </p>
            <p className="text-gray-500 text-sm">No. Struk #{sale.id.slice(0, 8)}</p>
            <p className="text-gray-500 text-sm">Kasir: {cashierName}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <table className="w-full">
              <thead className="text-sm text-gray-600">
                <tr>
                  <th className="text-left py-2">Item</th>
                  <th className="text-right">Jml</th>
                  <th className="text-right">Harga</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {sale.items.map((item) => {
                  const price = item.quantity >= item.variant.minWholesaleQty
                    ? item.variant.wholesalePrice
                    : item.variant.price;
                  const itemTotal = price * item.quantity;

                  return (
                    <tr key={item.id}>
                      <td className="py-2">
                        {item.name}
                        <br />
                        <span className="text-xs text-gray-500">
                          {item.variant.type}: {item.variant.value}
                        </span>
                      </td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">Rp {price.toFixed(2)}</td>
                      <td className="text-right">Rp {itemTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rp {sale.total.toFixed(2)}</span>
          </div>

          <div className="text-center text-gray-500 text-sm pt-4 border-t border-gray-200">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>Simpan struk ini sebagai bukti pembelian.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
