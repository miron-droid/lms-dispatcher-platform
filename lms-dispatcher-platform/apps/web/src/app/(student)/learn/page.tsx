'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { coursesApi } from '@/lib/api/courses';
import { useAuthStore } from '@/lib/stores/auth.store';
import { ChapterCard } from '@/components/domain/chapter-card';
import { ProgressRing } from '@/components/domain/progress-ring';

const COURSE_ID = 'course-dispatchers-v1';

export default function LearnPage() {
  const user = useAuthStore((s) => s.user);

  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress', COURSE_ID],
    queryFn: () => coursesApi.getProgress(COURSE_ID),
  });

  useEffect(() => {
    if (!progress) coursesApi.initializeCourse(COURSE_ID).catch(() => {});
  }, [progress]);

  if (isLoading) return <CourseSkeleton />;

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">US Trucking Course</h1>
          <p className="text-gray-500 text-sm mt-0.5">Hello, {user?.firstName} 👋</p>
        </div>
        <ProgressRing percent={progress?.overallPercent ?? 0} />
      </div>

      <div className="space-y-3">
        {(progress?.chapters ?? []).map((ch) => (
          <ChapterCard key={ch.id} chapter={ch} />
        ))}
      </div>
    </div>
  );
}

function CourseSkeleton() {
  return (
    <div className="px-4 pt-6 space-y-3 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
      ))}
    </div>
  );
}
