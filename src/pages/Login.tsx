import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { initializeAdminUser } from '../utils/initAdmin';
import type { User } from '../types';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data() as Omit<User, 'id'>;

      setUser({
        id: userCredential.user.uid,
        ...userData,
      });

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid email or password');
    }
  };

  const handleInitAdmin = async () => {
    setIsInitializing(true);
    try {
      const adminCreds = await initializeAdminUser();
      alert(`Admin user created successfully!\n\nEmail: ${adminCreds.email}\nPassword: ${adminCreds.password}\n\nPlease save these credentials and login.`);
    } catch (error) {
      console.error('Error initializing admin:', error);
      alert('Failed to initialize admin user');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Restaurant POS Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-600 mb-4">First time setup?</p>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleInitAdmin}
            disabled={isInitializing}
          >
            {isInitializing ? 'Creating Admin...' : 'Initialize Admin User'}
          </Button>
        </div>
      </div>
    </div>
  );
}