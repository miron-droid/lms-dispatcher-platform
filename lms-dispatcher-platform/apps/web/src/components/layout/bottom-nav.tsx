'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, BarChart2, GraduationCap, User, BookText, Monitor, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n/lang-context';
import { useTheme } from '@/lib/theme-context';
import { useGamification, LEVELS } from '@/lib/stores/gamification.store';
import { Logo } from '@/components/domain/logo';
import { useTenant } from '@/lib/tenant-context';
import { LangToggle } from '@/components/layout/lang-toggle';
import { useState, useEffect, useRef } from 'react';

export function BottomNav() {
  const path = usePathname();
  const { t, lang } = useLang();
  const { company: tenantCompany } = useTenant();
  const { resolved, setTheme } = useTheme();
  const { totalXP, streak, getLevel } = useGamification();
  const level = getLevel();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 60);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const NAV = [
    { href: '/learn',    label: t('nav_course'),    icon: BookOpen },
    { href: '/progress', label: t('nav_progress'),  icon: BarChart2 },
    { href: '/glossary', label: t('nav_glossary'),   icon: BookText },
    { href: '/exams',    label: t('nav_exams'),     icon: GraduationCap },
    { href: '/platform', label: t('nav_platform'),  icon: Monitor },
    { href: '/profile',  label: t('nav_profile'),   icon: User },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 bg-white dark:bg-[#2c2c2e] border-r border-gray-100 dark:border-[rgba(255,255,255,0.06)] z-50 flex-col">
        {/* Brand header */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
          <Link href="/learn">
            <Logo size={52} textSize="md" />
            {tenantCompany && <p className="text-[10px] text-gray-400 dark:text-[#636366] mt-0.5 ml-[42px]">{tenantCompany.name}</p>}
          </Link>
        </div>

        {/* Level badge */}
        <div className="px-4 pt-4 pb-2">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#2c2c2e] dark:to-[#3a3a3c] rounded-xl px-3 py-2.5 flex items-center gap-2.5">
            <span className="text-xl">{level.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 dark:text-[#a1a1a6] truncate">
                {lang === 'ru' ? level.nameRu : level.name}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-[#636366]">{totalXP} XP{streak > 0 ? ` · 🔥${streak}` : ''}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex-1 flex flex-col gap-1 px-3 pt-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium',
                  active
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-500 dark:text-[#a1a1a6] hover:bg-gray-50 dark:hover:bg-[#2c2c2e] hover:text-gray-700 dark:hover:text-[#f5f5f7]',
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Theme toggle + Footer */}
        <div className="px-4 py-3 border-t border-gray-100 dark:border-[rgba(255,255,255,0.06)] space-y-2">
          <LangToggle />
          <button
            onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium
 text-gray-500 dark:text-[#a1a1a6] hover:bg-gray-50 dark:hover:bg-[#2c2c2e]
 transition-colors duration-200"
            aria-label={resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {resolved === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{resolved === 'dark' ? (lang === 'ru' ? 'Светлая' : 'Light') : (lang === 'ru' ? 'Тёмная' : 'Dark')}</span>
          </button>
          <p className="text-[10px] text-gray-300 dark:text-[#636366] text-center">DispatchGO v1.0</p>
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)] z-50 safe-area-pt">
        <div className="flex items-center justify-between h-12 px-4">
          <Logo size={40} textSize="sm" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg text-gray-500 dark:text-[#a1a1a6] hover:bg-gray-100 dark:hover:bg-[#3a3a3c] transition-colors"
              aria-label={resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {resolved === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1c1c1e] rounded-full px-2.5 py-1">
              <span className="text-xs">{level.emoji}</span>
              <span className="text-[10px] font-semibold text-gray-600 dark:text-[#a1a1a6]">{totalXP} XP</span>
              {streak > 0 && <span className="text-[10px]">🔥{streak}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md border-t border-gray-100 dark:border-[rgba(255,255,255,0.06)] z-50 safe-area-pb transition-transform duration-300",
        hidden && "translate-y-full"
      )}>
        <div className="flex items-center justify-around h-16">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors',
                  active ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-[#636366]',
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
