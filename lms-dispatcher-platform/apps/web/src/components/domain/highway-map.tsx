'use client';
import { HIGHWAY_CITIES } from '@/lib/stores/gamification.store';
import { useLang } from '@/lib/i18n/lang-context';
import { cn } from '@/lib/utils';
import type { ChapterProgressItem } from '@/types';

interface Props {
  chapters: ChapterProgressItem[];
}

export function HighwayMap({ chapters }: Props) {
  const { lang } = useLang();
  const total = HIGHWAY_CITIES.length;

  const completedCount = chapters.filter(c => c.status === 'COMPLETED').length;
  const progressPct = Math.round((completedCount / total) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-[#0f172a] to-gray-900 p-4 lg:p-5">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }} />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">
            {lang === 'ru' ? 'Ваш путь' : 'Your Path'}
          </p>
          <p className="text-xs text-gray-500 dark:text-[#a1a1a6] mt-0.5">
            {lang === 'ru' ? 'От новичка до профессионала' : 'From rookie to pro'}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-lg font-bold text-white">{progressPct}<span className="text-xs text-gray-500 dark:text-[#a1a1a6] font-normal">%</span></p>
          </div>
          <div className="relative w-9 h-9">
            <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#1e293b" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="url(#grad)" strokeWidth="3"
                strokeDasharray={`${progressPct} ${100 - progressPct}`} strokeLinecap="round" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-400 dark:text-[#636366]">{completedCount}/{total}</span>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="relative overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex items-start min-w-[640px] lg:min-w-0 gap-0">
          {HIGHWAY_CITIES.map((city, i) => {
            const ch = chapters.find(c => c.order === city.chapter);
            const done = ch?.status === 'COMPLETED';
            const active = ch && ch.status !== 'LOCKED' && ch.status !== 'COMPLETED';
            const locked = !ch || ch.status === 'LOCKED';
            const isLast = i === total - 1;

            return (
              <div key={city.chapter} className="flex items-start flex-1 min-w-0">
                <div className="flex flex-col items-center w-14 flex-shrink-0">
                  {/* Node */}
                  <div className="relative">
                    {active && (
                      <div className="absolute -inset-1.5 rounded-2xl bg-blue-500/15 animate-pulse" />
                    )}
                    <div className={cn(
                      'relative w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all duration-500 z-10',
                      done && 'bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 border border-emerald-500/30 shadow-lg shadow-emerald-500/10',
                      active && 'bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-500/40 shadow-lg shadow-blue-500/10',
                      locked && 'bg-gray-800/40 border border-gray-700/40',
                    )}>
                      {done ? (
                        <span className="text-lg">{city.emoji}</span>
                      ) : active ? (
                        <span className="text-lg">{city.emoji}</span>
                      ) : (
                        <span className="text-xs font-bold text-gray-600 dark:text-[#a1a1a6]">{i + 1}</span>
                      )}
                    </div>
                    {/* Completion badge */}
                    {done && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center z-20">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <p className={cn(
                    'text-[10px] mt-1.5 font-semibold text-center leading-tight',
                    done && 'text-emerald-400/90',
                    active && 'text-blue-400',
                    locked && 'text-gray-600 dark:text-[#a1a1a6]',
                  )}>
                    {lang === 'ru' ? city.nameRu : city.short}
                  </p>
                </div>

                {/* Connector */}
                {!isLast && (
                  <div className="flex-1 flex items-center h-10 min-w-[8px] relative">
                    <div className="w-full h-px bg-gray-700/50" />
                    {done && (
                      <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                        <div className="w-full h-px bg-gradient-to-r from-emerald-500/60 to-emerald-500/30" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="relative flex items-center justify-between mt-3 pt-3 border-t border-gray-800/60">
        <div className="flex items-center gap-3 text-[9px] text-gray-500 dark:text-[#a1a1a6]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {lang === 'ru' ? 'Пройдено' : 'Done'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {lang === 'ru' ? 'Сейчас' : 'Now'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
            {lang === 'ru' ? 'Впереди' : 'Ahead'}
          </span>
        </div>
        <p className="text-[9px] text-gray-600 dark:text-[#a1a1a6] font-mono">{completedCount * 4} / 36 {lang === 'ru' ? 'уроков' : 'lessons'}</p>
      </div>
    </div>
  );
}
