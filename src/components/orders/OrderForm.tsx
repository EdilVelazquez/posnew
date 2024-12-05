import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Order, Recipe } from '../../types';

interface OrderFormProps {
  recipes: Recipe[];
  onSubmit: (data: Partial<Order>) => Promise<void>;
  defaultValues?: Partial<Order>;
}

export function OrderForm({ recipes, onSubmit, defaultValues }: OrderFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Partial<Order>>({
    defaultValues: {
      items: [{ recipeId: '', quantity: 1, price: 0, subtotal: 0 }],
      status: 'pending',
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchItems = watch('items');
  const total = watchItems?.reduce((sum, item) => {
    const recipe = recipes.find((r) => r.id === item.recipeId);
    const price = recipe?.price || 0;
    const quantity = item.quantity || 0;
    return sum + price * quantity;
  }, 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Table Number</label>
        <Input
          type="number"
          {...register('tableNumber', {
            required: 'Table number is required',
            min: { value: 1, message: 'Table number must be positive' },
          })}
          className="mt-1"
        />
        {errors.tableNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.tableNumber.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">Items</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ recipeId: '', quantity: 1, price: 0, subtotal: 0 })
            }
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => {
            const recipe = recipes.find(
              (r) => r.id === watchItems?.[index]?.recipeId
            );
            const price = recipe?.price || 0;
            const quantity = watchItems?.[index]?.quantity || 0;
            const subtotal = price * quantity;

            return (
              <div key={field.id} className="flex gap-4 items-start">
                <div className="flex-1">
                  <select
                    {...register(`items.${index}.recipeId` as const, {
                      required: 'Recipe is required',
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Recipe</option>
                    {recipes.map((recipe) => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.name} - ${recipe.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    min="1"
                    {...register(`items.${index}.quantity` as const, {
                      required: 'Required',
                      min: { value: 1, message: 'Min 1' },
                    })}
                    placeholder="Qty"
                  />
                </div>
                <div className="w-24 pt-2 text-right">
                  ${subtotal.toFixed(2)}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <span>${total?.toFixed(2)}</span>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Create Order'}
      </Button>
    </form>
  );
}