'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/lib/api/exams';
import { formatDate, cn } from '@/lib/utils';
import { GraduationCap, CalendarDays, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';
import type { TranslationKey } from '@/lib/i18n/translations';
import { useDailyExamStore } from '@/lib/stores/daily-exam.store';
import { DAILY_EXAMS, PASS_THRESHOLD } from '@/data/daily-exams';
import { DuoExamPlayer } from '@/components/domain/duo-exam-player';

const BADGE_STYLE: Record<string, string> = {
  REQUESTED: 'bg-yellow-100 text-yellow-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-gray-100 dark:bg-[#2c2c2e] text-gray-600 dark:text-[#a1a1a6]',
  CANCELLED: 'bg-red-100 text-red-600',
};

const DECISION_STYLE: Record<string, string> = {
  PASS:    'bg-green-100 text-green-700',
  RETRY:   'bg-yellow-100 text-yellow-700',
  DISBAND: 'bg-red-100 text-red-700',
};

export default function ExamsPage() {
  const { t, translateTitle } = useLang();
  const { data: exams = [], isLoading } = useQuery({
    queryKey: ['my-exams'],
    queryFn: examsApi.myExams,
  });
  const { results } = useDailyExamStore();
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const dailyCompleted = Object.keys(results).length;
  const dailyPassed = Object.values(results).filter(r => r.passed).length;

  if (isLoading) return (
    <div className="p-4 animate-pulse space-y-3">
      {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-gray-200 dark:bg-[#3a3a3c] rounded-2xl" />)}
    </div>
  );

  // ── Exam player ──────────────────────────────────────────────────────────────
  if (activeDay !== null) {
    return <DuoExamPlayer day={activeDay} onBack={() => setActiveDay(null)} />;
  }

  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 lg:px-6 pt-14 lg:pt-6 pb-24 lg:pb-4">
      <h1 className="text-xl lg:text-2xl font-bold mb-6">{t('exams_title')}</h1>

      {/* ── Daily exams section ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-gray-700 dark:text-[#f5f5f7] uppercase tracking-wider">Ежедневные экзамены</h2>
          {dailyCompleted > 0 && (
            <span className="ml-auto text-xs text-gray-400 dark:text-[#636366]">
              {dailyCompleted}/20 пройдено · {dailyPassed} сдано
            </span>
          )}
        </div>

        {/* Progress bar */}
        {dailyCompleted > 0 && (
          <div className="h-1.5 bg-gray-100 dark:bg-[#2c2c2e] rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${(dailyCompleted / 20) * 100}%` }} />
          </div>
        )}

        {/* 20 exam cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {DAILY_EXAMS.map(exam => {
            const result = results[exam.day];
            const isDone = !!result;

            return (
              <button
                key={exam.day}
                onClick={() => setActiveDay(exam.day)}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all duration-150 hover:shadow-md active:scale-95',
                  isDone && result.passed
                    ? 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100'
                    : isDone && !result.passed
                    ? 'border-red-200 bg-red-50 hover:bg-red-100'
                    : 'border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#2c2c2e] hover:border-emerald-300 hover:bg-gray-50 dark:hover:bg-white/5 dark:bg-[#1c1c1e]'
                )}
              >
                {isDone ? (
                  result.passed
                    ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    : <span className="text-xl">❌</span>
                ) : (
                  <span className="text-2xl">📋</span>
                )}

                <div>
                  <p className="text-[10px] text-gray-400 dark:text-[#636366] text-center">День</p>
                  <p className="text-xl font-black text-gray-800 dark:text-[#f5f5f7] text-center leading-none">{exam.day}</p>
                </div>

                {isDone && (
                  <span className={cn(
                    'text-xs font-bold px-2 py-0.5 rounded-full',
                    result.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                  )}>
                    {result.score}/20
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 dark:text-[#636366]">
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Сдан</span>
          <span>❌ Не сдан</span>
          <span>📋 Не начат</span>
          <span className="ml-auto">Проходной балл: {PASS_THRESHOLD}/20</span>
        </div>
      </div>

      {/* ── Chapter exams section ───────────────────────────────────────────── */}
      <h2 className="text-sm font-bold text-gray-500 dark:text-[#a1a1a6] uppercase tracking-wider mb-3">Экзамены по главам</h2>

      {exams.length === 0 ? (
        <div className="text-center py-10 text-gray-400 dark:text-[#636366]">
          <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>{t('exams_empty')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => {
            const statusKey = `exam_status_${exam.status}` as TranslationKey;
            const decisionKey = exam.decision ? `exam_decision_${exam.decision}` as TranslationKey : null;
            return (
              <div key={exam.id} className="card space-y-2">
                <div className="flex items-start justify-between">
                  <p className="font-semibold">{translateTitle(exam.chapter.title)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_STYLE[exam.status]}`}>
                    {t(statusKey)}
                  </span>
                </div>
                {decisionKey && exam.decision && (
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${DECISION_STYLE[exam.decision]}`}>
                    {t(decisionKey)}
                  </span>
                )}
                {exam.comment && (
                  <p className="text-sm text-gray-600 dark:text-[#a1a1a6] bg-gray-50 dark:bg-[#1c1c1e] rounded-xl p-3">{exam.comment}</p>
                )}
                <p className="text-xs text-gray-400 dark:text-[#636366]">{formatDate(exam.createdAt)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
