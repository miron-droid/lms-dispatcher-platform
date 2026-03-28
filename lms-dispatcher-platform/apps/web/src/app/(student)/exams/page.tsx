'use client';
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/lib/api/exams';
import { formatDate } from '@/lib/utils';
import { GraduationCap } from 'lucide-react';

const BADGE: Record<string, string> = {
  REQUESTED: 'bg-yellow-100 text-yellow-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
};

const DECISION_BADGE: Record<string, string> = {
  PASS:    'bg-green-100 text-green-700',
  RETRY:   'bg-yellow-100 text-yellow-700',
  DISBAND: 'bg-red-100 text-red-700',
};

export default function ExamsPage() {
  const { data: exams = [], isLoading } = useQuery({
    queryKey: ['my-exams'],
    queryFn: examsApi.myExams,
  });

  if (isLoading) return <div className="p-4 animate-pulse space-y-3">{Array.from({length:3}).map((_,i)=><div key={i} className="h-24 bg-gray-200 rounded-2xl"/>)}</div>;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-xl font-bold mb-6">My Exams</h1>

      {exams.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No exams yet. Pass a chapter test to request one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div key={exam.id} className="card space-y-2">
              <div className="flex items-start justify-between">
                <p className="font-semibold">{exam.chapter.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE[exam.status]}`}>
                  {exam.status}
                </span>
              </div>
              {exam.decision && (
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${DECISION_BADGE[exam.decision]}`}>
                  {exam.decision}
                </span>
              )}
              {exam.comment && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{exam.comment}</p>
              )}
              <p className="text-xs text-gray-400">{formatDate(exam.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
