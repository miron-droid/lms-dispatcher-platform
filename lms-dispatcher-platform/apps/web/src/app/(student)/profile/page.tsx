'use client';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';
import { LangToggle } from '@/components/layout/lang-toggle';

export default function ProfilePage() {
  const user      = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router    = useRouter();
  const { t } = useLang();

  function logout() {
    clearAuth();
    router.replace('/login');
  }

  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 lg:px-6 pt-14 lg:pt-6 pb-24 lg:pb-4">
      <h1 className="text-xl lg:text-2xl font-bold mb-6">{t('profile_title')}</h1>

      <div className="card flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center">
          <User className="w-7 h-7 text-brand-600" />
        </div>
        <div>
          <p className="font-bold">{user?.firstName} {user?.lastName}</p>
          <p className="text-sm text-gray-500 dark:text-[#a1a1a6] truncate">{user?.email}</p>
          <span className="text-xs bg-gray-100 dark:bg-[#2c2c2e] text-gray-600 dark:text-[#a1a1a6] px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
            {user?.role}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 dark:text-[#636366] uppercase tracking-wide mb-2 px-1">
          {t('profile_language')}
        </p>
        <LangToggle />
      </div>

      <button
        onClick={logout}
        className="card w-full flex items-center gap-3 text-red-500 active:bg-red-50"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">{t('profile_sign_out')}</span>
      </button>
    </div>
  );
}
