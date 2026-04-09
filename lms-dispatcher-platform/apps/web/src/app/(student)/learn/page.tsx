'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { coursesApi } from '@/lib/api/courses';
import { useAuthStore } from '@/lib/stores/auth.store';
import { ChapterCard } from '@/components/domain/chapter-card';
import { ProgressRing } from '@/components/domain/progress-ring';
import { HighwayMap } from '@/components/domain/highway-map';
import { OnboardingTour } from '@/components/domain/onboarding-tour';
import { HowItWorksPanel } from '@/components/domain/how-it-works-panel';
import { EmptyStateCard } from '@/components/domain/empty-state-card';
import { StatsHeader } from '@/components/domain/stats-header';
import { ChapterUnlockCelebration } from '@/components/domain/chapter-unlock-celebration';
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

  const chapters = progress?.chapters ?? [];
  const lessonsCompletedTotal = useMemo(
    () => chapters.reduce((s, c) => s + c.lessonsCompleted, 0),
    [chapters],
  );
  const isBrandNew = !isLoading && lessonsCompletedTotal === 0;
  const firstChapter = chapters[0];

  if (isLoading) return <CourseSkeleton />;

  const overallPct = progress?.overallPercent ?? 0;

  return (
    <div className="px-4 pt-14 lg:pt-6 pb-24 lg:pb-4 max-w-lg lg:max-w-5xl mx-auto">
      {/* Onboarding tour (first-time only) */}
      <OnboardingTour />

      {/* Chapter unlock celebration (fires via localStorage signal) */}
      <ChapterUnlockCelebration />

      {/* Stats header: level, XP bar, streak, chapters count */}
      <StatsHeader />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="min-w-0">
          <p className="text-sm text-gray-400 dark:text-[#636366]">
            {t('learn_hello')},{' '}
            <span className="text-gray-600 dark:text-[#a1a1a6] font-medium">{user?.firstName}</span>{' '}
            👋
          </p>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-[#f5f5f7] mt-0.5 tracking-tight truncate">
            {t('learn_course_title')}
          </h1>
        </div>
        <ProgressRing percent={overallPct} />
      </div>

      {/* How it works collapsible info panel */}
      <HowItWorksPanel />

      {/* Empty state for first-time students */}
      {isBrandNew && firstChapter && (
        <EmptyStateCard
          firstChapterId={firstChapter.id}
          firstChapterTitle={firstChapter.title}
        />
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div className="metric-card">
          <span className="metric-value">
            {chapters.filter((c) => c.status === 'COMPLETED').length}
          </span>
          <span className="metric-label">{lang === 'ru' ? 'Глав' : 'Chapters'}</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{lessonsCompletedTotal}</span>
          <span className="metric-label">{lang === 'ru' ? 'Уроков' : 'Lessons'}</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{overallPct}%</span>
          <span className="metric-label">{lang === 'ru' ? 'Прогресс' : 'Progress'}</span>
        </div>
      </div>

      {/* Route map */}
      <div className="space-y-3 mb-5">
        {progress && <HighwayMap chapters={chapters} />}
      </div>

      {/* Chapter grid */}
      <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
        {chapters.map((ch) => (
          <ChapterCard key={ch.id} chapter={ch} />
        ))}
      </div>
    </div>
  );
}

function CourseSkeleton() {
  return (
    <div className="px-4 pt-14 lg:pt-6 space-y-3 animate-pulse max-w-lg lg:max-w-5xl mx-auto">
      <div className="h-20 bg-gray-100 dark:bg-[#2c2c2e] rounded-2xl" />
      <div className="h-14 bg-gray-100 dark:bg-[#2c2c2e] rounded-xl" />
      <div className="h-16 bg-gray-100 dark:bg-[#2c2c2e] rounded-2xl" />
      <div className="grid grid-cols-3 gap-2.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-[#2c2c2e] rounded-xl" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 dark:bg-[#2c2c2e] rounded-2xl" />
      ))}
    </div>
  );
}
