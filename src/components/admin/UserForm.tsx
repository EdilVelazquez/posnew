import React from 'react';
import { useForm } from 'react-hook-form';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { User } from '../../types';

interface UserFormProps {
  user?: User;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export function UserForm({ user, onClose, onSuccess }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: user?.email || '',
      role: user?.role || 'user',
    },
  });

  async function onSubmit(data: FormData) {
    try {
      if (user) {
        // Update existing user
        await updateDoc(doc(db, 'users', user.id), {
          email: data.email,
          role: data.role,
        });
      } else {
        // Create new user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: data.email,
          role: data.role,
          permissions: [],
        });
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="mt-1"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {!user && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <Input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            className="mt-1"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          {...register('role')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}