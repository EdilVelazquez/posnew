import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => Promise<void>;
}

export function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{recipe.name}</h3>
          <p className="text-sm text-gray-500">{recipe.category}</p>
        </div>
        <p className="text-lg font-bold">${recipe.price.toFixed(2)}</p>
      </div>

      {recipe.description && (
        <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
      )}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredients:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(recipe)}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(recipe.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}