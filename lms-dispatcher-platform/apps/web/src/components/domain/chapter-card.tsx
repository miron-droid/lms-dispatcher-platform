'use client';
import Link from 'next/link';
import { ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChapterProgressItem } from '@/types';
import { useLang } from '@/lib/i18n/lang-context';
import { HIGHWAY_CITIES } from '@/lib/stores/gamification.store';

interface Props { chapter: ChapterProgressItem }

export function ChapterCard({ chapter }: Props) {
  const { t, lang, translateTitle } = useLang();
  const locked = chapter.status === 'LOCKED';
  const done   = chapter.status === 'COMPLETED';
  const active = !locked && !done;
  const pct = chapter.lessonsTotal > 0 ? Math.round((chapter.lessonsCompleted / chapter.lessonsTotal) * 100) : 0;
  const milestone = HIGHWAY_CITIES.find(c => c.chapter === chapter.order);

  return (
    <Link
      href={locked ? '#' : `/learn/chapters/${chapter.id}`}
      className={cn(
        'group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        locked && 'bg-gray-50/50 border-gray-100 dark:border-[rgba(255,255,255,0.06)] opacity-55 pointer-events-none cursor-default',
        done && 'bg-gradient-to-r from-brand-50/40 to-white border-brand-200/60 shadow-card',
        active && 'bg-white dark:bg-[#2c2c2e] border-gray-200/80 shadow-card hover:shadow-card-hover hover:border-brand-300/50 active:scale-[0.99] cursor-pointer',
      )}
    >
      {/* Icon */}
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl transition-transform duration-200',
        'group-hover:scale-105',
        done   && 'bg-brand-100/80',
        active && 'bg-gray-100 dark:bg-[#2c2c2e]',
        locked && 'bg-gray-100 dark:bg-[#2c2c2e]',
      )}>
        {milestone?.emoji ?? '📖'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-gray-400 dark:text-[#636366] uppercase tracking-wider">
            {t('chapter_prefix')} {chapter.order}
          </span>
          {done && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-md font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              {t('chapter_complete')}
            </span>
          )}
          {active && pct > 0 && (
            <span className="text-[10px] font-mono font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-md">
              {pct}%
            </span>
          )}
        </div>

        <p className="font-semibold text-gray-900 dark:text-[#f5f5f7] truncate mt-0.5 text-[15px]">
          {translateTitle(chapter.title)}
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-2.5 mt-2">
          <div className="flex-1 h-1 bg-gray-100 dark:bg-[#2c2c2e] rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500 ease-out',
                done ? 'bg-brand-500' : 'bg-brand-400',
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-gray-400 dark:text-[#636366] shrink-0 tabular-nums">
            {chapter.lessonsCompleted}/{chapter.lessonsTotal}
          </span>
        </div>
      </div>

      {/* Arrow / Lock */}
      {locked ? (
        <Lock className="w-4 h-4 text-gray-300 dark:text-[#636366] shrink-0" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-300 dark:text-[#636366] shrink-0 transition-transform group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}
