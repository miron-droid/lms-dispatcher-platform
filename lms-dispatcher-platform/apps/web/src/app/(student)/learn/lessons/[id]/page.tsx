'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { coursesApi } from '@/lib/api/courses';
import { LessonContent } from '@/components/domain/lesson-content';
import { ChevronLeft, CheckCircle2, Clock } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLang } from '@/lib/i18n/lang-context';
import { useGamification } from '@/lib/stores/gamification.store';
import { XPToast } from '@/components/domain/xp-toast';
import type { TranslationKey } from '@/lib/i18n/translations';

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

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const qc      = useQueryClient();
  const [done, setDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t, lang, translateTitle } = useLang();
  const gamification = useGamification();

  const { data, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => coursesApi.getLesson(id),
  });

  // Start lesson timer for speed bonus
  useEffect(() => { gamification.startLesson(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const complete = useMutation({
    mutationFn: () => coursesApi.completeLesson(id),
    onSuccess: (res) => {
      setDone(true);
      setShowConfetti(true);
      // Award XP
      if (data) gamification.completeLesson(data.lesson.type);
      qc.invalidateQueries({ queryKey: ['progress'] });
      qc.invalidateQueries({ queryKey: ['chapter'] });
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

  if (isLoading) return <div className="p-6 animate-pulse"><div className="h-8 bg-gray-200 dark:bg-[#3a3a3c] rounded mb-4"/><div className="h-64 bg-gray-200 dark:bg-[#3a3a3c] rounded"/></div>;

  const { lesson, progress } = data!;
  const alreadyDone = progress?.status === 'COMPLETED';
  const typeKey = `lesson_type_${lesson.type}` as TranslationKey;

  /* estimated reading time */
  const content = lesson.content as { body?: string; bodyRu?: string } | undefined;
  const bodyLen = ((lang === 'ru' && content?.bodyRu) ? content.bodyRu : content?.body ?? '').length;
  const readMin = Math.max(1, Math.round(bodyLen / 1000));

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

      <div ref={contentRef} className="flex-1 p-4 lg:p-6 lg:pb-8">
        <LessonContent content={lesson.content} />
      </div>

      <div className="p-4 lg:p-6 pb-6">
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
            className="btn-primary"
            onClick={() => complete.mutate()}
            disabled={complete.isPending}
          >
            {complete.isPending ? t('lesson_saving') : t('lesson_mark_complete')}
          </button>
        )}
      </div>
    </div>
  );
}
