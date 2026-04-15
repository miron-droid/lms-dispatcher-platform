import { create } from 'zustand';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

// Keys that are cleared on logout to prevent cross-user data leaks on shared devices.
const APP_STORAGE_KEYS = [
  'access_token',
  'lms_gamification',
  'daily-exam-results',
  'dispatchgo-tour-seen-v1',
  'dispatchgo-how-collapsed-v1',
];

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') localStorage.setItem('access_token', token);
    set({ user, token });
  },

  setUser: (user) => set({ user }),

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      for (const key of APP_STORAGE_KEYS) {
        try { localStorage.removeItem(key); } catch {}
      }
    }
    set({ user: null, token: null });
  },

  isAuthenticated: () => !!get().token,
}));
