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
import { InventoryList } from '../components/inventory/InventoryList';
import { InventoryForm } from '../components/inventory/InventoryForm';
import type { Ingredient } from '../types';

export default function Inventory() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  useEffect(() => {
    loadIngredients();
  }, []);

  async function loadIngredients() {
    try {
      const querySnapshot = await getDocs(collection(db, 'ingredients'));
      const ingredientsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ingredient[];
      setIngredients(ingredientsData);
    } catch (error) {
      console.error('Error loading ingredients:', error);
      alert('Failed to load ingredients');
    }
  }

  async function handleSubmit(data: Partial<Ingredient>) {
    try {
      if (editingIngredient) {
        await updateDoc(doc(db, 'ingredients', editingIngredient.id), data);
      } else {
        await addDoc(collection(db, 'ingredients'), data);
      }
      setIsFormOpen(false);
      setEditingIngredient(null);
      loadIngredients();
    } catch (error) {
      console.error('Error saving ingredient:', error);
      alert('Failed to save ingredient');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this ingredient?')) return;
    
    try {
      await deleteDoc(doc(db, 'ingredients', id));
      loadIngredients();
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      alert('Failed to delete ingredient');
    }
  }

  function handleEdit(ingredient: Ingredient) {
    setEditingIngredient(ingredient);
    setIsFormOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Inventory Management</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Ingredient
        </Button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingIngredient ? 'Edit Ingredient' : 'New Ingredient'}
            </h2>
            <InventoryForm
              onSubmit={handleSubmit}
              defaultValues={editingIngredient || undefined}
            />
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => {
                setIsFormOpen(false);
                setEditingIngredient(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <InventoryList
          ingredients={ingredients}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}