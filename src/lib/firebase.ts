import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDHk5j75Gz0sfDuzB3mk2C3PFQEm0cieKc",
  authDomain: "puntodeventa-7d104.firebaseapp.com",
  projectId: "puntodeventa-7d104",
  storageBucket: "puntodeventa-7d104.firebasestorage.app",
  messagingSenderId: "985448819655",
  appId: "1:985448819655:web:d215fdfd18cf72b30947e2",
  measurementId: "G-JEJX8NFCCN"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);