'use client';
import { useQuery } from '@tanstack/react-query';
import { adminApi, type DetailedStudent } from '@/lib/api/admin';
import { dailyExamsApi } from '@/lib/api/daily-exams';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useLang } from '@/lib/i18n/lang-context';
import Link from 'next/link';
import { useState } from 'react';
import { GraduationCap, ChevronRight, ArrowUpDown, Trophy, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const CH_NAMES = ['Intro', 'Geo', 'Equip', 'Docs', 'Board', 'Broker', 'Driver', 'Bid', 'Crisis'];

type SortKey = 'name' | 'progress' | 'score';

export default function ManagerDashboard() {
  const { lang } = useLang();
  const user = useAuthStore(s => s.user);
  const { data: detailed = [] } = useQuery({ queryKey: ['detailed-progress'], queryFn: adminApi.detailed });
  const { data: examStats = [] } = useQuery({ queryKey: ['exam-stats'], queryFn: dailyExamsApi.getStats });
  const [sortBy, setSortBy] = useState<SortKey>('progress');
  const [sortAsc, setSortAsc] = useState(false);

  const totalStudents = detailed.length;
  const graduated = detailed.filter(s => s.completedChapters >= 9).length;
  const totalExamsPassed = examStats.reduce((a: number, s: any) => a + (s.passed ?? 0), 0);

  // Sort
  const sorted = [...detailed].sort((a, b) => {
    let diff = 0;
    if (sortBy === 'name') diff = a.name.localeCompare(b.name);
    else if (sortBy === 'progress') diff = a.completedChapters - b.completedChapters || a.totalLessons - b.totalLessons;
    else diff = (a.avgScore ?? -1) - (b.avgScore ?? -1);
    return sortAsc ? diff : -diff;
  });

  // Top & Bottom — by progress (chapters + lessons), then by score
  const ranked = [...detailed].sort((a, b) =>
    b.completedChapters - a.completedChapters ||
    b.totalLessons - a.totalLessons ||
    (b.avgScore ?? 0) - (a.avgScore ?? 0)
  );
  const top3 = ranked.slice(0, 3);
  const bottom3 = ranked.length > 3 ? ranked.slice(-3).reverse() : [];

  function toggleSort(key: SortKey) {
    if (sortBy === key) setSortAsc(!sortAsc);
    else { setSortBy(key); setSortAsc(false); }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-6 pb-8 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-[#f5f5f7]">
          {lang === 'ru' ? 'Привет' : 'Hi'}, {user?.firstName} 👋
        </h1>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold font-mono text-gray-900 dark:text-[#f5f5f7]">{totalStudents}</p>
          <p className="text-[11px] text-gray-400 dark:text-[#636366] mt-1">{lang === 'ru' ? 'Студентов' : 'Students'}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold font-mono text-emerald-600">{graduated}</p>
          <p className="text-[11px] text-gray-400 dark:text-[#636366] mt-1">{lang === 'ru' ? 'Закончили курс' : 'Finished Course'}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold font-mono text-blue-600">{totalExamsPassed}</p>
          <p className="text-[11px] text-gray-400 dark:text-[#636366] mt-1">{lang === 'ru' ? 'Экзаменов сдано' : 'Exams Passed'}</p>
        </div>
      </div>

      {/* Top & Bottom */}
      {totalStudents > 0 && (
        <div className="grid lg:grid-cols-2 gap-3">
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f5f5f7]">{lang === 'ru' ? 'Лучшие' : 'Top Students'}</h3>
            </div>
            {top3.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'Пока нет данных' : 'No data yet'}</p>
            ) : (
              <div className="space-y-2.5">
                {top3.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2.5">
                    <span className={cn('text-sm font-bold w-5', i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400 dark:text-[#636366]' : 'text-amber-700')}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                    </span>
                    <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">{s.name.charAt(0)}</div>
                    <span className="text-sm text-gray-900 dark:text-[#f5f5f7] flex-1 truncate">{s.name}</span>
                    <span className="text-xs font-mono text-gray-500 dark:text-[#a1a1a6]">{s.completedChapters}/9 {lang === 'ru' ? 'гл' : 'ch'}</span>
                    <span className="text-sm font-mono font-bold text-emerald-600">{s.avgScore != null ? `${s.avgScore}%` : '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-[#f5f5f7]">{lang === 'ru' ? 'Отстающие' : 'Need Help'}</h3>
            </div>
            {bottom3.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'Все молодцы!' : 'Everyone is doing great!'}</p>
            ) : (
              <div className="space-y-2.5">
                {bottom3.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-red-400 w-5">#{ranked.length - i}</span>
                    <div className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-700">{s.name.charAt(0)}</div>
                    <span className="text-sm text-gray-900 dark:text-[#f5f5f7] flex-1 truncate">{s.name}</span>
                    <span className="text-xs font-mono text-gray-500 dark:text-[#a1a1a6]">{s.completedChapters}/9 {lang === 'ru' ? 'гл' : 'ch'}</span>
                    <span className="text-sm font-mono font-bold text-red-500">{s.avgScore != null ? `${s.avgScore}%` : '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main progress table */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-[#f5f5f7]">{lang === 'ru' ? 'Прогресс студентов' : 'Student Progress'}</h2>
          <Link href="/manager/students" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer">
            {lang === 'ru' ? 'Управление' : 'Manage'} <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {totalStudents === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'Нет студентов' : 'No students'}</p>
            <Link href="/manager/students" className="text-xs text-emerald-600 mt-2 inline-block cursor-pointer">{lang === 'ru' ? 'Добавить →' : 'Add →'}</Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="hidden lg:flex items-center px-5 py-2 bg-gray-50/80 border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)] gap-1">
              <SortHeader label={lang === 'ru' ? 'Студент' : 'Student'} field="name" current={sortBy} asc={sortAsc} onClick={toggleSort} className="w-36" />
              <div className="flex-1 flex items-center gap-0">
                {CH_NAMES.map((n, i) => (
                  <div key={i} className="flex-1 text-center text-[9px] font-mono text-gray-400 dark:text-[#636366] uppercase">{n}</div>
                ))}
              </div>
              <SortHeader label={lang === 'ru' ? 'Рейтинг' : 'Rating'} field="score" current={sortBy} asc={sortAsc} onClick={toggleSort} className="w-20 justify-end" />
            </div>

            <div className="divide-y divide-gray-50">
              {sorted.map((s, idx) => (
                <StudentRow key={s.id} student={s} rank={idx + 1} lang={lang} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SortHeader({ label, field, current, asc, onClick, className }: {
  label: string; field: SortKey; current: SortKey; asc: boolean; onClick: (k: SortKey) => void; className?: string;
}) {
  const active = current === field;
  return (
    <button onClick={() => onClick(field)} className={cn('flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-colors', active ? 'text-emerald-600' : 'text-gray-400 dark:text-[#636366] hover:text-gray-600 dark:hover:text-[#f5f5f7]', className)}>
      {label}
      <ArrowUpDown className={cn('w-3 h-3', active ? 'text-emerald-500' : 'text-gray-300 dark:text-[#636366]')} />
    </button>
  );
}

function StudentRow({ student: s, rank, lang }: { student: DetailedStudent; rank: number; lang: string }) {
  const [hoveredCh, setHoveredCh] = useState<number | null>(null);

  const rankColor = rank <= 3 ? 'text-amber-500' : rank >= (10) ? 'text-red-400' : 'text-gray-400 dark:text-[#636366]';

  return (
    <div className="flex items-center px-5 py-2.5 gap-1 hover:bg-gray-50/50 transition-colors group relative">
      {/* Rank + Name */}
      <div className="w-36 flex items-center gap-2 flex-shrink-0">
        <span className={cn('text-[10px] font-bold font-mono w-4', rankColor)}>#{rank}</span>
        <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 flex-shrink-0">
          {s.name.charAt(0)}
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-[#f5f5f7] truncate">{s.name}</p>
      </div>

      {/* Chapter progress grid */}
      <div className="flex-1 flex items-center gap-0.5 relative">
        {s.chapters.map((ch) => {
          // Each chapter = 4 segments (lessons)
          const lessonsCompleted = ch.lessons.filter(l => l.status === 'COMPLETED').length;
          const lessonsInProgress = ch.lessons.filter(l => l.status === 'IN_PROGRESS').length;

          // Color: green if all done + exam passed, partial green for lessons done, yellow for in-progress, gray for locked
          let bgColor = 'bg-gray-100 dark:bg-[#2c2c2e]';
          if (ch.examPassed) bgColor = 'bg-emerald-500';
          else if (ch.testPassed) bgColor = 'bg-emerald-400';
          else if (lessonsCompleted === 4) bgColor = 'bg-emerald-300';
          else if (lessonsCompleted > 0) bgColor = 'bg-amber-400';
          else if (lessonsInProgress > 0) bgColor = 'bg-amber-200';

          const isHovered = hoveredCh === ch.chapter;

          return (
            <div
              key={ch.chapter}
              className="flex-1 relative"
              onMouseEnter={() => setHoveredCh(ch.chapter)}
              onMouseLeave={() => setHoveredCh(null)}
            >
              {/* Main bar */}
              <div className="flex gap-px h-3">
                {ch.lessons.map((l, li) => {
                  let lColor = 'bg-gray-100 dark:bg-[#2c2c2e]';
                  if (l.status === 'COMPLETED') lColor = ch.examPassed ? 'bg-emerald-500' : 'bg-emerald-400';
                  else if (l.status === 'IN_PROGRESS') lColor = 'bg-amber-300';
                  return (
                    <div key={li} className={cn('flex-1 rounded-sm transition-all', lColor, isHovered && 'ring-1 ring-gray-300')} />
                  );
                })}
              </div>

              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-gray-900 text-white text-[10px] rounded-lg px-3 py-2 whitespace-nowrap shadow-lg pointer-events-none">
                  <p className="font-semibold">{lang === 'ru' ? 'Гл' : 'Ch'}.{ch.chapter}: {CH_NAMES[ch.chapter - 1]}</p>
                  <p className="text-gray-300 dark:text-[#636366] mt-0.5">
                    {lang === 'ru' ? 'Уроки' : 'Lessons'}: {lessonsCompleted}/4
                    {ch.testScore != null && ` · ${lang === 'ru' ? 'Тест' : 'Test'}: ${ch.testScore}%`}
                    {ch.examPassed && ` · ✓ ${lang === 'ru' ? 'Экзамен' : 'Exam'}`}
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Score */}
      <div className="w-20 text-right">
        <span className={cn('text-sm font-bold font-mono',
          s.avgScore == null ? 'text-gray-300 dark:text-[#636366]' :
          s.avgScore >= 80 ? 'text-emerald-600' :
          s.avgScore >= 60 ? 'text-amber-600' : 'text-red-500'
        )}>
          {s.avgScore != null ? `${s.avgScore}%` : '—'}
        </span>
      </div>
    </div>
  );
}
