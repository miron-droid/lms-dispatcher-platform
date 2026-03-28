import { create } from 'zustand';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') localStorage.setItem('access_token', token);
    set({ user, token });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('access_token');
    set({ user: null, token: null });
  },

  isAuthenticated: () => !!get().token,
}));
