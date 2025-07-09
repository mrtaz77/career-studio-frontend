// /* eslint-disable prettier/prettier */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useToast } from '@/components/ui/use-toast';
import { auth } from '@/lib/firebase';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!;

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  signup: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const dispatch = useDispatch();

  // ────────────────────────────────────────────────────────────────────────
  // 1) SIGNUP
  // ────────────────────────────────────────────────────────────────────────
  const signup = async (email: string, password: string, name: string) => {
    try {
      // A) Firebase signup
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // B) Set displayName in Firebase
      await updateProfile(cred.user, { displayName: name });

      // C) Grab the JWT
      const idToken = await cred.user.getIdToken(false);

      // D) Call your backend /api/v1/auth/signup
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        // docs show no request‐body for signup
        // if you ever add fields, JSON.stringify({ name, email })
      });
      // console.log('res', res);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Signup failed on the backend');
      }
      const { username, message } = await res.json();

      // E) Dispatch into Redux if you like
      dispatch(
        addUser({
          uid: cred.user.uid,
          email: cred.user.email!,
          name: cred.user.displayName!,
          photoURL: cred.user.photoURL,
          username,
        })
      );

      toast({
        title: 'Account created',
        description: message || 'Your account was created.',
        variant: 'default',
      });
    } catch (_error: unknown) {
      toast({
        title: 'Error creating account',

        description: _error instanceof Error ? _error.message : 'Failed to create Account.',
        variant: 'destructive',
      });
      return Promise.reject(_error);
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // 2) LOGIN
  // ────────────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    try {
      // A) Firebase login
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // B) Grab the JWT
      const idToken = await cred.user.getIdToken();

      // C) Call your backend /api/v1/auth/signin
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Login failed on the backend');
      }
      const { message } = await res.json();

      // D) Dispatch / toast
      dispatch(
        addUser({
          uid: cred.user.uid,
          email: cred.user.email!,
          name: cred.user.displayName!,
          photoURL: cred.user.photoURL,
        })
      );
      toast({
        title: 'Welcome back!',
        description: message || 'You are signed in.',
        variant: 'default',
      });
    } catch (_error: unknown) {
      toast({
        title: 'Authentication failed',
        description: _error instanceof Error ? _error.message : 'Failed to sign in.',
        variant: 'destructive',
      });
      return Promise.reject(_error);
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // 3) GOOGLE SIGN-IN
  // ────────────────────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // hit the /signin endpoint (which also creates if new)
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Google backend signin failed');
      }
      const { message, username } = await res.json();

      dispatch(
        addUser({
          uid: result.user.uid,
          email: result.user.email!,
          name: result.user.displayName!,
          photoURL: result.user.photoURL,
          username,
        })
      );
      toast({ title: 'Welcome!', description: message, variant: 'default' });
    } catch (_error: unknown) {
      toast({
        title: 'Authentication failed',
        description: _error instanceof Error ? _error.message : 'Failed to sign in.',
        variant: 'destructive',
      });
      return Promise.reject(_error);
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // 4) FACEBOOK SIGN-IN
  // ────────────────────────────────────────────────────────────────────────
  const loginWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(false);

      const res = await fetch(`${API_BASE_URL}/api/v1/auth/signin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Facebook backend signin failed');
      }
      const { message, username } = await res.json();

      dispatch(
        addUser({
          uid: result.user.uid,
          email: result.user.email!,
          name: result.user.displayName!,
          photoURL: result.user.photoURL,
          username,
        })
      );
      toast({ title: 'Welcome!', description: message, variant: 'default' });
    } catch (_error: unknown) {
      toast({
        title: 'Authentication failed',
        description: _error instanceof Error ? _error.message : 'Failed to sign in.',
        variant: 'destructive',
      });
      return Promise.reject(_error);
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // 5) LOGOUT
  // ────────────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Signed out', variant: 'default' });
      return Promise.resolve();
    } catch (_error: unknown) {
      toast({
        title: 'Error signing out',
        description: _error instanceof Error ? _error.message : 'Failed to sign out.',
        variant: 'destructive',
      });
      return Promise.reject(_error);
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // 6) MONITOR FIREBASE AUTH STATE
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
