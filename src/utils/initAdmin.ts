import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const ADMIN_EMAIL = 'admin@restaurant.com';
const ADMIN_PASSWORD = 'admin123456';

export async function initializeAdminUser() {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    );

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: ADMIN_EMAIL,
      role: 'admin',
      permissions: [
        { id: 'manage_inventory', name: 'Manage Inventory', enabled: true },
        { id: 'manage_recipes', name: 'Manage Recipes', enabled: true },
        { id: 'manage_orders', name: 'Manage Orders', enabled: true },
        { id: 'view_reports', name: 'View Reports', enabled: true },
      ],
    });

    console.log('Admin user created successfully');
    return {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Admin user already exists');
      return {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      };
    }
    throw error;
  }
}