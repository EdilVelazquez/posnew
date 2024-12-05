import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FileDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { exportToExcel } from '../../utils/exportUtils';
import type { Ingredient } from '../../types';

export function InventoryReport() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInventoryData();
  }, []);

  async function loadInventoryData() {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'ingredients'));
      const ingredientsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ingredient[];
      setIngredients(ingredientsData);
    } catch (error) {
      console.error('Error loading inventory data:', error);
      alert('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  }

  const lowStockItems = ingredients.filter(
    (item) => item.minStock && item.currentStock < item.minStock
  );

  const handleExport = () => {
    const data = ingredients.map((item) => ({
      'Name': item.name,
      'Current Stock': item.currentStock,
      'Unit': item.unit,
      'Min Stock': item.minStock || 'N/A',
      'Status': item.minStock && item.currentStock < item.minStock ? 'Low Stock' : 'OK',
    }));

    exportToExcel(data, 'inventory_report');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Inventory Overview</h2>
          <Button onClick={handleExport}>
            <FileDown className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600 mb-2">Total Items</h3>
            <p className="text-2xl font-bold">{ingredients.length}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-600 mb-2">Low Stock Items</h3>
            <p className="text-2xl font-bold">{lowStockItems.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ingredients.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.currentStock} {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.minStock || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.minStock && item.currentStock < item.minStock ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}