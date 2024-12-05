import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { User, Permission } from '../../types';

const DEFAULT_PERMISSIONS: Permission[] = [
  { id: 'manage_inventory', name: 'Manage Inventory', enabled: false },
  { id: 'manage_recipes', name: 'Manage Recipes', enabled: false },
  { id: 'manage_orders', name: 'Manage Orders', enabled: false },
  { id: 'view_reports', name: 'View Reports', enabled: false },
];

export function PermissionSettings() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users');
    }
  }

  async function handlePermissionChange(
    userId: string,
    permissionId: string,
    enabled: boolean
  ) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const updatedPermissions = user.permissions || DEFAULT_PERMISSIONS;
    const permissionIndex = updatedPermissions.findIndex((p) => p.id === permissionId);

    if (permissionIndex >= 0) {
      updatedPermissions[permissionIndex].enabled = enabled;
    } else {
      updatedPermissions.push({
        id: permissionId,
        name: DEFAULT_PERMISSIONS.find((p) => p.id === permissionId)?.name || '',
        enabled,
      });
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        permissions: updatedPermissions,
      });
      loadUsers();
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert('Failed to update permissions');
    }
  }

  const selectedUserData = users.find((u) => u.id === selectedUser);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Permission Settings</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select User</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

      {selectedUserData && (
        <div className="space-y-4">
          {DEFAULT_PERMISSIONS.map((permission) => {
            const userPermission = selectedUserData.permissions?.find(
              (p) => p.id === permission.id
            );
            const enabled = userPermission?.enabled || false;

            return (
              <div key={permission.id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {permission.name}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      handlePermissionChange(
                        selectedUserData.id,
                        permission.id,
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}