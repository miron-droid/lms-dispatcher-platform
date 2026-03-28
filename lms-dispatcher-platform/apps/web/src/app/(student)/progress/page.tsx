'use client';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api/courses';
import { ProgressRing } from '@/components/domain/progress-ring';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';

const COURSE_ID = 'course-dispatchers-v1';

export default function ProgressPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['progress', COURSE_ID],
    queryFn: () => coursesApi.getProgress(COURSE_ID),
  });

  if (isLoading) return <div className="p-4 animate-pulse space-y-3">{Array.from({length:5}).map((_,i)=><div key={i} className="h-14 bg-gray-200 rounded-xl"/>)}</div>;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">My Progress</h1>
        <ProgressRing percent={data?.overallPercent ?? 0} />
      </div>

      <div className="space-y-2">
        {(data?.chapters ?? []).map((ch) => (
          <div key={ch.id} className="card flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm font-bold text-gray-500">
              {ch.order}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{ch.title}</p>
              <p className="text-xs text-gray-400">
                {ch.lessonsCompleted}/{ch.lessonsTotal} lessons
                {ch.testPassed ? ' · Test ✓' : ''}
              </p>
            </div>
            {ch.examPassed   ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> :
             ch.status === 'LOCKED' ? <Circle className="w-5 h-5 text-gray-300 shrink-0" /> :
             <Circle className="w-5 h-5 text-brand-400 shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
