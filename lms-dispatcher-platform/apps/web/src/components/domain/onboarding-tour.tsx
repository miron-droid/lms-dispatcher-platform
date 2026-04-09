'use client';
import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Unlock, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';
import { cn } from '@/lib/utils';

const TOUR_FLAG = 'dispatchgo-tour-seen-v1';

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  titleKey: 'tour_step1_title' | 'tour_step2_title' | 'tour_step3_title';
  bodyKey: 'tour_step1_body' | 'tour_step2_body' | 'tour_step3_body';
  accent: string;
}

const STEPS: Step[] = [
  { icon: BookOpen,     titleKey: 'tour_step1_title', bodyKey: 'tour_step1_body', accent: 'bg-emerald-500' },
  { icon: CheckCircle2, titleKey: 'tour_step2_title', bodyKey: 'tour_step2_body', accent: 'bg-emerald-500' },
  { icon: Unlock,       titleKey: 'tour_step3_title', bodyKey: 'tour_step3_body', accent: 'bg-emerald-500' },
];

export function OnboardingTour() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = localStorage.getItem(TOUR_FLAG);
    if (!seen) {
      // Small delay so the page has time to render first
      const id = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(id);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(TOUR_FLAG, '1');
    setOpen(false);
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else dismiss();
  }

  function prev() {
    if (step > 0) setStep(step - 1);
  }

  if (!open) return null;

  const S = STEPS[step];
  const Icon = S.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadein"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <button
          onClick={dismiss}
          aria-label="Close tour"
          className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Accent header */}
        <div className={cn('h-1.5 w-full', S.accent)} />

        <div className="px-6 pt-7 pb-5 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            {t('tour_step_of').replace('{n}', String(step + 1)).replace('{total}', String(STEPS.length))}
          </p>
          <h2 id="tour-title" className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7] mb-2">
            {t(S.titleKey)}
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-[#a1a1a6]">
            {t(S.bodyKey)}
          </p>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 pb-4">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === step ? 'w-6 bg-emerald-500' : 'w-1.5 bg-gray-200 dark:bg-white/15',
              )}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-5 pb-5">
          {step > 0 ? (
            <button
              onClick={prev}
              className="flex-1 flex items-center justify-center gap-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-[#f5f5f7] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('tour_back')}
            </button>
          ) : (
            <button
              onClick={dismiss}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 dark:text-[#a1a1a6] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              {t('tour_skip')}
            </button>
          )}
          <button
            onClick={next}
            className="flex-[1.4] flex items-center justify-center gap-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-sm transition-colors"
          >
            {step === STEPS.length - 1 ? t('tour_get_started') : t('tour_next')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
