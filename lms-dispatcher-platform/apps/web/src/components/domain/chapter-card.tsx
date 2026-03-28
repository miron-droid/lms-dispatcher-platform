'use client';
import Link from 'next/link';
import { CheckCircle2, Lock, PlayCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChapterProgressItem } from '@/types';

interface Props { chapter: ChapterProgressItem }

export function ChapterCard({ chapter }: Props) {
  const locked = chapter.status === 'LOCKED';
  const done   = chapter.examPassed;

  return (
    <Link
      href={locked ? '#' : `/learn/chapters/${chapter.id}`}
      className={cn(
        'card flex items-center gap-4 transition-all active:scale-[0.98]',
        locked && 'opacity-60 pointer-events-none',
      )}
    >
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
        done   ? 'bg-green-100' :
        locked ? 'bg-gray-100'  : 'bg-brand-100',
      )}>
        {done   ? <CheckCircle2 className="w-6 h-6 text-green-600" /> :
         locked ? <Lock className="w-5 h-5 text-gray-400" /> :
                  <PlayCircle className="w-6 h-6 text-brand-600" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">Ch. {chapter.order}</span>
          {chapter.testPassed && !chapter.examPassed && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
              Exam pending
            </span>
          )}
          {done && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Complete
            </span>
          )}
        </div>
        <p className="font-semibold text-gray-900 truncate mt-0.5">{chapter.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all"
              style={{
                width: chapter.lessonsTotal > 0
                  ? `${Math.round((chapter.lessonsCompleted / chapter.lessonsTotal) * 100)}%`
                  : '0%',
              }}
            />
          </div>
          <span className="text-xs text-gray-400 shrink-0">
            {chapter.lessonsCompleted}/{chapter.lessonsTotal}
          </span>
        </div>
      </div>

      {!locked && <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />}
    </Link>
  );
}
