'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, Menu, X, Sun, Moon, BarChart3 } from "lucide-react";
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Logo } from '@/components/domain/logo';
import { useLang } from '@/lib/i18n/lang-context';
import { LangToggle } from '@/components/layout/lang-toggle';
import { useTheme } from '@/lib/theme-context';
import { Providers } from '@/components/providers';

function ManagerShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { lang } = useLang();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.clearAuth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolved, setTheme } = useTheme();
  const NAV = [
    { href: '/manager',       label: lang === 'ru' ? 'Дашборд' : 'Dashboard',  icon: LayoutDashboard, exact: true, badge: 0 },
    { href: '/manager/students', label: lang === 'ru' ? 'Студенты' : 'Students', icon: Users, badge: 0 },
    { href: '/manager/analytics', label: lang === 'ru' ? 'Аналитика' : 'Analytics', icon: BarChart3, badge: 0 },
  ];

  const isActive = (item: typeof NAV[0]) =>
    item.exact ? path === item.href : path.startsWith(item.href);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-black">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 bg-white dark:bg-[#2c2c2e] border-r border-gray-100 dark:border-[rgba(255,255,255,0.06)] z-50 flex-col">
        <div className="px-4 py-4 border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
          <Logo size={52} textSize="md" />
          <p className="text-[10px] text-gray-400 dark:text-[#636366] mt-1 ml-[42px]">Manager Panel</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-3 pt-4">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium cursor-pointer',
                isActive(item) ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 dark:text-[#a1a1a6] hover:bg-gray-50 dark:hover:bg-[#2c2c2e]',
              )}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive(item) ? 2.5 : 1.8} />
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-4 space-y-2">
          <button onClick={() => setTheme(resolved === "dark" ? "light" : "dark")} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-[#a1a1a6] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl w-full cursor-pointer transition-colors">{resolved === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}{resolved === "dark" ? (lang === "ru" ? "Светлая" : "Light") : (lang === "ru" ? "Тёмная" : "Dark")}</button>
          <LangToggle />
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-[#a1a1a6]">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600">
              {user?.firstName?.charAt(0) ?? 'M'}
            </div>
            <span className="flex-1 truncate text-xs">{user?.firstName} {user?.lastName}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl w-full cursor-pointer">
            <LogOut className="w-4 h-4" />
            {lang === 'ru' ? 'Выйти' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md border-b border-gray-100 dark:border-[rgba(255,255,255,0.08)] z-50 h-12 flex items-center px-4 justify-between">
        <Logo size={40} textSize="sm" />
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 cursor-pointer">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-12 bg-white dark:bg-[#2c2c2e] z-40 p-4 space-y-2">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
                isActive(item) ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 dark:text-[#a1a1a6]',
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
            <button onClick={() => setTheme(resolved === "dark" ? "light" : "dark")} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-[#a1a1a6] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl w-full cursor-pointer transition-colors">{resolved === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}{resolved === "dark" ? (lang === "ru" ? "Светлая" : "Light") : (lang === "ru" ? "Тёмная" : "Dark")}</button>
          <LangToggle />
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 text-sm text-red-500 w-full cursor-pointer">
              <LogOut className="w-4 h-4" />
              {lang === 'ru' ? 'Выйти' : 'Logout'}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="lg:ml-56 pt-12 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ManagerShell>{children}</ManagerShell>
    </Providers>
  );
}
