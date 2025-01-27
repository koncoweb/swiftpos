import { HardDrive } from 'lucide-react';
import { useEffect, useState } from 'react';

const MAX_STORAGE = 5 * 1024 * 1024; // 5MB in bytes

export default function StorageUsage() {
  const [usage, setUsage] = useState(0);

  useEffect(() => {
    // Function to calculate storage usage
    const calculateUsage = () => {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length * 2; // Multiply by 2 for UTF-16 encoding
        }
      }
      setUsage(total);
    };

    // Initial calculation
    calculateUsage();

    // Set up event listener for storage changes
    window.addEventListener('storage', calculateUsage);

    // Cleanup
    return () => {
      window.removeEventListener('storage', calculateUsage);
    };
  }, []);

  // Calculate percentage used
  const percentageUsed = (usage / MAX_STORAGE) * 100;
  
  // Format sizes for display
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="p-3 border-t border-white/20">
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
        <HardDrive size={16} />
        <span>Penggunaan Penyimpanan</span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all ${
            percentageUsed > 90 
              ? 'bg-red-500' 
              : percentageUsed > 70 
                ? 'bg-yellow-500' 
                : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(100, percentageUsed)}%` }}
        />
      </div>

      {/* Usage numbers */}
      <div className="text-xs text-gray-600">
        {formatSize(usage)} / {formatSize(MAX_STORAGE)}
        <span className="ml-1">
          ({percentageUsed.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
}
