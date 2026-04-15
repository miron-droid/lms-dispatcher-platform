'use client';
import { useLang } from '@/lib/i18n/lang-context';
import { cn } from '@/lib/utils';

export function LangToggle() {
  const { lang, toggleLang } = useLang();

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-medium text-gray-800 dark:text-[#f5f5f7]">
        {lang === 'ru' ? 'Русский' : 'English'}
      </span>

      <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-[#2c2c2e] rounded-xl p-1">
        {(['en', 'ru'] as const).map((l) => {
          const active = lang === l;
          return (
            <button
              key={l}
              onClick={() => { if (!active) toggleLang(); }}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200',
                active
                  ? 'bg-white dark:bg-[#3a3a3c] text-brand-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-400 dark:text-[#636366] hover:text-gray-600 dark:hover:text-[#f5f5f7]',
              )}
            >
              {l.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
