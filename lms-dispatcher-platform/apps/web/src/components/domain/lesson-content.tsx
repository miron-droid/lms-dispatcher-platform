'use client';
import type { TextContent, VideoContent, DialogueContent, CaseContent, QuizQuestion } from '@/types';
import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';
import { useLang } from '@/lib/i18n/lang-context';
import { SimulationBlock } from '@/components/domain/simulation-block';
import { USFreightMap } from '@/components/domain/us-freight-map';
import { DriverChatSimulator } from '@/components/domain/driver-chat-simulator';
import { LoadBoardSimulator } from '@/components/domain/load-board-simulator';
import { EquipmentMatcher } from '@/components/domain/equipment-matcher';
import { PhoneCallSimulator } from '@/components/domain/phone-call-simulator';
import { NegotiationGame } from '@/components/domain/negotiation-game';
import { CrisisDashboard } from '@/components/domain/crisis-dashboard';
import { DispatcherDaySimulator } from '@/components/domain/dispatcher-day-simulator';
import { BrokerCallSimulator } from '@/components/domain/broker-call-simulator';
import { quizApi, type QuizAnswerEntry, type GradedAnswer } from '@/lib/api/quiz';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useGamificationToast, ACHIEVEMENTS } from '@/lib/stores/gamification.store';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Lock } from 'lucide-react';

// Quiz pass threshold — mirrors backend.
const QUIZ_PASS_THRESHOLD = 80;

type Content = TextContent | VideoContent | DialogueContent | CaseContent | undefined;

/* ── Scroll-reveal hook ───────────────────────────────────────────────────── */
function useScrollReveal(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>(
      'h2, h3, p, blockquote, ul, ol, .scroll-reveal'
    );

    targets.forEach((t, i) => {
      t.classList.add('sr-item');
      t.style.transitionDelay = `${Math.min(i * 30, 150)}ms`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.15 }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [containerRef]);
}

export function LessonContent({ content, lessonId }: { content: Content; lessonId?: string }) {
  const { t } = useLang();
  if (!content) return <p className="text-gray-400 dark:text-[#636366] italic">{t('lesson_no_content')}</p>;

  switch (content.type) {
    case 'text':     return <TextRenderer c={content} lessonId={lessonId} />;
    case 'video':    return <VideoRenderer c={content} />;
    case 'dialogue': return <DialogueRenderer c={content} />;
    case 'case':     return <CaseRenderer c={content} />;
    default:         return null;
  }
}

