'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { coursesApi } from '@/lib/api/courses';
import { LessonContent } from '@/components/domain/lesson-content';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const qc      = useQueryClient();
  const [done, setDone] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => coursesApi.getLesson(id),
  });

  const complete = useMutation({
    mutationFn: () => coursesApi.completeLesson(id),
    onSuccess: (res) => {
      setDone(true);
      qc.invalidateQueries({ queryKey: ['progress'] });
      qc.invalidateQueries({ queryKey: ['chapter'] });
      setTimeout(() => {
        if (res.nextLessonId) router.replace(`/learn/lessons/${res.nextLessonId}`);
        else router.back();
      }, 1200);
    },
  });

  if (isLoading) return <div className="p-6 animate-pulse"><div className="h-8 bg-gray-200 rounded mb-4"/><div className="h-64 bg-gray-200 rounded"/></div>;

  const { lesson, progress } = data!;
  const alreadyDone = progress?.status === 'COMPLETED';

  return (
    <div className="max-w-lg mx-auto flex flex-col min-h-screen">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl text-gray-500">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 uppercase tracking-wide">{lesson.type}</p>
          <h1 className="font-bold truncate">{lesson.title}</h1>
        </div>
      </div>

      <div className="flex-1 p-4">
        <LessonContent content={lesson.content} />
      </div>

      <div className="p-4 pb-6">
        {done ? (
          <div className="flex items-center justify-center gap-2 py-3 text-green-600 font-semibold">
            <CheckCircle2 className="w-5 h-5" /> Done! Moving on…
          </div>
        ) : alreadyDone ? (
          <button className="btn-primary bg-gray-100 text-gray-600" onClick={() => router.back()}>
            Back to Chapter
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => complete.mutate()}
            disabled={complete.isPending}
          >
            {complete.isPending ? 'Saving…' : 'Mark as Complete →'}
          </button>
        )}
      </div>
    </div>
  );
}
