import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { Button } from '../components/ui/Button';
import { RecipeForm } from '../components/recipes/RecipeForm';
import { RecipeCard } from '../components/recipes/RecipeCard';
import type { Recipe } from '../types';

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Recipe[];
      setRecipes(recipesData);
    } catch (error) {
      console.error('Error loading recipes:', error);
      alert('Failed to load recipes');
    }
  }

  async function handleSubmit(data: Partial<Recipe>) {
    try {
      if (editingRecipe) {
        await updateDoc(doc(db, 'recipes', editingRecipe.id), data);
      } else {
        await addDoc(collection(db, 'recipes'), data);
      }
      setIsFormOpen(false);
      setEditingRecipe(null);
      loadRecipes();
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      await deleteDoc(doc(db, 'recipes', id));
      loadRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe');
    }
  }

  function handleEdit(recipe: Recipe) {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Recipes</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Recipe
        </Button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingRecipe ? 'Edit Recipe' : 'New Recipe'}
            </h2>
            <RecipeForm
              onSubmit={handleSubmit}
              defaultValues={editingRecipe || undefined}
            />
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => {
                setIsFormOpen(false);
                setEditingRecipe(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}