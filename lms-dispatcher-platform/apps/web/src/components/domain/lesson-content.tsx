'use client';
import type { TextContent, VideoContent, DialogueContent, CaseContent, QuizQuestion } from '@/types';
import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
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

type Content = TextContent | VideoContent | DialogueContent | CaseContent | undefined;

/* ── Scroll-reveal hook ───────────────────────────────────────────────────── */
function useScrollReveal(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>(
      'h2, h3, p, blockquote, ul, ol, .scroll-reveal'
    );

    // stagger initial delay based on DOM order
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

export function LessonContent({ content }: { content: Content }) {
  const { t } = useLang();
  if (!content) return <p className="text-gray-400 dark:text-[#636366] italic">{t('lesson_no_content')}</p>;

  switch (content.type) {
    case 'text':     return <TextRenderer c={content} />;
    case 'video':    return <VideoRenderer c={content} />;
    case 'dialogue': return <DialogueRenderer c={content} />;
    case 'case':     return <CaseRenderer c={content} />;
    default:         return null;
  }
}

function TextRenderer({ c }: { c: TextContent }) {
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
        dangerouslySetInnerHTML={{ __html: body }}
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
      {quiz && <QuizRenderer questions={quiz.questions} />}
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

interface PreparedQuestion { text: string; options: string[]; correctIndex: number }

function prepareQuestions(questions: QuizQuestion[]): PreparedQuestion[] {
  return shuffle(questions).map(q => {
    const indexed = q.options.map((opt, i) => ({ opt, correct: i === q.correctIndex }));
    const shuffled = shuffle(indexed);
    return {
      text: q.text,
      options: shuffled.map(x => x.opt),
      correctIndex: shuffled.findIndex(x => x.correct),
    };
  });
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const MAX_ATTEMPTS = 3;
const FEEDBACK_DELAY = 1500;

// ── Quiz Renderer ─────────────────────────────────────────────────────────────

function QuizRenderer({ questions }: { questions: QuizQuestion[] }) {
  const { t } = useLang();
  const [attempt, setAttempt]     = useState(0);
  const [prepared, setPrepared]   = useState<PreparedQuestion[]>(() => prepareQuestions(questions));
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState<number | null>(null);
  const [score, setScore]         = useState(0);
  const [finished, setFinished]   = useState(false);

  // Re-prepare questions when the questions array changes (language switch)
  useEffect(() => {
    setPrepared(prepareQuestions(questions));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAttempt(0);
  }, [questions]);

  const total   = prepared.length;
  const q       = prepared[current];
  const percent = Math.round((score / total) * 100);
  const passed  = score >= total - 2;

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
    const t = setTimeout(advance, FEEDBACK_DELAY);
    return () => clearTimeout(t);
  }, [selected, advance]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    if (idx === q.correctIndex) setScore(s => s + 1);
    setSelected(idx);
  };

  const retry = () => {
    const next = attempt + 1;
    setAttempt(next);
    setPrepared(prepareQuestions(questions));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  // ── Result screen ──
  if (finished) {
    return (
      <div className="mt-8 rounded-2xl border border-gray-200 dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#2c2c2e] p-6 lg:p-8 text-center space-y-4 lg:max-w-xl lg:mx-auto">
        <p className="text-4xl font-bold text-gray-900 dark:text-[#f5f5f7]">{percent}%</p>
        <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">{score} {t('quiz_out_of')} {total} {t('quiz_correct')}</p>

        {passed ? (
          <>
            <p className="text-green-600 dark:text-emerald-400 font-semibold text-lg">{t('quiz_goal_achieved')}</p>
            <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">{t('quiz_proceed')}</p>
          </>
        ) : (
          <>
            <p className="text-red-500 font-semibold text-lg">{t('quiz_goal_not_achieved')}</p>
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
          const isSelected = selected === i;
          const isCorrect  = i === q.correctIndex;
          const showResult = selected !== null;

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={cn(
                'w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200',
                !showResult && 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] active:border-brand-400',
                showResult && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-500/10',
                showResult && isSelected && !isCorrect && 'border-red-400 bg-red-50 dark:bg-red-500/10',
                showResult && !isSelected && !isCorrect && 'border-gray-100 dark:border-[rgba(255,255,255,0.06)] opacity-40',
              )}
            >
              <span className={cn(
                'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5',
                !showResult && 'border-gray-300 dark:border-[#3a3a3c] text-gray-400 dark:text-[#636366]',
                showResult && isCorrect && 'border-green-500 bg-green-500 text-white',
                showResult && isSelected && !isCorrect && 'border-red-400 bg-red-400 text-white',
                showResult && !isSelected && !isCorrect && 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] text-gray-300 dark:text-[#636366]',
              )}>
                {OPTION_LABELS[i]}
              </span>
              <span className="text-sm text-gray-800 dark:text-[#f5f5f7] leading-relaxed">{opt}</span>
            </button>
          );
        })}
      </div>
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
  const { t } = useLang();
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
          const isChosen  = selected === i;
          const isCorrect = i === c.correctIndex;
          const showResult = selected !== null;

          return (
            <button
              key={i}
              onClick={() => selected === null && setSelected(i)}
              disabled={selected !== null}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all',
                !showResult && 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] active:border-brand-400',
                showResult && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-500/10',
                showResult && isChosen && !isCorrect && 'border-red-400 bg-red-50 dark:bg-red-500/10',
                showResult && !isChosen && !isCorrect && 'border-gray-100 dark:border-[rgba(255,255,255,0.06)] opacity-60',
              )}
            >
              <p className="font-medium text-gray-800 dark:text-[#f5f5f7]">{opt.label}</p>
              {showResult && (isChosen || isCorrect) && (
                <p className="text-sm mt-1 text-gray-600 dark:text-[#a1a1a6]">{opt.explanation}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
