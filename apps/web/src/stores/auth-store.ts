import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  initialize: () => () => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      error: null,

      initialize: () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          });
        });
        return unsubscribe;
      },

      signInWithEmail: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to sign in';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      signUpWithEmail: async (email: string, password: string, name?: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await createUserWithEmailAndPassword(auth, email, password);
          
          if (name && result.user) {
            await updateProfile(result.user, { displayName: name });
          }
          
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to sign up';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to sign in with Google';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true, error: null });
        try {
          await firebaseSignOut(auth);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to sign out';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await sendPasswordResetEmail(auth, email);
          set({ isLoading: false });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to send reset email';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      updateUserProfile: async (displayName?: string, photoURL?: string) => {
        const { user } = get();
        if (!user) throw new Error('No user logged in');
        
        set({ isLoading: true, error: null });
        try {
          await updateProfile(user, { displayName, photoURL });
          set({ user: auth.currentUser, isLoading: false });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to update profile';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Only persist non-sensitive data
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
