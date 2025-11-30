import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  auth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from '../lib/firebaseClient';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const actionCodeSettings = useMemo(
    () => ({
      url: `${import.meta.env.VITE_APP_URL}/auth/confirm`,
      handleCodeInApp: true,
    }),
    []
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ?? null);
      setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  const signUpWithEmailPassword = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user, actionCodeSettings);
    // force verify before use
    await firebaseSignOut(auth);
    return cred.user;
  };

  const signInWithEmailPassword = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
      await sendEmailVerification(cred.user, actionCodeSettings);
      await firebaseSignOut(auth);
      const err = new Error('EMAIL_NOT_VERIFIED');
      err.code = 'EMAIL_NOT_VERIFIED';
      throw err;
    }
    return cred.user;
  };

  const resendVerification = async () => {
    if (!auth.currentUser) throw new Error('No user session');
    await sendEmailVerification(auth.currentUser, actionCodeSettings);
  };

  const sendPasswordReset = async (email) => {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  };

  const signInWithMagicLink = async (email) => {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('authEmailForSignIn', email);
  };

  const completeMagicLinkSignIn = async (email, url) => {
    if (!isSignInWithEmailLink(auth, url)) throw new Error('Invalid email link');
    await signInWithEmailLink(auth, email, url);
    window.localStorage.removeItem('authEmailForSignIn');
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      initializing,
      signUpWithEmailPassword,
      signInWithEmailPassword,
      resendVerification,
      sendPasswordReset,
      signInWithMagicLink,
      completeMagicLinkSignIn,
      signOut,
    }),
    [user, initializing, actionCodeSettings]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
