import React, { useState } from 'react';
import { UserList } from '../components/admin/UserList';
import { UserForm } from '../components/admin/UserForm';
import { PermissionSettings } from '../components/admin/PermissionSettings';
import { Button } from '../components/ui/Button';
import { UserPlus } from 'lucide-react';

export default function AdminPanel() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <UserForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <UserList />
        <PermissionSettings />
      </div>
    </div>
  );
}