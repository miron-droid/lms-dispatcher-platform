'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface CompanyInfo {
  name: string;
  slug: string;
  logoUrl: string | null;
}

interface TenantContextType {
  slug: string | null;
  company: CompanyInfo | null;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType>({ slug: null, company: null, loading: true });

export function useTenant() {
  return useContext(TenantContext);
}

export function getSubdomainFromHost(): string | null {
  if (typeof window === 'undefined') return null;
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  if (parts.length >= 3 && parts[parts.length - 2] === 'dispatchgo') {
    const sub = parts[0];
    return sub === 'www' ? null : sub;
  }
  if (parts.length >= 2 && parts[parts.length - 1].startsWith('localhost')) {
    return parts[0] === 'localhost' ? null : parts[0];
  }
  return null;
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub = getSubdomainFromHost();
    setSlug(sub);

    if (sub) {
      const base = process.env.NEXT_PUBLIC_API_URL ?? '';
      fetch(`${base}/companies/by-slug/${sub}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          setCompany(d?.data ?? d ?? null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <TenantContext.Provider value={{ slug, company, loading }}>
      {children}
    </TenantContext.Provider>
  );
}
