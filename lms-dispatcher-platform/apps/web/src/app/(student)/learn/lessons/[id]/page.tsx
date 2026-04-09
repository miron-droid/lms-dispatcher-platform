'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { coursesApi } from '@/lib/api/courses';
import { authApi } from '@/lib/api/auth';
import { quizApi } from '@/lib/api/quiz';
import { LessonContent } from '@/components/domain/lesson-content';
import { ChevronLeft, CheckCircle2, Clock, BookOpen, HelpCircle, AlertTriangle, Flag } from 'lucide-react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n/lang-context';
import { useAuthStore } from '@/lib/stores/auth.store';
import { XPToast } from '@/components/domain/xp-toast';
import type { TranslationKey } from '@/lib/i18n/translations';

const QUIZ_PASS_THRESHOLD = 80;

/* ── Confetti ──────────────────────────────────────────────── */
const CONFETTI_COLORS = ['#2563eb','#16a34a','#eab308','#ef4444','#8b5cf6','#ec4899','#f97316'];
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]" aria-hidden>
      {Array.from({ length: 50 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const dur = 1.5 + Math.random() * 1.5;
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const size = 6 + Math.random() * 6;
        return (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              left: `${left}%`,
              top: -20,
              width: size,
              height: size * 0.6,
              backgroundColor: color,
              animation: `confetti-fall ${dur}s ease-in ${delay}s forwards, confetti-shake ${dur * 0.5}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

type QuizUiState = 'none' | 'reading' | 'pending' | 'failed' | 'passed';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const qc      = useQueryClient();
  const [done, setDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [pulseComplete, setPulseComplete] = useState(false);
  const [pulseQuiz, setPulseQuiz] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const quizAnchorRef = useRef<HTMLDivElement>(null);
  const completeBtnRef = useRef<HTMLButtonElement>(null);
  const { t, lang, translateTitle } = useLang();
  const setUser = useAuthStore((s) => s.setUser);

  const { data, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => coursesApi.getLesson(id),
  });

  // Student's own quiz attempts — used as a cross-check / to react instantly
  // after a submission without refetching the lesson.
  const { data: myQuizAttempts } = useQuery({
    queryKey: ['quiz-attempts', 'me'],
    queryFn: quizApi.myAttempts,
    staleTime: 5_000,
  });

  /* ── Derive quiz state ──────────────────────────────────────── */
  const content = data?.lesson?.content as
    | { type?: string; body?: string; bodyRu?: string; quiz?: { questions?: unknown[] }; quizRu?: { questions?: unknown[] } }
    | undefined;

  const hasQuiz = useMemo(() => {
    // Prefer server flag, fall back to inspecting the content JSON.
    if (typeof data?.hasQuiz === 'boolean') return data.hasQuiz;
    if (!content || content.type !== 'text') return false;
    const qs = content.quiz?.questions ?? content.quizRu?.questions;
    return Array.isArray(qs) && qs.length > 0;
  }, [data?.hasQuiz, content]);

  const lessonAttempts = useMemo(
    () => (myQuizAttempts ?? []).filter((a) => a.lessonId === id),
    [myQuizAttempts, id],
  );
  const bestLocalScore = lessonAttempts.length
    ? Math.max(...lessonAttempts.map((a) => a.score))
    : null;

  const quizPassed = useMemo(() => {
    if (!hasQuiz) return true; // no quiz → treated as passed for gating
    if (data?.quizPassed) return true;
    if (bestLocalScore != null && bestLocalScore >= QUIZ_PASS_THRESHOLD) return true;
    return false;
  }, [hasQuiz, data?.quizPassed, bestLocalScore]);

  const quizUiState: QuizUiState = useMemo(() => {
    if (!hasQuiz) return 'none';
    if (quizPassed) return 'passed';
    if (bestLocalScore != null) return 'failed';
    return 'pending';
  }, [hasQuiz, quizPassed, bestLocalScore]);

  const complete = useMutation({
    mutationFn: () => coursesApi.completeLesson(id),
    onSuccess: async (res) => {
      setDone(true);
      setShowConfetti(true);
      try {
        const fresh = await authApi.me();
        setUser(fresh);
      } catch { /* ignore */ }
      qc.invalidateQueries({ queryKey: ['progress'] });
      qc.invalidateQueries({ queryKey: ['chapter'] });
      qc.invalidateQueries({ queryKey: ['quiz-attempts', 'me'] });
      setTimeout(() => setShowConfetti(false), 3000);
      setTimeout(() => {
        if (res.nextLessonId) router.replace(`/learn/lessons/${res.nextLessonId}`);
        else router.back();
      }, 2200);
    },
  });

  /* reading progress bar */
  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setScrollPct(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* When the quiz becomes passed, auto-scroll to the Complete button and
     pulse it so the student understands the gate has opened. */
  const prevPassedRef = useRef<boolean>(quizPassed);
  useEffect(() => {
    if (!prevPassedRef.current && quizPassed && hasQuiz) {
      setPulseComplete(true);
      setTimeout(() => {
        completeBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      setTimeout(() => setPulseComplete(false), 6000);
    }
    prevPassedRef.current = quizPassed;
  }, [quizPassed, hasQuiz]);

  const handleCompleteClick = () => {
    if (hasQuiz && !quizPassed) {
      // Smooth scroll to quiz section and flash the highlight pulse.
      quizAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPulseQuiz(true);
      setTimeout(() => setPulseQuiz(false), 2000);
      return;
    }
    complete.mutate();
  };

  if (isLoading) return <div className="p-6 animate-pulse"><div className="h-8 bg-gray-200 dark:bg-[#3a3a3c] rounded mb-4"/><div className="h-64 bg-gray-200 dark:bg-[#3a3a3c] rounded"/></div>;

  const { lesson, progress } = data!;
  const alreadyDone = progress?.status === 'COMPLETED';
  const typeKey = `lesson_type_${lesson.type}` as TranslationKey;

  /* estimated reading time */
  const textContent = lesson.content as { body?: string; bodyRu?: string } | undefined;
  const bodyLen = ((lang === 'ru' && textContent?.bodyRu) ? textContent.bodyRu : textContent?.body ?? '').length;
  const readMin = Math.max(1, Math.round(bodyLen / 1000));

  /* Status badge config */
  const badgeConfig: Record<QuizUiState, { key: TranslationKey; cls: string; Icon: typeof BookOpen } | null> = {
    none: null,
    reading: { key: 'lesson_status_reading', cls: 'bg-gray-100 text-gray-700 dark:bg-[#2c2c2e] dark:text-[#a1a1a6]', Icon: BookOpen },
    pending: { key: 'lesson_status_quiz_pending', cls: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20', Icon: HelpCircle },
    failed: { key: 'lesson_status_quiz_failed', cls: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20', Icon: AlertTriangle },
    passed: { key: 'lesson_status_quiz_passed', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20', Icon: CheckCircle2 },
  };
  const badge = hasQuiz ? badgeConfig[quizUiState] : null;

  /* Current journey step (1 read, 2 quiz, 3 complete) */
  const currentStep: 1 | 2 | 3 = !hasQuiz
    ? 3
    : quizPassed
      ? 3
      : bestLocalScore != null
        ? 2
        : scrollPct > 60 ? 2 : 1;

  const steps: { n: 1 | 2 | 3; labelKey: TranslationKey }[] = [
    { n: 1, labelKey: 'lesson_step_read' },
    { n: 2, labelKey: 'lesson_step_quiz' },
    { n: 3, labelKey: 'lesson_step_complete' },
  ];

  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto flex flex-col min-h-screen">
      {showConfetti && <Confetti />}
      <XPToast />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gray-100 dark:bg-[#2c2c2e] z-[60]">
        <div
          className="h-full bg-brand-600 transition-[width] duration-150"
          style={{ width: `${scrollPct}%` }}
        />
      </div>

      <div className="sticky top-[3px] bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md border-b border-gray-100 dark:border-[rgba(255,255,255,0.08)] px-4 lg:px-6 py-3 flex items-center gap-3 z-40">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl text-gray-500 dark:text-[#a1a1a6] hover:bg-gray-100 dark:hover:bg-[#3a3a3c]">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-400 dark:text-[#636366] uppercase tracking-wide">{t(typeKey)}</p>
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-[#636366]">
              <Clock className="w-3 h-3" />~{readMin} {lang === 'ru' ? 'мин' : 'min'}
            </span>
          </div>
          <h1 className="font-bold truncate dark:text-[#f5f5f7]">{translateTitle(lesson.title)}</h1>
        </div>
      </div>

      {/* Status badge + journey indicator */}
      {hasQuiz && (
        <div className="px-4 lg:px-6 pt-4 space-y-3">
          {badge && (
            <div className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold',
              badge.cls,
            )}>
              <badge.Icon className="w-3.5 h-3.5" />
              {t(badge.key)}
            </div>
          )}

          {/* Journey steps */}
          <div className="flex items-center gap-2 text-[11px] font-medium">
            {steps.map((s, i) => {
              const isActive = s.n === currentStep;
              const isDone = s.n < currentStep;
              return (
                <div key={s.n} className="flex items-center gap-2">
                  <div className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all',
                    isActive && 'bg-brand-600 text-white shadow-sm',
                    isDone && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
                    !isActive && !isDone && 'bg-gray-100 text-gray-500 dark:bg-[#2c2c2e] dark:text-[#636366]',
                  )}>
                    <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-bold">
                      {s.n}
                    </span>
                    {t(s.labelKey)}
                  </div>
                  {i < steps.length - 1 && (
                    <span className="text-gray-300 dark:text-[#3a3a3c]">→</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div ref={contentRef} className="flex-1 p-4 lg:p-6 lg:pb-8">
        <div
          ref={quizAnchorRef}
          className={cn(
            'rounded-2xl transition-all duration-500',
            pulseQuiz && 'ring-4 ring-amber-400/60 animate-pulse',
          )}
        >
          <LessonContent content={lesson.content} lessonId={lesson.id} />
        </div>
      </div>

      <div className="p-4 lg:p-6 pb-6 space-y-3">
        {/* Lock hint */}
        {hasQuiz && !quizPassed && !alreadyDone && !done && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/20 px-3 py-2.5 text-sm text-amber-800 dark:text-amber-400">
            <Flag className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{t('lesson_complete_the_quiz')}</span>
          </div>
        )}

        {done ? (
          <div className="flex items-center justify-center gap-2 py-3 text-green-600 font-semibold animate-bounce">
            <CheckCircle2 className="w-6 h-6" /> {t('lesson_done')}
          </div>
        ) : alreadyDone ? (
          <button className="btn-primary bg-gray-100 dark:bg-[#2c2c2e] text-gray-600 dark:text-[#a1a1a6]" onClick={() => router.back()}>
            {t('lesson_back_to_chapter')}
          </button>
        ) : (
          <button
            ref={completeBtnRef}
            className={cn(
              'btn-primary relative transition-all',
              hasQuiz && !quizPassed && 'opacity-50 cursor-not-allowed',
              pulseComplete && 'ring-4 ring-emerald-400/60 animate-pulse shadow-lg shadow-emerald-500/20',
            )}
            onClick={handleCompleteClick}
            disabled={complete.isPending}
            aria-disabled={hasQuiz && !quizPassed}
            title={hasQuiz && !quizPassed ? t('lesson_quiz_required_tooltip') : undefined}
          >
            {complete.isPending ? t('lesson_saving') : t('lesson_mark_complete')}
          </button>
        )}
      </div>
    </div>
  );
}
