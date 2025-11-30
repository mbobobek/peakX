import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  applyActionCode,
  confirmPasswordReset,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  throw new Error('Firebase environment variables are required');
}

// Initialize once
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  applyActionCode,
  confirmPasswordReset,
  GoogleAuthProvider,
  signInWithPopup,
  googleProvider,
  signOut,
};
