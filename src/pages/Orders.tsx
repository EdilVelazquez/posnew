import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { db } from '../lib/firebase';
import { Button } from '../components/ui/Button';
import { OrderForm } from '../components/orders/OrderForm';
import { OrderCard } from '../components/orders/OrderCard';
import type { Order, Recipe } from '../types';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadOrders();
    loadRecipes();
  }, []);

  async function loadOrders() {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Order[];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders');
    }
  }

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

  async function handleSubmit(data: Partial<Order>) {
    try {
      const items = data.items?.map((item) => {
        const recipe = recipes.find((r) => r.id === item.recipeId);
        return {
          ...item,
          price: recipe?.price || 0,
          subtotal: (recipe?.price || 0) * (item.quantity || 0),
        };
      });

      const total = items?.reduce((sum, item) => sum + item.subtotal, 0) || 0;

      const orderData = {
        ...data,
        items,
        total,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: 'current-user-id', // Replace with actual user ID from auth
      };

      await addDoc(collection(db, 'orders'), orderData);
      setIsFormOpen(false);
      loadOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    }
  }

  async function handleUpdateStatus(id: string, status: Order['status']) {
    try {
      await updateDoc(doc(db, 'orders', id), {
        status,
        updatedAt: serverTimestamp(),
      });
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  }

  function handlePrint(order: Order) {
    const doc = new jsPDF();
    const lineHeight = 10;
    let y = 20;

    // Header
    doc.setFontSize(20);
    doc.text('Order Receipt', 20, y);
    y += lineHeight * 2;

    // Order details
    doc.setFontSize(12);
    doc.text(`Table: ${order.tableNumber}`, 20, y);
    y += lineHeight;
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, y);
    y += lineHeight;
    doc.text(`Status: ${order.status}`, 20, y);
    y += lineHeight * 1.5;

    // Items
    doc.text('Items:', 20, y);
    y += lineHeight;
    order.items.forEach((item) => {
      const recipe = recipes.find((r) => r.id === item.recipeId);
      doc.text(
        `${item.quantity}x ${recipe?.name} - $${item.subtotal.toFixed(2)}`,
        30,
        y
      );
      y += lineHeight;
    });

    // Total
    y += lineHeight * 0.5;
    doc.text(`Total: $${order.total.toFixed(2)}`, 20, y);

    // Save the PDF
    doc.save(`order-${order.id}.pdf`);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="h-5 w-5 mr-2" />
          New Order
        </Button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">New Order</h2>
            <OrderForm
              recipes={recipes}
              onSubmit={handleSubmit}
            />
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            recipes={recipes}
            onUpdateStatus={handleUpdateStatus}
            onPrint={handlePrint}
          />
        ))}
      </div>
    </div>
  );
}