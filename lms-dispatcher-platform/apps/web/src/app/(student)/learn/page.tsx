'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { coursesApi } from '@/lib/api/courses';
import { useAuthStore } from '@/lib/stores/auth.store';
import { ChapterCard } from '@/components/domain/chapter-card';
import { ProgressRing } from '@/components/domain/progress-ring';
import { XPBar } from '@/components/domain/xp-bar';
import { HighwayMap } from '@/components/domain/highway-map';
import { useLang } from '@/lib/i18n/lang-context';

const COURSE_ID = 'course-dispatchers-v1';

export default function LearnPage() {
  const user = useAuthStore((s) => s.user);
  const { t, lang } = useLang();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress', COURSE_ID],
    queryFn: () => coursesApi.getProgress(COURSE_ID),
  });

  useEffect(() => {
    if (!progress) coursesApi.initializeCourse(COURSE_ID).catch(() => {});
  }, [progress]);

  if (isLoading) return <CourseSkeleton />;

  const overallPct = progress?.overallPercent ?? 0;

  return (
    <div className="px-4 pt-14 lg:pt-6 pb-24 lg:pb-4 max-w-lg lg:max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm text-gray-400 dark:text-[#636366]">
            {t('learn_hello')}, <span className="text-gray-600 dark:text-[#a1a1a6] font-medium">{user?.firstName}</span> 👋
          </p>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-[#f5f5f7] mt-0.5 tracking-tight">
            {t('learn_course_title')}
          </h1>
        </div>
        <ProgressRing percent={overallPct} />
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div className="metric-card">
          <span className="metric-value">{progress?.chapters?.filter(c => c.status === 'COMPLETED').length ?? 0}</span>
          <span className="metric-label">{lang === 'ru' ? 'Глав' : 'Chapters'}</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">
            {progress?.chapters?.reduce((s, c) => s + c.lessonsCompleted, 0) ?? 0}
          </span>
          <span className="metric-label">{lang === 'ru' ? 'Уроков' : 'Lessons'}</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{overallPct}%</span>
          <span className="metric-label">{lang === 'ru' ? 'Прогресс' : 'Progress'}</span>
        </div>
      </div>

      {/* XP + Route */}
      <div className="space-y-3 mb-5">
        <XPBar />
        {progress && <HighwayMap chapters={progress.chapters ?? []} />}
      </div>

      {/* Chapter grid */}
      <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
        {(progress?.chapters ?? []).map((ch) => (
          <ChapterCard key={ch.id} chapter={ch} />
        ))}
      </div>
    </div>
  );
}

function CourseSkeleton() {
  return (
    <div className="px-4 pt-14 lg:pt-6 space-y-3 animate-pulse max-w-lg lg:max-w-5xl mx-auto">
      <div className="h-14 bg-gray-100 dark:bg-[#2c2c2e] rounded-xl" />
      <div className="grid grid-cols-3 gap-2.5">
        {[0,1,2].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-[#2c2c2e] rounded-xl" />)}
      </div>
      <div className="h-10 bg-gray-100 dark:bg-[#2c2c2e] rounded-xl" />
      <div className="h-32 bg-gray-100 dark:bg-[#2c2c2e] rounded-2xl" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 dark:bg-[#2c2c2e] rounded-2xl" />
      ))}
    </div>
  );
}
