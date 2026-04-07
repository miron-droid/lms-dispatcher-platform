'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { LangProvider } from '@/lib/i18n/lang-context';
import { ThemeProvider } from '@/lib/theme-context';

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
  }));
  return (
    <ThemeProvider>
      <LangProvider>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
