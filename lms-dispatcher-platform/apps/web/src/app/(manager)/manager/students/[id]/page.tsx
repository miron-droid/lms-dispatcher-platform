'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, BookOpen, Award, TrendingUp, Layers, Calendar, Mail, Unlock, FastForward } from 'lucide-react';
import { adminApi, type StudentDetail } from '@/lib/api/admin';
import { useLang } from '@/lib/i18n/lang-context';
import { cn } from '@/lib/utils';

export default function StudentDetailPage() {
  const { lang } = useLang();
  const params = useParams<{ id: string }>();
  const userId = params?.id as string;
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-student-detail', userId],
    queryFn: () => adminApi.getStudentDetails(userId),
    enabled: !!userId,
    retry: 1,
  });

  const unlock = useMutation({
    mutationFn: (chapterId: string) => adminApi.unlockChapter(userId, chapterId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-student-detail', userId] }),
  });
  const forceComplete = useMutation({
    mutationFn: (chapterId: string) => adminApi.completeChapter(userId, chapterId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-student-detail', userId] }),
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 lg:px-6 pt-6 pb-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-100 dark:bg-[#2c2c2e] rounded-xl" />
          <div className="h-28 bg-gray-100 dark:bg-[#1c1c1e] rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-[#1c1c1e] rounded-2xl" />)}
          </div>
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-[#1c1c1e] rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 lg:px-6 pt-6 pb-8">
        <Link href="/manager/students" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-[#a1a1a6] hover:text-gray-900 dark:hover:text-[#f5f5f7] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {lang === 'ru' ? 'Назад к студентам' : 'Back to students'}
        </Link>
        <div className="card text-center py-12">
          <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">
            {lang === 'ru' ? 'Не удалось загрузить данные студента' : 'Failed to load student details'}
          </p>
        </div>
      </div>
    );
  }

  const { user, summary, chapters } = data;
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
  const initial = (user.firstName?.charAt(0) || user.email.charAt(0)).toUpperCase();
  const lastSeenDays = user.lastActiveAt ? Math.round((Date.now() - new Date(user.lastActiveAt).getTime()) / 86400000) : null;
  const lastSeenLabel = lastSeenDays == null
    ? (lang === 'ru' ? 'никогда' : 'never')
    : lastSeenDays === 0
      ? (lang === 'ru' ? 'сегодня' : 'today')
      : lastSeenDays === 1
        ? (lang === 'ru' ? 'вчера' : 'yesterday')
        : `${lastSeenDays} ${lang === 'ru' ? 'дн. назад' : 'days ago'}`;

  const chapterPct = summary.totalChapters > 0 ? Math.round((summary.chaptersCompleted / summary.totalChapters) * 100) : 0;
  const lessonPct = summary.totalLessons > 0 ? Math.round((summary.lessonsCompleted / summary.totalLessons) * 100) : 0;
  const scoreColor = (s: number) =>
    s >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
    s >= 60 ? 'text-amber-600 dark:text-amber-400' :
    'text-red-500 dark:text-red-400';

  const onUnlock = (chapterId: string | undefined, title: string) => {
    if (!chapterId) {
      alert(lang === 'ru' ? 'Недоступно: нет ID главы' : 'Unavailable: missing chapter ID');
      return;
    }
    if (!confirm(lang === 'ru' ? `Открыть главу "${title}" для этого студента?` : `Unlock chapter "${title}" for this student?`)) return;
    unlock.mutate(chapterId);
  };
  const onForceComplete = (chapterId: string | undefined, title: string) => {
    if (!chapterId) {
      alert(lang === 'ru' ? 'Недоступно: нет ID главы' : 'Unavailable: missing chapter ID');
      return;
    }
    if (!confirm(lang === 'ru' ? `Форс-завершить главу "${title}"? Это нельзя отменить.` : `Force-complete chapter "${title}"? This cannot be undone.`)) return;
    forceComplete.mutate(chapterId);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 pt-6 pb-8">
      {/* Back */}
      <Link href="/manager/students" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-[#a1a1a6] hover:text-gray-900 dark:hover:text-[#f5f5f7] mb-5 transition-colors cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> {lang === 'ru' ? 'Назад' : 'Back'}
      </Link>

      {/* Header card */}
      <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-5 mb-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7] truncate">{fullName}</h1>
              <span className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide',
                user.isActive
                  ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                  : 'bg-gray-100 dark:bg-[#2c2c2e] text-gray-500 dark:text-[#a1a1a6]'
              )}>
                {user.isActive ? (lang === 'ru' ? 'Активен' : 'Active') : (lang === 'ru' ? 'Неактивен' : 'Inactive')}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-4 flex-wrap text-xs text-gray-500 dark:text-[#a1a1a6]">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />{user.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {lang === 'ru' ? 'Был онлайн:' : 'Last seen:'} {lastSeenLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <SummaryCard
          icon={<Layers className="w-4 h-4" />}
          label={lang === 'ru' ? 'Главы' : 'Chapters'}
          value={`${summary.chaptersCompleted}/${summary.totalChapters}`}
          progress={chapterPct}
          progressColor="bg-emerald-500"
        />
        <SummaryCard
          icon={<BookOpen className="w-4 h-4" />}
          label={lang === 'ru' ? 'Уроки' : 'Lessons'}
          value={`${summary.lessonsCompleted}/${summary.totalLessons}`}
          progress={lessonPct}
          progressColor="bg-blue-500"
        />
        <SummaryCard
          icon={<Award className="w-4 h-4" />}
          label={lang === 'ru' ? 'Тесты сданы' : 'Tests passed'}
          value={`${summary.testsPassed}/${summary.totalChapters}`}
          subtitle={`${summary.testAttempts} ${lang === 'ru' ? 'попыток' : 'attempts'}`}
        />
        <SummaryCard
          icon={<TrendingUp className="w-4 h-4" />}
          label={lang === 'ru' ? 'Средний балл' : 'Average score'}
          value={summary.averageScore != null ? `${Math.round(summary.averageScore)}%` : '—'}
          valueClassName={summary.averageScore != null ? scoreColor(summary.averageScore) : ''}
        />
      </div>

      {/* Chapter breakdown */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-[#f5f5f7]">
          {lang === 'ru' ? 'Прогресс по главам' : 'Chapter Breakdown'}
        </h2>
        <span className="text-[11px] text-gray-400 dark:text-[#636366] font-mono">{chapters.length}</span>
      </div>

      <div className="space-y-3">
        {chapters.map(ch => (
          <ChapterRow
            key={ch.order}
            chapter={ch}
            lang={lang}
            scoreColor={scoreColor}
            onUnlock={() => onUnlock(ch.id, ch.title)}
            onForceComplete={() => onForceComplete(ch.id, ch.title)}
            busy={unlock.isPending || forceComplete.isPending}
          />
        ))}
        {chapters.length === 0 && (
          <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-8 text-center text-sm text-gray-500 dark:text-[#a1a1a6]">
            {lang === 'ru' ? 'Данных пока нет' : 'No data yet'}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Summary Card ─────────────────────────────────── */
function SummaryCard({
  icon, label, value, subtitle, progress, progressColor, valueClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  progress?: number;
  progressColor?: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-[#a1a1a6] uppercase tracking-wide">
        <span className="text-gray-400 dark:text-[#636366]">{icon}</span>
        {label}
      </div>
      <p className={cn('text-2xl font-bold font-mono mt-2 text-gray-900 dark:text-[#f5f5f7]', valueClassName)}>{value}</p>
      {progress != null && (
        <div className="h-1 mt-2.5 bg-gray-100 dark:bg-[#2c2c2e] rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full transition-all', progressColor || 'bg-emerald-500')} style={{ width: `${progress}%` }} />
        </div>
      )}
      {subtitle && <p className="text-[10px] text-gray-400 dark:text-[#636366] mt-2 font-mono">{subtitle}</p>}
    </div>
  );
}

/* ── Chapter Row ──────────────────────────────────── */
function ChapterRow({
  chapter, lang, scoreColor, onUnlock, onForceComplete, busy,
}: {
  chapter: StudentDetail['chapters'][number];
  lang: string;
  scoreColor: (s: number) => string;
  onUnlock: () => void;
  onForceComplete: () => void;
  busy: boolean;
}) {
  const lessonPct = chapter.totalLessons > 0 ? Math.round((chapter.lessonsCompleted / chapter.totalLessons) * 100) : 0;
  const isLocked = chapter.status === 'LOCKED';
  const isComplete = chapter.status === 'COMPLETED';
  const isInProgress = chapter.status === 'IN_PROGRESS';
  const [showQuizDetails, setShowQuizDetails] = useState(false);

  return (
    <div className={cn(
      'bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-4 transition-opacity',
      isLocked && 'opacity-80'
    )}>
      {/* Header row */}
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0',
          isComplete
            ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
            : isLocked
              ? 'bg-gray-100 dark:bg-[#2c2c2e] text-gray-400 dark:text-[#636366]'
              : 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400'
        )}>
          {chapter.order}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f5f5f7] truncate">{chapter.title}</h3>
            <StatusBadge status={chapter.status} lang={lang} />
            {chapter.testPassed && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 uppercase">
                {lang === 'ru' ? 'Тест' : 'Test'} ✓
              </span>
            )}
            {chapter.examPassed && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400 uppercase">
                {lang === 'ru' ? 'Экзамен' : 'Exam'} ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 max-w-[200px] h-1 bg-gray-100 dark:bg-[#2c2c2e] rounded-full overflow-hidden">
              <div className={cn('h-full rounded-full', isComplete ? 'bg-emerald-500' : 'bg-blue-500')} style={{ width: `${lessonPct}%` }} />
            </div>
            <span className="text-[11px] font-mono text-gray-500 dark:text-[#a1a1a6]">
              {chapter.lessonsCompleted}/{chapter.totalLessons} {lang === 'ru' ? 'уроков' : 'lessons'}
            </span>
          </div>
        </div>

        {/* Manager actions */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {isLocked && (
            <button
              onClick={onUnlock}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/25 transition-colors disabled:opacity-50"
              title={lang === 'ru' ? 'Открыть главу' : 'Unlock chapter'}
            >
              <Unlock className="w-3.5 h-3.5" />
              {lang === 'ru' ? 'Открыть' : 'Unlock'}
            </button>
          )}
          {isInProgress && (
            <button
              onClick={onForceComplete}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/25 transition-colors disabled:opacity-50"
              title={lang === 'ru' ? 'Форс-завершить главу' : 'Force-complete chapter'}
            >
              <FastForward className="w-3.5 h-3.5" />
              {lang === 'ru' ? 'Завершить' : 'Complete'}
            </button>
          )}
        </div>
      </div>

      {/* Test attempts */}
      <div className="mt-4 pl-12">
        <p className="text-[10px] uppercase tracking-wide font-semibold text-gray-400 dark:text-[#636366] mb-2">
          {lang === 'ru' ? 'Попытки теста' : 'Test attempts'}
        </p>
        {chapter.testAttempts.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-[#636366] italic">
            {lang === 'ru' ? 'Ещё не пробовал' : 'Not yet attempted'}
          </p>
        ) : (
          <div className="space-y-1.5">
            {chapter.testAttempts.map((a, idx) => {
              const pct = a.totalQuestions > 0 ? Math.round((a.correctAnswers / a.totalQuestions) * 100) : a.score;
              return (
                <div key={idx} className="bg-gray-50 dark:bg-[#2c2c2e] rounded-lg px-3 py-2 flex items-center gap-3 text-xs">
                  <span className="text-gray-400 dark:text-[#636366] font-mono w-12 flex-shrink-0">#{idx + 1}</span>
                  <span className="text-gray-700 dark:text-[#f5f5f7] font-mono flex-1">
                    {a.correctAnswers}/{a.totalQuestions} {lang === 'ru' ? 'верно' : 'correct'}
                  </span>
                  <span className={cn('font-bold font-mono', scoreColor(pct))}>{pct}%</span>
                  <span className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded uppercase',
                    a.passed
                      ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                      : 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400'
                  )}>
                    {a.passed ? (lang === 'ru' ? 'Сдан' : 'Passed') : (lang === 'ru' ? 'Не сдан' : 'Failed')}
                  </span>
                  <span className="text-gray-400 dark:text-[#636366] hidden sm:inline">
                    {new Date(a.completedAt).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lesson-level quiz attempts */}
      {chapter.quizAttempts && chapter.quizAttempts.length > 0 && (
        <div className="mt-4 pl-12">
          <button
            onClick={() => setShowQuizDetails(v => !v)}
            className="text-[10px] uppercase tracking-wide font-semibold text-gray-400 dark:text-[#636366] mb-2 hover:text-gray-600 dark:hover:text-[#a1a1a6] transition-colors"
          >
            {lang === 'ru' ? 'Попытки квизов по урокам' : 'Lesson quizzes'} ({chapter.quizAttempts.length}) {showQuizDetails ? '▾' : '▸'}
          </button>
          {showQuizDetails && (
            <div className="space-y-1.5">
              {chapter.quizAttempts.map((qa) => (
                <div key={qa.lessonId} className="bg-gray-50 dark:bg-[#2c2c2e] rounded-lg px-3 py-2 flex items-center gap-3 text-xs">
                  <span className="text-gray-400 dark:text-[#636366] font-mono w-8 flex-shrink-0">L{qa.lessonOrder}</span>
                  <span className="text-gray-700 dark:text-[#f5f5f7] flex-1 truncate">{qa.lessonTitle}</span>
                  <span className="text-gray-500 dark:text-[#a1a1a6] font-mono">
                    {qa.attempts} {lang === 'ru' ? 'попыт.' : 'att.'}
                  </span>
                  <span className={cn('font-bold font-mono', scoreColor(qa.bestScore))}>
                    {lang === 'ru' ? 'лучший' : 'best'} {Math.round(qa.bestScore)}%
                  </span>
                  <span className="text-gray-400 dark:text-[#636366] font-mono hidden sm:inline">
                    {lang === 'ru' ? 'посл.' : 'last'} {Math.round(qa.lastScore)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, lang }: { status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED'; lang: string }) {
  if (status === 'COMPLETED') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 uppercase">
        <CheckCircle2 className="w-2.5 h-2.5" />{lang === 'ru' ? 'Завершено' : 'Completed'}
      </span>
    );
  }
  if (status === 'LOCKED') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#2c2c2e] text-gray-500 dark:text-[#a1a1a6] uppercase">
        <Lock className="w-2.5 h-2.5" />{lang === 'ru' ? 'Закрыто' : 'Locked'}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 uppercase">
      {lang === 'ru' ? 'В процессе' : 'In progress'}
    </span>
  );
}
