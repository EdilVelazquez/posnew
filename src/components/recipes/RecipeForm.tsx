import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Recipe } from '../../types';

interface RecipeFormProps {
  onSubmit: (data: Partial<Recipe>) => Promise<void>;
  defaultValues?: Partial<Recipe>;
}

export function RecipeForm({ onSubmit, defaultValues }: RecipeFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Partial<Recipe>>({
    defaultValues: {
      ingredients: [{ id: '', name: '', quantity: 0, unit: '', currentStock: 0 }],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <Input
          {...register('name', { required: 'Recipe name is required' })}
          className="mt-1"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <Input
          type="number"
          step="0.01"
          {...register('price', {
            required: 'Price is required',
            min: { value: 0, message: 'Price must be positive' },
          })}
          className="mt-1"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <Input
          {...register('category', { required: 'Category is required' })}
          className="mt-1"
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">Ingredients</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ id: '', name: '', quantity: 0, unit: '', currentStock: 0 })
            }
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Ingredient
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start">
              <div className="flex-1">
                <Input
                  {...register(`ingredients.${index}.name` as const, {
                    required: 'Ingredient name is required',
                  })}
                  placeholder="Name"
                />
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  step="0.01"
                  {...register(`ingredients.${index}.quantity` as const, {
                    required: 'Required',
                    min: { value: 0, message: 'Must be positive' },
                  })}
                  placeholder="Quantity"
                />
              </div>
              <div className="w-24">
                <Input
                  {...register(`ingredients.${index}.unit` as const, {
                    required: 'Required',
                  })}
                  placeholder="Unit"
                />
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
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Recipe'}
      </Button>
    </form>
  );
}