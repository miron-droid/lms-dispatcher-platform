'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { LangProvider } from '@/lib/i18n/lang-context';
import { ThemeProvider } from '@/lib/theme-context';
import { useAuthStore } from '@/lib/stores/auth.store';
import { authApi } from '@/lib/api/auth';

function AuthBootstrap() {
  const setUser = useAuthStore((s) => s.setUser);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('access_token');
    if (!token) return;
    // Hydrate enriched user (XP/streak/level/achievements) from server
    useAuthStore.setState({ token });
    authApi.me()
      .then((u) => setUser(u))
      .catch(() => { /* token invalid — leave alone, route guards will redirect */ });
  }, [setUser]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
  }));
  return (
    <ThemeProvider>
      <LangProvider>
        <QueryClientProvider client={client}>
          <AuthBootstrap />
          {children}
        </QueryClientProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
