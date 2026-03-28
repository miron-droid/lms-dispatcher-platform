'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { coursesApi } from '@/lib/api/courses';
import { cn } from '@/lib/utils';
import { CheckCircle2, PlayCircle, Lock, ChevronLeft } from 'lucide-react';
import type { LessonType } from '@/types';

const ICONS: Record<LessonType, string> = {
  INTRO: '📖', THEORY: '📚', DEMO: '🎬',
  PRACTICE: '✏️', TEST: '📝', EXAM: '🎓',
};

export default function ChapterPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['chapter', id],
    queryFn: () => coursesApi.getChapter(id),
  });

  if (isLoading) return <div className="p-4 animate-pulse space-y-3">{Array.from({length:5}).map((_,i)=><div key={i} className="h-16 bg-gray-200 rounded-xl"/>)}</div>;

  const { chapter } = data!;

  return (
    <div className="max-w-lg mx-auto">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl text-gray-500">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg truncate">{chapter.title}</h1>
      </div>

      <div className="p-4 space-y-2">
        {chapter.lessons.map((lesson) => {
          const status = lesson.lessonProgress?.[0]?.status ?? 'LOCKED';
          const isLocked = status === 'LOCKED';
          const isDone   = status === 'COMPLETED';
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
              <span className="text-2xl">{ICONS[lesson.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  {lesson.type}
                </p>
                <p className="font-semibold text-gray-900 truncate">{lesson.title}</p>
              </div>
              {isDone   ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> :
               isLocked ? <Lock className="w-4 h-4 text-gray-300 shrink-0" /> :
                          <PlayCircle className="w-5 h-5 text-brand-500 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
