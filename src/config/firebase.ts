import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string
};

// Validation for development
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn('⚠️ Firebase configuration incomplete!');
  console.warn('📝 Please check your .env file in the project root');
  console.warn('📋 Required: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc.');
}

// Initialize Firebase
let app: any;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log('✅ Firebase initialized successfully!');
  console.log('📊 Project ID:', firebaseConfig.projectId);
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  console.error('Please check your Firebase configuration');
  db = null;
  auth = null;
}

export { db, auth };