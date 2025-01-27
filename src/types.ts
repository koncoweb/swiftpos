export interface ProductVariant {
  id: string;
  type: string; // e.g., "size", "taste"
  value: string; // e.g., "250gr", "vanilla"
  price: number;
  wholesalePrice: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  variants: ProductVariant[];
  minWholesaleQty: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  variant: ProductVariant;
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: number;
  cashierId: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'owner' | 'store_manager' | 'shopkeeper';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
