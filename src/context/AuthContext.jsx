import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  auth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  applyActionCode,
  confirmPasswordReset,
  googleProvider,
  signInWithPopup,
} from '../lib/firebaseClient';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // ACTION CODE SETTINGS (universal)
  const verifyActionCodeSettings = useMemo(
    () => ({
      url: `${import.meta.env.VITE_APP_URL}/auth/confirm`,
      handleCodeInApp: true,
    }),
    []
  );
  const resetActionCodeSettings = useMemo(
    () => ({
      url: 'https://peak-x.vercel.app/auth/reset-password',
      handleCodeInApp: true,
    }),
    []
  );

  // LISTEN USER SESSION
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ?? null);
      setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  // SIGN UP (EMAIL + PASSWORD)
  const signUpWithEmailPassword = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user, verifyActionCodeSettings);

    // MUST VERIFY BEFORE LOGIN
    await firebaseSignOut(auth);

    return { user: cred.user, needsVerify: true };
  };

  // LOGIN (EMAIL + PASSWORD)
  const signInWithEmailPassword = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    if (!cred.user.emailVerified) {
      await sendEmailVerification(cred.user, verifyActionCodeSettings);
      await firebaseSignOut(auth);

      const err = new Error('EMAIL_NOT_VERIFIED');
      err.code = 'EMAIL_NOT_VERIFIED';
      throw err;
    }

    return cred.user;
  };

  // RESEND VERIFICATION
  const resendVerification = async () => {
    if (!auth.currentUser) throw new Error("No user session");
    await sendEmailVerification(auth.currentUser, verifyActionCodeSettings);
  };

  // PASSWORD RESET (SEND LINK)
  const sendPasswordReset = async (email) => {
    await sendPasswordResetEmail(auth, email, resetActionCodeSettings);
  };

  // GOOGLE SIGN-IN
  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  };

  // ACTION CODE HANDLER (VERIFY EMAIL, RESET PASSWORD, CHANGE EMAIL)
  const handleActionCode = async (mode, oobCode, newPassword = null) => {
    switch (mode) {
      case 'verifyEmail':
        await applyActionCode(auth, oobCode);
        return 'EMAIL_VERIFIED';
      case 'verifyAndChangeEmail':
        await applyActionCode(auth, oobCode);
        return 'EMAIL_CHANGED';
      case 'resetPassword':
        if (!newPassword) return 'NEED_NEW_PASSWORD';
        await confirmPasswordReset(auth, oobCode, newPassword);
        return 'PASSWORD_RESET';

      default:
        throw new Error('Unknown mode');
    }
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
      signInWithGoogle,
      handleActionCode,
      signOut,
    }),
    [user, initializing, verifyActionCodeSettings, resetActionCodeSettings]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
