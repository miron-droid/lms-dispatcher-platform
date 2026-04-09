'use client';
import { useEffect, useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n/lang-context';

const COLLAPSE_KEY = 'dispatchgo-how-collapsed-v1';

export function HowItWorksPanel() {
  const { t } = useLang();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(COLLAPSE_KEY);
    if (stored === '1') setOpen(false);
  }, []);

  function toggle() {
    const next = !open;
    setOpen(next);
    localStorage.setItem(COLLAPSE_KEY, next ? '0' : '1');
  }

  const items: Array<{ emoji: string; key: 'how_item_lessons' | 'how_item_quiz' | 'how_item_test' | 'how_item_unlock' }> = [
    { emoji: '📖', key: 'how_item_lessons' },
    { emoji: '❓', key: 'how_item_quiz' },
    { emoji: '🎯', key: 'how_item_test' },
    { emoji: '🔓', key: 'how_item_unlock' },
  ];

  return (
    <div className="mb-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-500/5 overflow-hidden">
      <button
        onClick={toggle}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-[#f5f5f7]">
            {t('how_title')}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-[#a1a1a6] truncate">
            {t('how_subtitle')}
          </p>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 dark:text-[#a1a1a6] transition-transform duration-300 shrink-0',
            open && 'rotate-180',
          )}
        />
      </button>

      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <ul className="px-4 pb-4 pt-1 space-y-2">
            {items.map((it) => (
              <li
                key={it.key}
                className="flex items-start gap-3 text-[13px] leading-relaxed text-gray-700 dark:text-[#d1d1d6]"
              >
                <span className="text-base leading-none mt-0.5">{it.emoji}</span>
                <span>{t(it.key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
