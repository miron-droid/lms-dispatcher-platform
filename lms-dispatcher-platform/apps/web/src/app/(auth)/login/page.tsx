'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useLang } from '@/lib/i18n/lang-context';
import { LogoIcon } from '@/components/domain/logo';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();
  const { t } = useLang();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { accessToken, user } = await authApi.login(email, password);
      setAuth(user, accessToken);
      // Fetch enriched profile (XP/streak/level/achievements) from /auth/me
      try {
        const fullUser = await authApi.me();
        setUser(fullUser);
      } catch {
        /* ignore — base user is fine */
      }
      if (user.role === 'ADMIN' || user.role === 'MANAGER') router.replace('/manager');
      else router.replace('/learn');
    } catch (err: any) {
      setError(err.message ?? t('auth_login_failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm lg:max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex mb-5 rounded-2xl p-3 bg-white/5 backdrop-blur-sm border border-white/10"
             style={{ filter: 'drop-shadow(0 0 24px rgba(34,197,94,0.2))' }}>
          <LogoIcon size={180} />
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Dispatch<span className="text-emerald-400">GO</span>
        </h1>
        <p className="text-blue-200/80 mt-2 text-sm lg:text-base">{t('auth_title')}</p>
        <p className="text-blue-300/40 mt-1 text-xs tracking-wide">9 chapters · 36 lessons · 100% online</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-6 lg:p-8 shadow-lg space-y-4 animate-fade-in-up">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a6] mb-1">{t('auth_email')}</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a6] mb-1">{t('auth_password')}</label>
          <div className="relative">
            <input
              className="input pr-10"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#636366] hover:text-gray-600 dark:hover:text-[#f5f5f7] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <button className="btn-primary mt-2" type="submit" disabled={loading}>
          {loading ? t('auth_signing_in') : t('auth_sign_in')}
        </button>
      </form>
    </div>
  );
}
