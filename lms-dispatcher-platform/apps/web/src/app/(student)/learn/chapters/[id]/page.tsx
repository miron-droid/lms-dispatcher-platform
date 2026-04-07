'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { coursesApi } from '@/lib/api/courses';
import { cn } from '@/lib/utils';
import { CheckCircle2, PlayCircle, Lock, ChevronLeft } from 'lucide-react';
import type { LessonType } from '@/types';
import { useLang } from '@/lib/i18n/lang-context';
import type { TranslationKey } from '@/lib/i18n/translations';

const ICONS: Record<LessonType, string> = {
  INTRO: '📖', THEORY: '📚', DEMO: '🎬',
  PRACTICE: '✏️', TEST: '📝', EXAM: '🎓',
};

export default function ChapterPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const { t, translateTitle } = useLang();

  const { data, isLoading } = useQuery({
    queryKey: ['chapter', id],
    queryFn: () => coursesApi.getChapter(id),
  });

  if (isLoading) return <div className="p-4 animate-pulse space-y-3">{Array.from({length:5}).map((_,i)=><div key={i} className="h-16 bg-gray-200 dark:bg-[#3a3a3c] rounded-xl"/>)}</div>;

  const { chapter } = data!;
  const doneCount = chapter.lessons.filter((l: any) => l.lessonProgress?.[0]?.status === 'COMPLETED').length;
  const totalCount = chapter.lessons.length;
  const chPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto">
      <div className="sticky top-0 bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md border-b border-gray-100 dark:border-[rgba(255,255,255,0.08)] px-4 lg:px-6 py-3 flex items-center gap-3 z-40">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl text-gray-500 dark:text-[#a1a1a6] hover:bg-gray-100 dark:hover:bg-[#3a3a3c]">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg truncate dark:text-[#f5f5f7]">{translateTitle(chapter.title)}</h1>
      </div>

      {/* Chapter progress summary */}
      <div className="px-4 lg:px-6 pt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-500 dark:text-[#a1a1a6]">{doneCount}/{totalCount} {t('progress_lessons')}</span>
          <span className="text-sm font-semibold text-gray-700 dark:text-[#a1a1a6]">{chPct}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-[#2c2c2e] rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-500", chPct >= 100 ? "bg-green-500" : "bg-brand-500")} style={{ width: `${chPct}%` }} />
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-2 lg:space-y-3">
        {chapter.lessons.map((lesson, idx) => {
          const status = lesson.lessonProgress?.[0]?.status ?? 'LOCKED';
          const isLocked = status === 'LOCKED';
          const isDone   = status === 'COMPLETED';
          const typeKey = `lesson_type_${lesson.type}` as TranslationKey;
          return (
            <button
              key={lesson.id}
              onClick={() => !isLocked && router.push(`/learn/lessons/${lesson.id}`)}
              disabled={isLocked}
              className={cn(
                'w-full card flex items-center gap-4 text-left transition-all active:scale-[0.98]',
                isLocked && 'opacity-50',
              )}
            >
              <div className="relative">
                <span className="text-2xl">{ICONS[lesson.type]}</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-200 dark:bg-[#3a3a3c] text-[10px] font-bold text-gray-600 dark:text-[#a1a1a6] flex items-center justify-center">
                  {idx + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 dark:text-[#636366] uppercase tracking-wide font-medium">
                  {t(typeKey)}
                </p>
                <p className="font-semibold text-gray-900 dark:text-[#f5f5f7] truncate">{translateTitle(lesson.title)}</p>
              </div>
              {isDone   ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> :
               isLocked ? <Lock className="w-4 h-4 text-gray-300 dark:text-[#636366] shrink-0" /> :
                          <PlayCircle className="w-5 h-5 text-brand-500 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
