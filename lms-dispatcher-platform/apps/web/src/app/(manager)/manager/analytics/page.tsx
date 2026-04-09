'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  BarChart,
  Bar,
  Cell,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import {
  Users,
  Activity,
  TrendingUp,
  Target,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { useLang } from '@/lib/i18n/lang-context';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const STALE = 60 * 1000; // 60 seconds

const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const DAYS_FULL_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_FULL_RU = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

// ─────────────────────────────────────────────────────────────
// Shared primitives (Apple dark first)
// ─────────────────────────────────────────────────────────────

function Card({
  children,
  className,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-2xl bg-white dark:bg-[#1c1c1e]',
        'border border-gray-200 dark:border-white/10',
        'shadow-sm',
        className,
      )}
    >
      {(title || subtitle) && (
        <header className="px-5 pt-5 pb-3">
          {title && (
            <h2 className="text-base font-semibold text-gray-900 dark:text-[#f5f5f7]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xs text-gray-600 dark:text-[#a1a1a6] mt-0.5">
              {subtitle}
            </p>
          )}
        </header>
      )}
      <div className="px-5 pb-5">{children}</div>
    </section>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-gray-100 dark:bg-[#2c2c2e]',
        className,
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// KPI cards
// ─────────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  label,
  value,
  suffix,
  tone = 'emerald',
  loading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  suffix?: string;
  tone?: 'emerald' | 'blue' | 'amber' | 'violet';
  loading?: boolean;
}) {
  const toneMap: Record<string, string> = {
    emerald: 'text-emerald-500 bg-emerald-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    amber: 'text-amber-500 bg-amber-500/10',
    violet: 'text-violet-500 bg-violet-500/10',
  };
  return (
    <Card className="p-0">
      <div className="flex items-center gap-4 px-5 py-5">
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
            toneMap[tone],
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-wide font-medium text-gray-600 dark:text-[#a1a1a6]">
            {label}
          </div>
          {loading ? (
            <Skeleton className="h-7 w-20 mt-1" />
          ) : (
            <div className="text-2xl font-bold text-gray-900 dark:text-[#f5f5f7] tabular-nums">
              {value}
              {suffix && (
                <span className="text-base font-semibold text-gray-500 dark:text-[#a1a1a6] ml-0.5">
                  {suffix}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Activity line chart
// ─────────────────────────────────────────────────────────────

function ActivityChart({ lang }: { lang: 'en' | 'ru' }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'activity', 30],
    queryFn: () => adminApi.getActivity(30),
    staleTime: STALE,
  });

  const series = data?.days ?? [];
  const hasData = series.length > 0;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      title={lang === 'ru' ? 'Активность (последние 30 дней)' : 'Daily activity (last 30 days)'}
      subtitle={
        lang === 'ru'
          ? 'Уроки, квизы и активные пользователи'
          : 'Lessons completed, quiz attempts and active users'
      }
    >
      {isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : !hasData ? (
        <EmptyState
          label={lang === 'ru' ? 'Пока нет данных об активности' : 'No activity data yet'}
        />
      ) : (
        <div className="h-72 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gLessons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gQuiz" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
              <XAxis
                dataKey="date"
                stroke="#8e8e93"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatDate}
                minTickGap={20}
              />
              <YAxis
                stroke="#8e8e93"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <RTooltip
                contentStyle={{
                  backgroundColor: '#2c2c2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  color: '#f5f5f7',
                  fontSize: 12,
                }}
                labelFormatter={(v) => formatDate(String(v))}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="lessonsCompleted"
                name={lang === 'ru' ? 'Уроки' : 'Lessons'}
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#gLessons)"
              />
              <Area
                type="monotone"
                dataKey="quizAttempts"
                name={lang === 'ru' ? 'Квизы' : 'Quizzes'}
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#gQuiz)"
              />
              <Area
                type="monotone"
                dataKey="activeUsers"
                name={lang === 'ru' ? 'Активные' : 'Active users'}
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#gUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Heatmap — custom grid 24h × 7d
// ─────────────────────────────────────────────────────────────

function Heatmap({ lang }: { lang: 'en' | 'ru' }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'heatmap'],
    queryFn: adminApi.getHeatmap,
    staleTime: STALE,
  });

  const DAYS_SHORT = lang === 'ru' ? DAYS_RU : DAYS_EN;
  const DAYS_FULL = lang === 'ru' ? DAYS_FULL_RU : DAYS_FULL_EN;

  // lookup: map[day][hour] = count
  const { map, max } = useMemo(() => {
    const m: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    let mx = 0;
    for (const cell of data?.heatmap ?? []) {
      if (cell.dayOfWeek >= 0 && cell.dayOfWeek < 7 && cell.hour >= 0 && cell.hour < 24) {
        m[cell.dayOfWeek][cell.hour] = cell.count;
        if (cell.count > mx) mx = cell.count;
      }
    }
    return { map: m, max: data?.max ?? mx };
  }, [data]);

  // intensity → tailwind class (from emerald-100 to emerald-500) using inline bg
  const cellBg = (count: number): string => {
    if (!count || max === 0) return 'rgba(148,163,184,0.08)';
    const ratio = Math.min(count / max, 1);
    // interpolate emerald-100 (#d1fae5) → emerald-500 (#10b981)
    // simpler: use opacity on emerald-500
    const alpha = 0.15 + ratio * 0.85;
    return `rgba(16,185,129,${alpha})`;
  };

  return (
    <Card
      title={lang === 'ru' ? 'Когда студенты учатся' : 'When students study'}
      subtitle={
        lang === 'ru'
          ? 'Активность по часам и дням недели'
          : 'Activity by hour of day and day of week'
      }
    >
      {isLoading ? (
        <Skeleton className="h-60 w-full" />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Hour labels */}
            <div className="flex items-center gap-1 pl-10 mb-1">
              {Array.from({ length: 24 }).map((_, h) => (
                <div
                  key={h}
                  className="flex-1 text-[9px] text-center text-gray-500 dark:text-[#636366] tabular-nums"
                >
                  {h % 3 === 0 ? h : ''}
                </div>
              ))}
            </div>
            {/* Rows */}
            <div className="space-y-1">
              {Array.from({ length: 7 }).map((_, d) => (
                <div key={d} className="flex items-center gap-1">
                  <div className="w-9 text-[11px] text-gray-600 dark:text-[#a1a1a6] font-medium">
                    {DAYS_SHORT[d]}
                  </div>
                  {Array.from({ length: 24 }).map((_, h) => {
                    const count = map[d][h];
                    return (
                      <div
                        key={h}
                        title={`${DAYS_FULL[d]} ${String(h).padStart(2, '0')}:00 — ${count} ${
                          lang === 'ru' ? 'активностей' : 'activities'
                        }`}
                        className="flex-1 aspect-square rounded-[3px] border border-white/5 transition-transform hover:scale-110 hover:ring-1 hover:ring-emerald-400 cursor-pointer"
                        style={{ backgroundColor: cellBg(count) }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-gray-500 dark:text-[#636366]">
              <span>{lang === 'ru' ? 'меньше' : 'less'}</span>
              {[0.15, 0.35, 0.55, 0.75, 1].map((a, i) => (
                <div
                  key={i}
                  className="w-4 h-3 rounded-sm border border-white/5"
                  style={{ backgroundColor: `rgba(16,185,129,${a})` }}
                />
              ))}
              <span>{lang === 'ru' ? 'больше' : 'more'}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Funnel — horizontal custom bars
// ─────────────────────────────────────────────────────────────

function Funnel({ lang }: { lang: 'en' | 'ru' }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'funnel'],
    queryFn: adminApi.getFunnel,
    staleTime: STALE,
  });

  const stages = data?.stages ?? [];
  const maxCount = stages[0]?.count ?? 0;

  return (
    <Card
      title={lang === 'ru' ? 'Воронка прохождения' : 'Conversion funnel'}
      subtitle={
        lang === 'ru'
          ? 'От регистрации до полного курса'
          : 'From signup to full completion'
      }
    >
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : stages.length === 0 ? (
        <EmptyState label={lang === 'ru' ? 'Нет данных воронки' : 'No funnel data'} />
      ) : (
        <div className="space-y-2">
          {stages.map((stage, i) => {
            const widthPct =
              maxCount > 0 ? Math.max((stage.count / maxCount) * 100, 8) : 8;
            const prev = i > 0 ? stages[i - 1] : null;
            const drop =
              prev && prev.count > 0
                ? Math.round(((prev.count - stage.count) / prev.count) * 100)
                : 0;
            return (
              <div key={stage.key}>
                {/* drop-off arrow between */}
                {i > 0 && drop > 0 && (
                  <div className="flex items-center gap-1 pl-4 mb-1 text-[10px] text-red-500">
                    <ChevronRight className="w-3 h-3 rotate-90" />
                    <span>
                      −{drop}% {lang === 'ru' ? 'отсеялось' : 'drop-off'}
                    </span>
                  </div>
                )}
                <div className="relative">
                  <div
                    className="h-11 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center px-4 transition-all"
                    style={{ width: `${widthPct}%` }}
                  >
                    <span className="text-white text-sm font-semibold truncate">
                      {stage.label}
                    </span>
                  </div>
                  <div className="absolute top-0 right-0 h-11 flex items-center gap-3 pl-4 pr-1 text-sm">
                    <span className="font-bold tabular-nums text-gray-900 dark:text-[#f5f5f7]">
                      {stage.count.toLocaleString()}
                    </span>
                    <span className="text-gray-600 dark:text-[#a1a1a6] tabular-nums">
                      {stage.percent}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Chapter difficulty bar chart
// ─────────────────────────────────────────────────────────────

function ChapterDifficultyChart({ lang }: { lang: 'en' | 'ru' }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'chapter-difficulty'],
    queryFn: adminApi.getChapterDifficulty,
    staleTime: STALE,
  });

  const chapters = data?.chapters ?? [];

  const colorFor = (score: number): string => {
    if (score >= 80) return '#10b981'; // emerald
    if (score >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <Card
      title={lang === 'ru' ? 'Сложность глав' : 'Chapter difficulty'}
      subtitle={
        lang === 'ru'
          ? 'Средний балл и процент сдачи по главам'
          : 'Avg score and pass rate per chapter'
      }
    >
      {isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : chapters.length === 0 ? (
        <EmptyState label={lang === 'ru' ? 'Нет данных по главам' : 'No chapter data'} />
      ) : (
        <div className="h-72 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chapters} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
              <XAxis
                dataKey="chapter"
                stroke="#8e8e93"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${lang === 'ru' ? 'Гл.' : 'Ch.'} ${v}`}
              />
              <YAxis
                stroke="#8e8e93"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                width={35}
                tickFormatter={(v) => `${v}%`}
              />
              <RTooltip
                contentStyle={{
                  backgroundColor: '#2c2c2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  color: '#f5f5f7',
                  fontSize: 12,
                }}
                formatter={(value: any, _name: any, ctx: any) => {
                  const v = Number(value) || 0;
                  const c = ctx?.payload;
                  return [
                    `${Math.round(v)}% ${lang === 'ru' ? 'средний' : 'avg'} · ${Math.round(
                      c?.passRate ?? 0,
                    )}% ${lang === 'ru' ? 'сдали' : 'pass'}`,
                    c?.title ?? '',
                  ] as [string, string];
                }}
                labelFormatter={(v) => `${lang === 'ru' ? 'Глава' : 'Chapter'} ${v}`}
              />
              <Bar dataKey="avgScore" radius={[6, 6, 0, 0]}>
                {chapters.map((c) => (
                  <Cell key={c.chapter} fill={colorFor(c.avgScore)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Hardest questions table
// ─────────────────────────────────────────────────────────────

function HardestQuestions({ lang }: { lang: 'en' | 'ru' }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'question-stats'],
    queryFn: adminApi.getQuestionStats,
    staleTime: STALE,
  });

  const questions = useMemo(() => {
    const list = [...(data?.questions ?? [])];
    list.sort((a, b) => a.correctRate - b.correctRate);
    return list.slice(0, 20);
  }, [data]);

  const difficultyBadge = (rate: number) => {
    if (rate < 50) {
      return {
        label: lang === 'ru' ? 'Сложный' : 'Hard',
        cls: 'bg-red-500/15 text-red-500 border-red-500/30',
      };
    }
    if (rate < 75) {
      return {
        label: lang === 'ru' ? 'Средний' : 'Medium',
        cls: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
      };
    }
    return {
      label: lang === 'ru' ? 'Лёгкий' : 'Easy',
      cls: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    };
  };

  const truncate = (s: string, n = 80) =>
    s.length > n ? s.slice(0, n - 1) + '…' : s;

  return (
    <Card
      title={lang === 'ru' ? 'Самые сложные вопросы' : 'Hardest questions'}
      subtitle={
        lang === 'ru'
          ? 'Отсортированы по проценту правильных ответов'
          : 'Sorted by correct-answer rate, hardest first'
      }
    >
      {isLoading ? (
        <Skeleton className="h-60 w-full" />
      ) : questions.length === 0 ? (
        <EmptyState
          label={lang === 'ru' ? 'Нет данных по вопросам' : 'No question stats yet'}
        />
      ) : (
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-[#636366] border-b border-gray-200 dark:border-white/10">
                <th className="px-5 py-2 text-left font-medium w-10">#</th>
                <th className="px-2 py-2 text-left font-medium w-20">
                  {lang === 'ru' ? 'Глава' : 'Chapter'}
                </th>
                <th className="px-2 py-2 text-left font-medium">
                  {lang === 'ru' ? 'Вопрос' : 'Question'}
                </th>
                <th className="px-2 py-2 text-right font-medium w-20">
                  {lang === 'ru' ? 'Попыток' : 'Attempts'}
                </th>
                <th className="px-2 py-2 text-right font-medium w-24">
                  {lang === 'ru' ? 'Верно' : 'Correct'}
                </th>
                <th className="px-5 py-2 text-right font-medium w-24">
                  {lang === 'ru' ? 'Сложность' : 'Difficulty'}
                </th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, i) => {
                const badge = difficultyBadge(q.correctRate);
                return (
                  <tr
                    key={q.id}
                    className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-[#2c2c2e]/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-gray-500 dark:text-[#636366] tabular-nums">
                      {i + 1}
                    </td>
                    <td className="px-2 py-3 text-gray-700 dark:text-[#a1a1a6] tabular-nums">
                      {lang === 'ru' ? 'Гл.' : 'Ch.'} {q.chapter}
                    </td>
                    <td className="px-2 py-3 text-gray-900 dark:text-[#f5f5f7]">
                      {truncate(q.text)}
                    </td>
                    <td className="px-2 py-3 text-right text-gray-700 dark:text-[#a1a1a6] tabular-nums">
                      {q.attempts}
                    </td>
                    <td className="px-2 py-3 text-right tabular-nums font-semibold text-gray-900 dark:text-[#f5f5f7]">
                      {Math.round(q.correctRate)}%
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                          badge.cls,
                        )}
                      >
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty state helper
// ─────────────────────────────────────────────────────────────

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <AlertTriangle className="w-7 h-7 text-gray-400 dark:text-[#636366] mb-2" />
      <p className="text-sm text-gray-600 dark:text-[#a1a1a6]">{label}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { lang, t } = useLang();

  // KPIs derived from the existing `detailed` endpoint so the page is useful
  // even before the new analytics endpoints are live.
  const { data: detailed = [], isLoading: detailedLoading } = useQuery({
    queryKey: ['detailed-progress'],
    queryFn: adminApi.detailed,
    staleTime: STALE,
  });

  const kpis = useMemo(() => {
    const total = detailed.length;
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const active = detailed.filter(
      (s) => s.lastActiveAt && now - new Date(s.lastActiveAt).getTime() < sevenDays,
    ).length;
    const avgCompletion =
      total > 0
        ? Math.round(
            (detailed.reduce((a, s) => a + (s.completedChapters ?? 0), 0) / (total * 9)) * 100,
          )
        : 0;
    const scored = detailed.filter((s) => s.avgScore != null);
    const avgScore =
      scored.length > 0
        ? Math.round(scored.reduce((a, s) => a + (s.avgScore ?? 0), 0) / scored.length)
        : 0;
    return { total, active, avgCompletion, avgScore };
  }, [detailed]);

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-black">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 pt-6 pb-10 space-y-5">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#f5f5f7]">
            {t('analytics_title')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-[#a1a1a6] mt-1">
            {lang === 'ru'
              ? 'Метрики обучения и поведения студентов'
              : 'Learning metrics and student behaviour'}
          </p>
        </header>

        {/* KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={Users}
            label={t('stat_total_students')}
            value={kpis.total}
            tone="violet"
            loading={detailedLoading}
          />
          <KpiCard
            icon={Activity}
            label={t('stat_active_students')}
            value={kpis.active}
            tone="emerald"
            loading={detailedLoading}
          />
          <KpiCard
            icon={TrendingUp}
            label={t('stat_completion_rate')}
            value={kpis.avgCompletion}
            suffix="%"
            tone="blue"
            loading={detailedLoading}
          />
          <KpiCard
            icon={Target}
            label={t('stat_avg_score')}
            value={kpis.avgScore}
            suffix="%"
            tone="amber"
            loading={detailedLoading}
          />
        </div>

        {/* Activity chart — full width */}
        <ActivityChart lang={lang} />

        {/* Heatmap + Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Heatmap lang={lang} />
          <Funnel lang={lang} />
        </div>

        {/* Chapter difficulty — full width */}
        <ChapterDifficultyChart lang={lang} />

        {/* Hardest questions — full width */}
        <HardestQuestions lang={lang} />
      </div>
    </div>
  );
}
