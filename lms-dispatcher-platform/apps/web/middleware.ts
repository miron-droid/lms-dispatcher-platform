import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const subdomain = extractSubdomain(host);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-slug', subdomain || '');

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

function extractSubdomain(host: string): string | null {
  const hostname = host.split(':')[0];
  const parts = hostname.split('.');

  if (parts.length >= 3 && parts[parts.length - 2] === 'dispatchgo') {
    const sub = parts[0];
    if (sub === 'www') return null;
    return sub;
  }
  if (parts.length >= 2 && parts[parts.length - 1].startsWith('localhost')) {
    return parts[0] === 'localhost' ? null : parts[0];
  }
  return null;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon-|logo|manifest|sw|cargo|trucks|wikimedia|videos).*)'],
};
