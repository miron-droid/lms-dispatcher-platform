'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  translations,
  Lang,
  TranslationKey,
  chapterTitlesRu,
  lessonTypePrefixRu,
} from './translations';

interface LangContextValue {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
  /** Translates a chapter title or lesson title stored in the DB (English → RU). */
  translateTitle: (title: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  toggleLang: () => {},
  t: (key) => translations.en[key],
  translateTitle: (title) => title,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('lms-lang') as Lang | null;
    if (stored === 'en' || stored === 'ru') setLang(stored);
  }, []);

  function toggleLang() {
    setLang((prev) => {
      const next: Lang = prev === 'en' ? 'ru' : 'en';
      localStorage.setItem('lms-lang', next);
      return next;
    });
  }

  const t = (key: TranslationKey): string => translations[lang][key];

  /**
   * Translates DB-stored English titles to Russian when lang === 'ru'.
   *
   * Handles two formats:
   *   1. Chapter title:  "Introduction to US Trucking"
   *   2. Lesson title:   "Intro — Introduction to US Trucking"
   */
  function translateTitle(title: string): string {
    if (lang === 'en') return title;

    // Try direct chapter title lookup first
    if (chapterTitlesRu[title]) return chapterTitlesRu[title];

    // Try lesson title pattern: "{TypeLabel} — {Chapter title}"
    const sep = ' — ';
    const idx = title.indexOf(sep);
    if (idx !== -1) {
      const typeLabel   = title.slice(0, idx);
      const chapterPart = title.slice(idx + sep.length);
      const ruType    = lessonTypePrefixRu[typeLabel]  ?? typeLabel;
      const ruChapter = chapterTitlesRu[chapterPart]   ?? chapterPart;
      return `${ruType} — ${ruChapter}`;
    }

    return title;
  }

  return (
    <LangContext.Provider value={{ lang, toggleLang, t, translateTitle }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
