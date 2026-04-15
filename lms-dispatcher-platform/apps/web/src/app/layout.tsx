import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DispatchGO — Dispatcher Training',
  description: 'From zero to first deal — dispatcher training platform',
  manifest: '/manifest.json',
  appleWebApp: { statusBarStyle: 'default', title: 'DispatchGO' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#2563eb',
};

// Inline script runs before paint to apply theme & language from localStorage,
// eliminating FOUC (flash of light theme / flash of English).
const NO_FOUC_SCRIPT = `(function(){
  try {
    var theme = localStorage.getItem('lms-theme');
    var dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (theme == null) dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
    var lang = localStorage.getItem('lms-lang');
    if (lang === 'ru' || lang === 'en') document.documentElement.lang = lang;
  } catch(e) {}
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script dangerouslySetInnerHTML={{ __html: NO_FOUC_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
