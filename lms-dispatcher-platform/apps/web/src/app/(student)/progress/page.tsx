'use client';
import { useGamification, LEVELS, ACHIEVEMENTS, HIGHWAY_CITIES } from '@/lib/stores/gamification.store';
import { useLang } from '@/lib/i18n/lang-context';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api/courses';
import { HighwayMap } from '@/components/domain/highway-map';

const COURSE_ID = 'course-dispatchers-v1';

export default function ProgressPage() {
  const { lang } = useLang();
  const g = useGamification();
  const level = g.getLevel();
  const levelProgress = g.getLevelProgress();
  const idx = LEVELS.indexOf(level);
  const next = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;

  const { data } = useQuery({
    queryKey: ['progress', COURSE_ID],
    queryFn: () => coursesApi.getProgress(COURSE_ID),
  });

  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 lg:px-6 pt-6 pb-8">
      {/* Header */}
      <h1 className="text-xl lg:text-2xl font-bold mb-6">
        {lang === 'ru' ? 'Мой прогресс' : 'My Progress'}
      </h1>

      {/* Level card */}
      <div className="card p-5 mb-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{level.emoji}</span>
          <div className="flex-1">
            <p className="text-xl font-bold">{lang === 'ru' ? level.nameRu : level.name}</p>
            <p className="text-gray-400 dark:text-[#636366] text-sm">{g.totalXP.toLocaleString()} XP</p>
          </div>
          {g.streak > 0 && (
            <div className="bg-orange-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-orange-400">{g.streak}</span>
            </div>
          )}
        </div>
        {next && (
          <div>
            <div className="flex justify-between text-xs text-gray-400 dark:text-[#636366] mb-1.5">
              <span>{lang === 'ru' ? 'Следующий' : 'Next'}: {lang === 'ru' ? next.nameRu : next.name}</span>
              <span>{g.totalXP}/{next.minXP} XP</span>
            </div>
            <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-[#f5f5f7]">{g.totalLessons}</p>
          <p className="text-xs text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'уроков' : 'lessons'}</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-[#f5f5f7]">{g.streak}</p>
          <p className="text-xs text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'дней подряд' : 'day streak'}</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-[#f5f5f7]">{g.unlockedAchievements.length}</p>
          <p className="text-xs text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'достижений' : 'badges'}</p>
        </div>
      </div>

      {/* Highway map */}
      {data && <div className="mb-4"><HighwayMap chapters={data.chapters ?? []} /></div>}

      {/* Achievements */}
      <div className="mb-2">
        <h2 className="text-lg font-bold mb-3">
          {lang === 'ru' ? 'Достижения' : 'Achievements'}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = g.unlockedAchievements.includes(a.id);
            return (
              <div
                key={a.id}
                className={`card p-3 flex items-start gap-3 transition-all ${
                  unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200'
                    : 'opacity-40 grayscale'
                }`}
              >
                <span className="text-2xl">{a.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-[#f5f5f7] truncate">
                    {lang === 'ru' ? a.nameRu : a.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-[#a1a1a6] leading-tight">
                    {lang === 'ru' ? a.descRu : a.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Levels ladder */}
      <div>
        <h2 className="text-lg font-bold mb-3 mt-6">
          {lang === 'ru' ? 'Уровни' : 'Levels'}
        </h2>
        <div className="space-y-2">
          {LEVELS.map((l, i) => {
            const reached = g.totalXP >= l.minXP;
            const isCurrent = l === level;
            return (
              <div
                key={i}
                className={`card p-3 flex items-center gap-3 ${
                  isCurrent
                    ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-200'
                    : reached
                    ? 'border-green-200 bg-green-50/30'
                    : 'opacity-50'
                }`}
              >
                <span className="text-xl">{l.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{lang === 'ru' ? l.nameRu : l.name}</p>
                  <p className="text-xs text-gray-400 dark:text-[#636366]">{l.minXP.toLocaleString()} XP</p>
                </div>
                {reached && <span className="text-green-500 text-sm">✓</span>}
                {isCurrent && (
                  <span className="text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full font-medium">
                    {lang === 'ru' ? 'сейчас' : 'current'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
