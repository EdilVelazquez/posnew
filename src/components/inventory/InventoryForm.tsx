import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Ingredient } from '../../types';

interface InventoryFormProps {
  onSubmit: (data: Partial<Ingredient>) => Promise<void>;
  defaultValues?: Partial<Ingredient>;
}

export function InventoryForm({ onSubmit, defaultValues }: InventoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Partial<Ingredient>>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <Input
          {...register('name', { required: 'Ingredient name is required' })}
          className="mt-1"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Current Stock
        </label>
        <Input
          type="number"
          step="0.01"
          {...register('currentStock', {
            required: 'Current stock is required',
            min: { value: 0, message: 'Stock must be positive' },
          })}
          className="mt-1"
        />
        {errors.currentStock && (
          <p className="mt-1 text-sm text-red-600">{errors.currentStock.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Unit</label>
        <Input
          {...register('unit', { required: 'Unit is required' })}
          className="mt-1"
        />
        {errors.unit && (
          <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Minimum Stock Level
        </label>
        <Input
          type="number"
          step="0.01"
          {...register('minStock', {
            min: { value: 0, message: 'Min stock must be positive' },
          })}
          className="mt-1"
        />
        {errors.minStock && (
          <p className="mt-1 text-sm text-red-600">{errors.minStock.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Ingredient'}
      </Button>
    </form>
  );
}