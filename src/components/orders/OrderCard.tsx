import React from 'react';
import { Check, X, Printer } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Order, Recipe } from '../../types';

interface OrderCardProps {
  order: Order;
  recipes: Recipe[];
  onUpdateStatus: (id: string, status: Order['status']) => Promise<void>;
  onPrint: (order: Order) => void;
}

export function OrderCard({ order, recipes, onUpdateStatus, onPrint }: OrderCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Table {order.tableNumber}</h3>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[order.status]
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
        <ul className="space-y-2">
          {order.items.map((item, index) => {
            const recipe = recipes.find((r) => r.id === item.recipeId);
            return (
              <li key={index} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {recipe?.name}
                </span>
                <span>${item.subtotal.toFixed(2)}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-semibold mb-4">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          {order.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(order.id, 'completed')}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Complete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPrint(order)}
            className="ml-auto"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}