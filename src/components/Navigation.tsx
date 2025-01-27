import { LayoutGrid, Package, Receipt, Users, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StorageUsage from './StorageUsage';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: LayoutGrid, label: 'Kasir', roles: ['owner', 'store_manager', 'shopkeeper'] },
    { path: '/products', icon: Package, label: 'Produk', roles: ['owner', 'store_manager'] },
    { path: '/sales', icon: Receipt, label: 'Penjualan', roles: ['owner', 'store_manager'] },
    { path: '/users', icon: Users, label: 'Pengguna', roles: ['owner'] },
  ].filter(item => item.roles.includes(user?.role || ''));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-20 min-h-screen bg-white/30 backdrop-blur-xl border-r border-white/20 flex flex-col items-center py-6">
      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-medium text-sm mb-8">
        POS
      </div>
      
      <div className="flex-1 flex flex-col gap-4">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`p-3 rounded-xl flex flex-col items-center gap-1 group relative ${
              location.pathname === path
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            <Icon size={20} />
            <span className="text-[11px] font-medium">{label}</span>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[9999] whitespace-nowrap">
              {label}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto w-full">
        <button
          onClick={handleLogout}
          className="p-3 rounded-xl flex flex-col items-center gap-1 text-red-600 hover:bg-white/50 group relative w-full"
        >
          <LogOut size={20} />
          <span className="text-[11px] font-medium">Keluar</span>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[9999] whitespace-nowrap">
            Keluar
          </div>
        </button>

        <StorageUsage />
      </div>
    </nav>
  );
}
