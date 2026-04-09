'use client';
import Link from 'next/link';
import { PlayCircle, Sparkles } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';

interface Props {
  firstChapterId?: string;
  firstChapterTitle: string;
}

export function EmptyStateCard({ firstChapterId, firstChapterTitle }: Props) {
  const { t, translateTitle } = useLang();

  return (
    <div className="relative mb-5 rounded-3xl overflow-hidden border border-emerald-200/60 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 dark:from-emerald-500/10 dark:via-[#1c1c1e] dark:to-emerald-500/5 p-6 lg:p-8 shadow-sm">
      {/* Decorative glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
      <div className="relative">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold mb-3">
          <Sparkles className="w-3 h-3" />
          {t('empty_badge')}
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-[#f5f5f7] leading-tight mb-1.5">
          {t('empty_welcome_title')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-[#a1a1a6] mb-4 max-w-md">
          {t('empty_welcome_body').replace('{chapter}', translateTitle(firstChapterTitle))}
        </p>
        <Link
          href={firstChapterId ? `/learn/chapters/${firstChapterId}` : '#'}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-sm transition-colors active:scale-[0.98]"
        >
          <PlayCircle className="w-5 h-5" />
          {t('empty_cta_begin')}
        </Link>
      </div>
    </div>
  );
}
