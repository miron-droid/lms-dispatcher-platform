'use client';
import { useState } from 'react';
import { DispatchGlossary } from '@/components/domain/dispatch-glossary';
import { StateFreightDictionary } from '@/components/domain/state-freight-dictionary';
import { useLang } from '@/lib/i18n/lang-context';
import { cn } from '@/lib/utils';
import { BookOpen, Map } from 'lucide-react';

export default function GlossaryPage() {
  const { lang } = useLang();
  const [tab, setTab] = useState<'glossary' | 'states'>('glossary');

  return (
    <div className="px-4 pt-14 lg:pt-6 pb-24 lg:pb-4 max-w-2xl lg:max-w-5xl mx-auto">
      {/* Tab switcher */}
      <div className="flex gap-2 mb-4 p-1 rounded-2xl bg-gray-100 dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/[0.06]">
        <button
          onClick={() => setTab('glossary')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer',
            tab === 'glossary'
              ? 'bg-white dark:bg-[#2c2c2e] text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-gray-500 dark:text-[#a1a1a6] hover:text-gray-700 dark:hover:text-[#f5f5f7]',
          )}
        >
          <BookOpen className="w-4 h-4" />
          {lang === 'ru' ? 'Словарь' : 'Glossary'}
        </button>
        <button
          onClick={() => setTab('states')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer',
            tab === 'states'
              ? 'bg-white dark:bg-[#2c2c2e] text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-gray-500 dark:text-[#a1a1a6] hover:text-gray-700 dark:hover:text-[#f5f5f7]',
          )}
        >
          <Map className="w-4 h-4" />
          {lang === 'ru' ? 'Штаты США' : 'US States'}
        </button>
      </div>

      {tab === 'glossary' ? <DispatchGlossary /> : <StateFreightDictionary />}
    </div>
  );
}
