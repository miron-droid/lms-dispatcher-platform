import { LangProvider } from '@/lib/i18n/lang-context';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-dark via-[#0c1524] to-surface-dark px-4 relative overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        {/* Glow orbs */}
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-brand-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10">{children}</div>
      </div>
    </LangProvider>
  );
}