function TextRenderer({ c, lessonId }: { c: TextContent; lessonId?: string }) {
  const { lang } = useLang();
  const body = (lang === 'ru' && c.bodyRu) ? c.bodyRu : c.body;
  const quiz = (lang === 'ru' && c.quizRu) ? c.quizRu : c.quiz;
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);

  return (
    <div>
      <div
        ref={ref}
        className="lesson-body text-gray-800 dark:text-[#f5f5f7] leading-relaxed lg:text-[17px] lg:leading-8
 [&_h2]:text-xl lg:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 dark:[&_h2]:text-[#f5f5f7] [&_h2]:mb-4 [&_h2]:mt-6 lg:[&_h2]:mt-8 first:[&_h2]:mt-0
 [&_h3]:text-lg lg:[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 dark:[&_h3]:text-[#f5f5f7] [&_h3]:mb-3 [&_h3]:mt-5 lg:[&_h3]:mt-7
 [&_p]:mb-4 [&_p]:text-gray-700 dark:[&_p]:text-[#a1a1a6] [&_p]:leading-7 lg:[&_p]:leading-8
 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-500 [&_blockquote]:pl-4 lg:[&_blockquote]:pl-6 [&_blockquote]:py-1 [&_blockquote]:my-4 lg:[&_blockquote]:my-6 [&_blockquote]:text-gray-600 dark:[&_blockquote]:text-[#a1a1a6] [&_blockquote]:italic
 [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-[#f5f5f7]
 [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-1 lg:[&_ul]:space-y-2
 [&_ol]:mb-4 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1 lg:[&_ol]:space-y-2
 [&_li]:text-gray-700 dark:[&_li]:text-[#a1a1a6]
 [&_figure]:my-6 lg:[&_figure]:my-8 [&_figure]:overflow-hidden [&_figure]:rounded-xl lg:[&_figure]:rounded-2xl [&_figure]:border [&_figure]:border-gray-100 dark:[&_figure]:border-[rgba(255,255,255,0.08)]
 [&_img]:w-full [&_img]:h-auto [&_img]:block [&_img]:object-cover lg:[&_img]:max-h-[500px] lg:[&_img]:object-contain lg:[&_img]:bg-gray-50 dark:lg:[&_img]:bg-[#2c2c2e]
 [&_figcaption]:text-xs [&_figcaption]:text-gray-500 dark:[&_figcaption]:text-[#636366] [&_figcaption]:italic [&_figcaption]:text-center [&_figcaption]:px-4 [&_figcaption]:py-2 [&_figcaption]:bg-gray-50 dark:[&_figcaption]:bg-[#2c2c2e]"
        dangerouslySetInnerHTML={{ __html: typeof window !== 'undefined' ? DOMPurify.sanitize(body, { ADD_TAGS: ['iframe'], ADD_ATTR: ['target', 'rel'] }) : body }}
      />
      {c.freightMap && <USFreightMap />}
      {c.equipmentMatcher && <EquipmentMatcher />}
      {c.driverChat && <DriverChatSimulator />}
      {c.loadBoard && <LoadBoardSimulator />}
      {c.phoneCall && <PhoneCallSimulator />}
      {c.negotiationGame && <NegotiationGame />}
      {c.crisisDashboard && <CrisisDashboard />}
      {(c.dispatcherDay || body.includes("<!-- dispatcher-day-sim -->")) && <DispatcherDaySimulator />}
      {c.brokerCall && <BrokerCallSimulator />}
      {quiz && (
        <div id="lesson-quiz-section">
          <QuizRenderer questions={quiz.questions} lessonId={lessonId} />
        </div>
      )}
      {c.simulation && <SimulationBlock />}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface PreparedQuestion { id: string; text: string; options: string[]; correctIndex: number; originalIndex: number; optionOriginalIndexes: number[]; explanation?: string }

function prepareQuestions(questions: QuizQuestion[]): PreparedQuestion[] {
  const indexedAll = questions.map((q, originalIndex) => ({ q, originalIndex }));
  return shuffle(indexedAll).map(({ q, originalIndex }) => {
    // Track each option's original index BEFORE shuffle so we can map
    // the user's shuffled selection back to the canonical position that
    // the backend expects for grading.
    const indexed = q.options.map((opt, i) => ({
      opt,
      originalOptionIndex: i,
      correct: i === q.correctIndex,
    }));
    const shuffled = shuffle(indexed);
    return {
      id: q.id,
      text: q.text,
      options: shuffled.map(x => x.opt),
      correctIndex: shuffled.findIndex(x => x.correct),
      optionOriginalIndexes: shuffled.map(x => x.originalOptionIndex),
      originalIndex,
      explanation: q.explanation,
    };
  });
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const MAX_ATTEMPTS = 3;
const FEEDBACK_DELAY = 1500;

// ── Quiz Renderer ─────────────────────────────────────────────────────────────

function QuizRenderer({ questions, lessonId }: { questions: QuizQuestion[]; lessonId?: string }) {
  const { t, lang } = useLang();
  const setUser = useAuthStore((s) => s.setUser);
  const showToast = useGamificationToast((s) => s.showToast);
  const qc = useQueryClient();

  const [attempt, setAttempt]     = useState(0);
  const [prepared, setPrepared]   = useState<PreparedQuestion[]>(() => prepareQuestions(questions));
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState<number | null>(null);
  const [finished, setFinished]   = useState(false);
  const [answers, setAnswers]     = useState<QuizAnswerEntry[]>([]);
  // Track the shuffled UI index the user clicked for each question,
  // keyed by questionId. Used to render the review screen (so we can
  // highlight the option the student actually tapped, not just the
  // canonical backend index).
  const [selectedShuffledByQ, setSelectedShuffledByQ] =
    useState<Record<string, number>>({});
  // Server-authoritative result from POST /quiz-attempts. Because
  // correctIndex is stripped from GET /lessons/:id for security, we
  // cannot grade locally — we display what the backend returns.
  const [serverResult, setServerResult] = useState<{
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    gradedAnswers: GradedAnswer[];
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Re-prepare questions only when the question set actually changes
  // (e.g. language switch), not on every React Query re-fetch.
  // Using a stable key based on question IDs prevents the review screen
  // from being wiped by the invalidateQueries() call after submission.
  const questionsKey = questions.map(q => q.id).join(',');
  useEffect(() => {
    setPrepared(prepareQuestions(questions));
    setCurrent(0);
    setSelected(null);
    setFinished(false);
    setAttempt(0);
    setAnswers([]);
    setSelectedShuffledByQ({});
    setSubmitted(false);
    setServerResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsKey]);

  const total   = prepared.length;
  const q       = prepared[current];
  // Client-side grading is impossible because correctIndex is stripped
  // from the lesson payload. All scoring comes from the server.
  const displayScore   = serverResult?.correctAnswers ?? 0;
  const displayTotal   = serverResult?.totalQuestions ?? total;
  const displayPercent = serverResult?.score ?? 0;
  const percent = displayPercent;
  // Quiz is considered passed only at >= 80% — this matches the lesson page
  // gating and the backend enforcement in lessons.service.ts.
  const passed  = percent >= QUIZ_PASS_THRESHOLD;

  const advance = useCallback(() => {
    if (current + 1 >= total) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  }, [current, total]);

  useEffect(() => {
    if (selected === null) return;
    const tm = setTimeout(advance, FEEDBACK_DELAY);
    return () => clearTimeout(tm);
  }, [selected, advance]);

  // Submit attempt to backend once when finished
  useEffect(() => {
    if (!finished || submitted || !lessonId) return;
    setSubmitted(true);
    (async () => {
      try {
        // Send zeros for score/correctAnswers — the server ignores the
        // client's count and re-grades using its canonical quiz. We send
        // 0 rather than a fake number so we never *claim* something we
        // don't know.
        const res = await quizApi.submit({
          lessonId,
          answers,
          totalQuestions: total,
          correctAnswers: 0,
          score: 0,
        });

        // Trust the server's grading — it had access to the correct
        // answers (which are stripped from the client payload).
        const verifiedScore =
          typeof res.score === 'number' ? res.score : 0;
        const verifiedCorrect =
          typeof res.correctAnswers === 'number' ? res.correctAnswers : 0;
        const verifiedTotal =
          typeof res.totalQuestions === 'number' ? res.totalQuestions : total;
        setServerResult({
          score: verifiedScore,
          correctAnswers: verifiedCorrect,
          totalQuestions: verifiedTotal,
          gradedAnswers: Array.isArray(res.gradedAnswers) ? res.gradedAnswers : [],
        });

        // Invalidate the student's quiz-attempts cache so the lesson page
        // re-evaluates the gate (enables "Mark Complete" if passed).
        qc.invalidateQueries({ queryKey: ['quiz-attempts', 'me'] });
        qc.invalidateQueries({ queryKey: ['lesson', lessonId] });

        // On pass, nudge the student to the "Mark Complete" button at the
        // bottom of the lesson page so they finish the flow.
        if (verifiedScore >= QUIZ_PASS_THRESHOLD) {
          setTimeout(() => {
            const btn = document.querySelector<HTMLElement>('button.btn-primary');
            btn?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 600);
        }

        // Refresh user from /auth/me to update XP/streak/level/achievements
        try {
          const fresh = await authApi.me();
          setUser(fresh);
        } catch { /* ignore */ }

        // Toast: show new achievement if any, else XP earned
        if (res.newAchievements && res.newAchievements.length > 0) {
          const id = res.newAchievements[0];
          const meta = ACHIEVEMENTS.find(a => a.id === id);
          showToast({
            emoji: meta?.emoji ?? '🏅',
            title: meta ? (lang === 'ru' ? meta.nameRu : meta.name) : (lang === 'ru' ? 'Новое достижение' : 'New achievement'),
            subtitle: `+${res.xpEarned} XP`,
          });
        } else if (res.xpEarned > 0) {
          showToast({
            emoji: '⚡',
            title: `+${res.xpEarned} XP`,
            subtitle: lang === 'ru' ? 'Квиз пройден' : 'Quiz complete',
          });
        }
      } catch (e) {
        // Network/backend error — fail silently so user can still continue
        console.error('Quiz submit failed', e);
      }
    })();
  }, [finished, submitted, lessonId, answers, total, setUser, showToast, lang, qc]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    // Map the shuffled UI position back to the original option index
    // that the backend's canonical quiz expects. Without this mapping
    // the backend would grade every shuffled answer as wrong.
    const originalSelectedIndex = q.optionOriginalIndexes?.[idx] ?? idx;
    setAnswers(prev => {
      const next = prev.filter(a => a.questionId !== q.id);
      next.push({ questionId: q.id, selectedIndex: originalSelectedIndex });
      return next;
    });
    // Remember which shuffled option this student clicked so the
    // review screen can highlight it even after we re-render.
    setSelectedShuffledByQ(prev => ({ ...prev, [q.id]: idx }));
  };

  const retry = () => {
    const next = attempt + 1;
    setAttempt(next);
    setPrepared(prepareQuestions(questions));
    setCurrent(0);
    setSelected(null);
    setFinished(false);
    setAnswers([]);
    setSelectedShuffledByQ({});
    setSubmitted(false);
    setServerResult(null);
  };

  // ── Result screen ──
  if (finished) {
    const waitingForServer = !serverResult;
    const gradedByQ = new Map<string, GradedAnswer>();
    if (serverResult) {
      for (const g of serverResult.gradedAnswers) gradedByQ.set(g.questionId, g);
    }

    return (
      <div className="mt-8 space-y-4 lg:max-w-xl lg:mx-auto">
        {/* Summary card */}
        <div
          className={cn(
            'rounded-2xl border p-6 lg:p-8 text-center space-y-4 transition-all',
            waitingForServer
              ? 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#2c2c2e]'
              : passed
                ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                : 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#2c2c2e]',
          )}
        >
          {waitingForServer ? (
            <>
              <p className="text-base font-semibold text-gray-900 dark:text-[#f5f5f7]">
                {lang === 'ru' ? 'Проверяем твои ответы…' : 'Grading your answers…'}
              </p>
              <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">
                {lang === 'ru'
                  ? 'Секунду — сервер проверяет каждый вопрос.'
                  : 'One moment — the server is checking each question.'}
              </p>
            </>
          ) : (
            <>
              {passed && (
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              )}

              <p className={cn(
                'text-5xl font-bold',
                passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-[#f5f5f7]',
              )}>
                {percent}%
              </p>
              <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">
                {displayScore} {t('quiz_out_of')} {displayTotal} {t('quiz_correct')}
              </p>

              {passed ? (
                <>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                    {t('quiz_goal_achieved')}
                  </p>
                  <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 font-medium">
                    {t('quiz_success_banner')}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-red-600 dark:text-red-400 font-semibold text-lg">{t('quiz_goal_not_achieved')}</p>
                  <p className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-[#a1a1a6]">
                    <Lock className="w-3.5 h-3.5" />
                    {t('quiz_locked_hint')}
                  </p>
                  {attempt + 1 >= MAX_ATTEMPTS ? (
                    <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">{t('quiz_review_material')}</p>
                  ) : (
                    <button
                      onClick={retry}
                      className="mt-2 w-full py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm active:opacity-80"
                    >
                      {t('quiz_try_again')}
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Per-question review */}
        {!waitingForServer && gradedByQ.size > 0 && (
          <div className="rounded-2xl border border-gray-200 dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#1c1c1e] p-4 lg:p-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-[#a1a1a6]">
              {lang === 'ru' ? 'Разбор ответов' : 'Answer review'}
            </p>
            <ol className="space-y-3">
              {prepared.map((pq, qi) => {
                const g = gradedByQ.get(pq.id);
                // If the backend didn't grade a question (e.g. the
                // student skipped it somehow), treat it as wrong.
                const isCorrect = g?.isCorrect === true;
                const selectedShuffledIdx = selectedShuffledByQ[pq.id];
                // Map the canonical backend correctIndex back to the
                // shuffled UI position, so the review matches what the
                // student actually saw on screen.
                const correctShuffledIdx = g
                  ? pq.optionOriginalIndexes.findIndex((oi) => oi === g.correctIndex)
                  : -1;
                const userAnswerText =
                  typeof selectedShuffledIdx === 'number'
                    ? pq.options[selectedShuffledIdx]
                    : (lang === 'ru' ? '(без ответа)' : '(no answer)');
                const correctAnswerText =
                  correctShuffledIdx >= 0 ? pq.options[correctShuffledIdx] : '';

                return (
                  <li
                    key={pq.id}
                    className={cn(
                      'rounded-xl border p-3 lg:p-4',
                      isCorrect
                        ? 'border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10'
                        : 'border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10',
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                          isCorrect
                            ? 'bg-emerald-500 text-white'
                            : 'bg-red-500 text-white',
                        )}
                        aria-label={isCorrect ? 'Correct' : 'Incorrect'}
                      >
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <p className="text-sm font-semibold text-gray-900 dark:text-[#f5f5f7] leading-snug">
                          {qi + 1}. {pq.text}
                        </p>
                        <p className="text-xs">
                          <span className="font-medium text-gray-600 dark:text-[#a1a1a6]">
                            {lang === 'ru' ? 'Твой ответ: ' : 'Your answer: '}
                          </span>
                          <span className={cn(
                            'font-semibold',
                            isCorrect
                              ? 'text-emerald-700 dark:text-emerald-300'
                              : 'text-red-700 dark:text-red-300',
                          )}>
                            {userAnswerText}
                          </span>
                        </p>
                        {!isCorrect && correctAnswerText && (
                          <p className="text-xs">
                            <span className="font-medium text-gray-600 dark:text-[#a1a1a6]">
                              {lang === 'ru' ? 'Правильный ответ: ' : 'Correct answer: '}
                            </span>
                            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                              {correctAnswerText}
                            </span>
                          </p>
                        )}
                        {!isCorrect && g?.explanation && (
                          <div className="mt-1.5 p-2 rounded-lg bg-white/60 dark:bg-[#1c1c1e]/60 border border-gray-200 dark:border-[rgba(255,255,255,0.06)]">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-[#636366] mb-0.5">
                              {lang === 'ru' ? 'Пояснение' : 'Explanation'}
                            </p>
                            <p className="text-xs text-gray-700 dark:text-[#a1a1a6] leading-relaxed">
                              {g?.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    );
  }

  // ── Question screen ──
  return (
    <div className="mt-8 space-y-4 lg:max-w-xl lg:mx-auto">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400 dark:text-[#636366] uppercase tracking-wide">{t('quiz_title')}</p>
        <p className="text-xs text-gray-400 dark:text-[#636366]">{current + 1} / {total}</p>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-100 dark:bg-[#2c2c2e] rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-300"
          style={{ width: `${((current) / total) * 100}%` }}
        />
      </div>

      <p className="text-gray-900 dark:text-[#f5f5f7] font-semibold leading-snug pt-1">{q.text}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          // We intentionally do NOT show correct/incorrect styling at
          // this stage. The client has no access to correctIndex (it's
          // stripped server-side), so any ✅/❌ shown here would be a
          // lie. Instead we just highlight the selected choice in a
          // neutral brand color and show a full per-question review
          // on the result screen once the backend has graded.
          const isSelected = selected === i;
          const hasSelected = selected !== null;

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={hasSelected}
              className={cn(
                'w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ease-out',
                !hasSelected && 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#1c1c1e] active:border-blue-400',
                hasSelected && isSelected && 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 ring-1 ring-blue-500/20 dark:ring-blue-400/15',
                hasSelected && !isSelected && 'border-gray-100 dark:border-[rgba(255,255,255,0.06)] bg-white dark:bg-[#1c1c1e] opacity-75 saturate-0',
              )}
            >
              <span className={cn(
                'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5 transition-all duration-200',
                !hasSelected && 'border-gray-300 dark:border-[#3a3a3c] text-gray-500 dark:text-[#a1a1a6]',
                hasSelected && isSelected && 'border-blue-500 bg-blue-500 text-white',
                hasSelected && !isSelected && 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] text-gray-400 dark:text-[#636366]',
              )}>
                {hasSelected && isSelected ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  OPTION_LABELS[i]
                )}
              </span>
              <span className="text-sm text-gray-900 dark:text-[#f5f5f7] leading-relaxed">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Neutral confirmation — no correctness claim until the backend grades. */}
      {selected !== null && (
        <p className="text-xs text-gray-500 dark:text-[#a1a1a6] text-center pt-1">
          {lang === 'ru'
            ? 'Принято — увидишь результат в конце'
            : 'Got it \u2014 you\u2019ll see results at the end.'}
        </p>
      )}
    </div>
  );
}

function VideoRenderer({ c }: { c: VideoContent }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-black aspect-video">
      <video
        className="w-full h-full object-contain"
        controls
        playsInline
        poster={c.posterUrl}
        preload="metadata"
      >
        <source src={c.hlsUrl} type="application/vnd.apple.mpegurl" />
      </video>
    </div>
  );
}

function DialogueRenderer({ c }: { c: DialogueContent }) {
  const { t } = useLang();
  return (
    <div className="space-y-3">
      {c.messages.map((m, i) => {
        const isDispatcher = m.role === 'dispatcher';
        return (
          <div key={i} className={cn('flex', isDispatcher ? 'justify-end' : 'justify-start')}>
            {!isDispatcher && (
              <span className="text-xs text-gray-400 dark:text-[#636366] uppercase font-medium self-end mb-1 mr-2">
                {m.role}
              </span>
            )}
            <div className={cn(
              'max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
              isDispatcher
                ? 'bg-brand-600 text-white rounded-br-sm'
                : 'bg-gray-100 dark:bg-[#2c2c2e] text-gray-800 dark:text-[#f5f5f7] rounded-bl-sm',
            )}>
              {m.text}
            </div>
            {isDispatcher && (
              <span className="text-xs text-gray-400 dark:text-[#636366] uppercase font-medium self-end mb-1 ml-2">
                {t('dialogue_you')}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CaseRenderer({ c }: { c: CaseContent }) {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-1">{t('case_scenario')}</p>
        <p className="text-gray-800 dark:text-[#f5f5f7] leading-relaxed">{c.scenario}</p>
      </div>

      <p className="font-semibold text-gray-700 dark:text-[#a1a1a6]">{t('case_what_would_you_do')}</p>
      <div className="space-y-2">
        {c.options.map((opt, i) => {
          const isChosen = selected === i;
          const showResult = selected !== null;

          return (
            <button
              key={i}
              onClick={() => selected === null && setSelected(i)}
              disabled={selected !== null}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all',
                !showResult && 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] active:border-blue-400',
                showResult && isChosen && 'border-blue-500 bg-blue-50 dark:bg-blue-500/10',
                showResult && !isChosen && 'border-gray-100 dark:border-[rgba(255,255,255,0.06)] opacity-60',
              )}
            >
              <p className="font-medium text-gray-800 dark:text-[#f5f5f7]">{opt.label}</p>
              {selected !== null && (
                <p className="text-sm mt-1 text-gray-600 dark:text-[#a1a1a6]">{opt.explanation}</p>
              )}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className="text-xs text-gray-400 dark:text-[#636366] text-center">
          {lang === 'ru' ? 'Прочитайте объяснения ко всем вариантам.' : 'Read the explanations for all options.'}
        </p>
      )}
    </div>
  );
}
