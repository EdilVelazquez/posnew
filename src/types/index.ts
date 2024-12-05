export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  enabled: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  price: number;
  ingredients: Ingredient[];
  category: string;
  description?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minStock?: number;
  currentStock: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface OrderItem {
  recipeId: string;
  quantity: number;
  price: number;
  subtotal: number;
}