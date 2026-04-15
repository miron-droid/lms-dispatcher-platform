const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

function clearAuthOn401() {
  if (typeof window === 'undefined') return;
  try {
    // Local redirect on 401 so users don't see broken 401-only UIs
    const path = window.location.pathname;
    if (!path.startsWith('/login')) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
  } catch {}
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Safely parse body — tolerate empty/non-JSON responses
  const text = await res.text();
  let json: any = null;
  if (text) {
    try { json = JSON.parse(text); } catch { json = { message: text }; }
  }

  if (!res.ok) {
    if (res.status === 401) clearAuthOn401();
    const msg = Array.isArray(json?.message) ? json.message.join(', ') : (json?.message ?? `HTTP ${res.status}`);
    throw new Error(msg);
  }

  return (json?.data ?? json) as T;
}
