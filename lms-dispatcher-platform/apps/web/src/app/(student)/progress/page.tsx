'use client';
import { useGamification, LEVELS, ACHIEVEMENTS } from '@/lib/stores/gamification.store';
import { useLang } from '@/lib/i18n/lang-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api/courses';
import { apiFetch } from '@/lib/api/client';
import { HighwayMap } from '@/components/domain/highway-map';
import { Award, Lock, Download, Loader2, Sparkles } from 'lucide-react';

const COURSE_ID = 'course-dispatchers-v1';
const TOTAL_CHAPTERS = 9;

type Certificate = {
  id: string;
  userId: string;
  courseId: string;
  certNumber: string;
  studentName: string;
  companyName?: string;
  issuedAt: string;
};

type CertResponse = { certificates: Certificate[]; eligible: boolean };

async function downloadCert(certId: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
  const res = await fetch(`${base}/certificates/${certId}/pdf`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to download certificate');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export default function ProgressPage() {
  const { lang } = useLang();
  const g = useGamification();
  const level = g.getLevel();
  const levelProgress = g.getLevelProgress();
  const idx = LEVELS.indexOf(level);
  const next = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ['progress', COURSE_ID],
    queryFn: () => coursesApi.getProgress(COURSE_ID),
  });

  const {
    data: certData,
    isPending: certPending,
    isError: certError,
  } = useQuery<CertResponse>({
    queryKey: ['certificates', 'my'],
    queryFn: () => apiFetch<CertResponse>('/certificates/my'),
    retry: false,
  });

  const generateMut = useMutation({
    mutationFn: () => apiFetch('/certificates/generate'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['certificates', 'my'] }),
  });

  // Derived from server-side progress data
  const totalLessonsCompleted = (data?.chapters ?? []).reduce((acc, c) => acc + (c.lessonsCompleted ?? 0), 0);
  const chaptersCompleted = (data?.chapters ?? []).filter((c: any) => (c.progressPct ?? 0) >= 100 || c.completed).length;

  const hasCert = (certData?.certificates?.length ?? 0) > 0;
  const isEligible = certData?.eligible === true;
  const cert = certData?.certificates?.[0];

  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 lg:px-6 pt-14 lg:pt-6 pb-24 lg:pb-8">
      {/* Header */}
      <h1 className="text-xl lg:text-2xl font-bold mb-6">
        {lang === 'ru' ? 'Мой прогресс' : 'My Progress'}
      </h1>

      {/* Level card */}
      <div className="card p-5 mb-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{level.emoji}</span>
          <div className="flex-1">
            <p className="text-xl font-bold">{lang === 'ru' ? level.nameRu : level.name}</p>
            <p className="text-gray-400 dark:text-[#636366] text-sm">{g.totalXP.toLocaleString()} XP</p>
          </div>
          {g.streak > 0 && (
            <div className="bg-orange-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-orange-400">{g.streak}</span>
            </div>
          )}
        </div>
        {next && (
          <div>
            <div className="flex justify-between text-xs text-gray-400 dark:text-[#636366] mb-1.5">
              <span>{lang === 'ru' ? 'Следующий' : 'Next'}: {lang === 'ru' ? next.nameRu : next.name}</span>
              <span>{g.totalXP}/{next.minXP} XP</span>
            </div>
            <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-[#f5f5f7]">{totalLessonsCompleted}</p>
          <p className="text-xs text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'уроков' : 'lessons'}</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-[#f5f5f7]">{g.streak}</p>
          <p className="text-xs text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'дней подряд' : 'day streak'}</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-[#f5f5f7]">{g.unlockedAchievements.length}</p>
          <p className="text-xs text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'достижений' : 'badges'}</p>
        </div>
      </div>

      {/* Certificate card */}
      <div className="mb-4">
        {certPending && (
          <div className="card p-6 flex items-center justify-center gap-3 text-gray-500 dark:text-[#a1a1a6]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">{lang === 'ru' ? 'Загрузка сертификата…' : 'Loading certificate…'}</span>
          </div>
        )}

        {!certPending && hasCert && cert && (
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-xl shadow-amber-500/20 text-white">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="relative flex items-start gap-4">
              <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
                <Award className="w-9 h-9" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider text-white/80 font-semibold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {lang === 'ru' ? 'Сертификат выдан' : 'Certificate issued'}
                </p>
                <h3 className="text-2xl font-bold leading-tight">
                  {lang === 'ru' ? 'Курс завершён!' : 'Course Complete!'}
                </h3>
                <p className="text-sm text-white/90 mt-1 truncate">{cert.studentName}</p>
                <p className="text-xs text-white/70 font-mono mt-0.5">№ {cert.certNumber}</p>
              </div>
            </div>
            <button
              onClick={() => downloadCert(cert.id)}
              className="relative mt-5 w-full bg-white text-amber-700 hover:text-amber-800 hover:bg-amber-50 font-semibold rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
            >
              <Download className="w-5 h-5" />
              {lang === 'ru' ? 'Скачать сертификат' : 'Download Certificate'}
            </button>
          </div>
        )}

        {!certPending && !hasCert && isEligible && (
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/20 text-white">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="relative flex items-start gap-4">
              <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
                <Sparkles className="w-9 h-9" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider text-white/80 font-semibold mb-1">
                  {lang === 'ru' ? 'Доступно' : 'Available'}
                </p>
                <h3 className="text-2xl font-bold leading-tight">
                  {lang === 'ru' ? 'Получите сертификат!' : 'Claim Your Certificate!'}
                </h3>
                <p className="text-sm text-white/90 mt-1">
                  {lang === 'ru'
                    ? 'Вы прошли все главы. Получите свой сертификат сейчас.'
                    : 'You completed every chapter. Generate your certificate now.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => generateMut.mutate()}
              disabled={generateMut.isPending}
              className="relative mt-5 w-full bg-white text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 font-semibold rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {generateMut.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {lang === 'ru' ? 'Создание…' : 'Generating…'}
                </>
              ) : (
                <>
                  <Award className="w-5 h-5" />
                  {lang === 'ru' ? 'Создать сертификат' : 'Generate Certificate'}
                </>
              )}
            </button>
            {generateMut.isError && (
              <p className="text-xs text-white/90 mt-2 text-center">
                {lang === 'ru' ? 'Ошибка. Попробуйте ещё раз.' : 'Something went wrong. Try again.'}
              </p>
            )}
          </div>
        )}

        {!certPending && !certError && !hasCert && !isEligible && certData && (
          <div className="rounded-2xl p-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-[#2c2c2e] dark:to-[#1c1c1e] border border-gray-300/40 dark:border-white/5">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/60 dark:bg-white/5 flex items-center justify-center ring-1 ring-gray-300/60 dark:ring-white/10">
                <Lock className="w-8 h-8 text-gray-500 dark:text-[#a1a1a6]" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-[#a1a1a6] font-semibold mb-1">
                  {lang === 'ru' ? 'Заблокировано' : 'Locked'}
                </p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-[#f5f5f7] leading-tight">
                  {lang === 'ru' ? 'Сертификат о прохождении курса' : 'Course Certificate'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#a1a1a6] mt-1">
                  {lang === 'ru'
                    ? `Завершите все ${TOTAL_CHAPTERS} глав, чтобы получить сертификат`
                    : `Complete all ${TOTAL_CHAPTERS} chapters to earn your certificate`}
                </p>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs text-gray-600 dark:text-[#a1a1a6] mb-1.5 font-medium">
                <span>
                  {lang === 'ru' ? 'Прогресс' : 'Progress'}
                </span>
                <span>
                  {chaptersCompleted} {lang === 'ru' ? 'из' : 'of'} {TOTAL_CHAPTERS} {lang === 'ru' ? 'глав' : 'chapters'}
                </span>
              </div>
              <div className="h-2.5 bg-white/70 dark:bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (chaptersCompleted / TOTAL_CHAPTERS) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Highway map */}
      {data && <div className="mb-4"><HighwayMap chapters={data.chapters ?? []} /></div>}

      {/* Achievements */}
      <div className="mb-2">
        <h2 className="text-lg font-bold mb-3">
          {lang === 'ru' ? 'Достижения' : 'Achievements'}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = g.unlockedAchievements.includes(a.id);
            return (
              <div
                key={a.id}
                className={`card p-3 flex items-start gap-3 transition-all ${
                  unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200'
                    : 'opacity-40 grayscale'
                }`}
              >
                <span className="text-2xl">{a.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-[#f5f5f7] truncate">
                    {lang === 'ru' ? a.nameRu : a.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-[#a1a1a6] leading-tight">
                    {lang === 'ru' ? a.descRu : a.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Levels ladder */}
      <div>
        <h2 className="text-lg font-bold mb-3 mt-6">
          {lang === 'ru' ? 'Уровни' : 'Levels'}
        </h2>
        <div className="space-y-2">
          {LEVELS.map((l, i) => {
            const reached = g.totalXP >= l.minXP;
            const isCurrent = l === level;
            return (
              <div
                key={i}
                className={`card p-3 flex items-center gap-3 ${
                  isCurrent
                    ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-200'
                    : reached
                    ? 'border-green-200 bg-green-50/30'
                    : 'opacity-50'
                }`}
              >
                <span className="text-xl">{l.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{lang === 'ru' ? l.nameRu : l.name}</p>
                  <p className="text-xs text-gray-400 dark:text-[#636366]">{l.minXP.toLocaleString()} XP</p>
                </div>
                {reached && <span className="text-green-500 text-sm">✓</span>}
                {isCurrent && (
                  <span className="text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full font-medium">
                    {lang === 'ru' ? 'сейчас' : 'current'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
