'use client';
import { useEffect } from 'react';
import { useGamification } from '@/lib/stores/gamification.store';

export function XPToast() {
  const { pendingToast, dismissToast } = useGamification();

  useEffect(() => {
    if (!pendingToast) return;
    const t = setTimeout(dismissToast, 3000);
    return () => clearTimeout(t);
  }, [pendingToast, dismissToast]);

  if (!pendingToast) return null;

  return (
    <div className="fixed top-6 right-4 lg:right-8 z-[90] animate-fade-in-up">
      <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-lg border border-gray-100 dark:border-[rgba(255,255,255,0.06)] px-4 py-3 flex items-center gap-3 min-w-[200px]">
        <span className="text-2xl">{pendingToast.emoji}</span>
        <div>
          <p className="font-bold text-sm text-gray-900 dark:text-[#f5f5f7]">{pendingToast.title}</p>
          <p className="text-xs text-gray-500 dark:text-[#a1a1a6]">{pendingToast.subtitle}</p>
        </div>
      </div>
    </div>
  );
}
