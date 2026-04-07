'use client';
import { useGamification, LEVELS } from '@/lib/stores/gamification.store';
import { useLang } from '@/lib/i18n/lang-context';
import { Zap, Flame } from 'lucide-react';

export function XPBar() {
  const { totalXP, getLevel, getLevelProgress, streak } = useGamification();
  const { lang } = useLang();
  const level = getLevel();
  const progress = getLevelProgress();
  const idx = LEVELS.indexOf(level);
  const next = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;

  return (
    <div className="card p-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center text-xl">
            {level.emoji}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-[#f5f5f7]">
              {lang === 'ru' ? level.nameRu : level.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-0.5 text-[11px] font-mono font-semibold text-amber-600">
                <Zap className="w-3 h-3" />
                {totalXP.toLocaleString()}
              </span>
              {streak > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-orange-500">
                  <Flame className="w-3 h-3" />
                  {streak}
                </span>
              )}
            </div>
          </div>
        </div>
        {next && (
          <div className="text-right">
            <p className="text-[9px] font-medium text-gray-400 dark:text-[#636366] uppercase tracking-wider">
              {lang === 'ru' ? 'Следующий' : 'Next'}
            </p>
            <p className="text-xs font-semibold text-gray-500 dark:text-[#a1a1a6]">{lang === 'ru' ? next.nameRu : next.name}</p>
          </div>
        )}
      </div>

      {next && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-gray-400 dark:text-[#636366]">{level.minXP} XP</span>
            <span className="text-[10px] font-mono text-gray-400 dark:text-[#636366]">{next.minXP} XP</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-[#2c2c2e] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
