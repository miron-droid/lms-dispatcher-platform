'use client';
import { useQuery } from '@tanstack/react-query';
import { Flame, Trophy } from 'lucide-react';
import { coursesApi } from '@/lib/api/courses';
import { useGamification, LEVELS } from '@/lib/stores/gamification.store';
import { useLang } from '@/lib/i18n/lang-context';
import { cn } from '@/lib/utils';

const COURSE_ID = 'course-dispatchers-v1';

export function StatsHeader() {
  const { t, lang } = useLang();
  const { totalXP, streak, getLevel } = useGamification();
  const level = getLevel();

  const { data: progress } = useQuery({
    queryKey: ['progress', COURSE_ID],
    queryFn: () => coursesApi.getProgress(COURSE_ID),
    staleTime: 30_000,
  });

  // Next level calculation
  const currentIdx = LEVELS.findIndex((l) => l.name === level.name);
  const nextLevel = currentIdx >= 0 && currentIdx < LEVELS.length - 1 ? LEVELS[currentIdx + 1] : null;
  const levelMin = level.minXP;
  const levelMax = nextLevel ? nextLevel.minXP : level.minXP;
  const xpInLevel = Math.max(0, totalXP - levelMin);
  const xpSpan = Math.max(1, levelMax - levelMin);
  const pct = nextLevel ? Math.min(100, Math.round((xpInLevel / xpSpan) * 100)) : 100;

  const chapters = progress?.chapters ?? [];
  const chaptersDone = chapters.filter((c) => c.status === 'COMPLETED').length;
  const chaptersTotal = chapters.length || 9;

  return (
    <div className="mb-4 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1c1c1e] p-3 lg:p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Level emoji + name */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-500/15 dark:to-emerald-500/5 flex items-center justify-center text-xl shrink-0">
            {level.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#636366]">
              {t('stats_your_level')}
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-[#f5f5f7] truncate">
              {lang === 'ru' ? level.nameRu : level.name}
            </p>
          </div>
        </div>

        {/* Streak + Chapters (desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-bold text-orange-700 dark:text-orange-300 tabular-nums">{streak}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
            <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
              {chaptersDone}/{chaptersTotal}
            </span>
          </div>
        </div>
      </div>

      {/* XP progress bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-gray-500 dark:text-[#a1a1a6] tabular-nums">
            {totalXP.toLocaleString()} XP
          </span>
          <span className="text-[10px] text-gray-400 dark:text-[#636366] tabular-nums">
            {nextLevel
              ? `${xpInLevel}/${xpSpan} → ${lang === 'ru' ? nextLevel.nameRu : nextLevel.name}`
              : t('stats_max_level')}
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 ease-out',
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Mobile: streak + chapters below bar */}
      <div className="sm:hidden flex items-center gap-2 mt-3">
        <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-[11px] font-semibold text-orange-700 dark:text-orange-300">
            {streak} {t('stats_streak')}
          </span>
        </div>
        <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
          <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 tabular-nums">
            {chaptersDone}/{chaptersTotal} {t('stats_chapters')}
          </span>
        </div>
      </div>
    </div>
  );
}
