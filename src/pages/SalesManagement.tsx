import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Sale, User } from '../types';
import SalesReceipt from '../components/SalesReceipt';

interface SaleWithCashier extends Sale {
  cashierName: string;
}

export default function SalesManagement() {
  const [sales, setSales] = useState<SaleWithCashier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  useEffect(() => {
    const loadSalesWithCashierNames = () => {
      const savedSales = localStorage.getItem('sales');
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (savedSales) {
        const parsedSales: Sale[] = JSON.parse(savedSales);
        const salesWithCashiers = parsedSales.map(sale => ({
          ...sale,
          cashierName: users.find(user => user.id === sale.cashierId)?.name || 'Unknown Cashier'
        }));
        setSales(salesWithCashiers);
      }
    };

    loadSalesWithCashierNames();
  }, []);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = !searchTerm || 
      sale.items.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      sale.cashierName.toLowerCase().includes(searchTerm.toLowerCase());

    const saleDate = new Date(sale.timestamp);
    const matchesStartDate = !startDate || 
      saleDate >= new Date(startDate);
    const matchesEndDate = !endDate || 
      saleDate <= new Date(new Date(endDate).setHours(23, 59, 59));

    return matchesSearch && matchesStartDate && matchesEndDate;
  }).sort((a, b) => b.timestamp - a.timestamp);

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalItems = filteredSales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-emerald-900 mb-6">Sales Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/50 backdrop-blur-xl rounded-xl p-4 shadow-lg">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold text-emerald-600">{filteredSales.length}</p>
        </div>
        <div className="bg-white/50 backdrop-blur-xl rounded-xl p-4 shadow-lg">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-emerald-600">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white/50 backdrop-blur-xl rounded-xl p-4 shadow-lg">
          <h3 className="text-sm font-medium text-gray-500">Items Sold</h3>
          <p className="text-2xl font-bold text-emerald-600">{totalItems}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/50 backdrop-blur-xl rounded-xl p-4 shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search items or cashier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white/50 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-emerald-600 text-white">
              <th className="px-6 py-3 text-left">Receipt ID</th>
              <th className="px-6 py-3 text-left">Date & Time</th>
              <th className="px-6 py-3 text-left">Cashier</th>
              <th className="px-6 py-3 text-right">Items</th>
              <th className="px-6 py-3 text-right">Total</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="border-b border-white/20">
                <td className="px-6 py-4">#{sale.id.slice(0, 8)}</td>
                <td className="px-6 py-4">{formatDateTime(sale.timestamp)}</td>
                <td className="px-6 py-4">{sale.cashierName}</td>
                <td className="px-6 py-4 text-right">
                  {sale.items.reduce((sum, item) => sum + item.quantity, 0)}
                </td>
                <td className="px-6 py-4 text-right">
                  ${sale.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setSelectedSale(sale)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    View Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSale && (
        <SalesReceipt
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
        />
      )}
    </div>
  );
}
