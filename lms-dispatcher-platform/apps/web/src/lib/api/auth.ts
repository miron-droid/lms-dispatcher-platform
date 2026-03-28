import { apiFetch } from './client';
import type { User } from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ accessToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiFetch<User>('/auth/me'),
};
