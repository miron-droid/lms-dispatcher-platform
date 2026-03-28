#!/usr/bin/env python3
import os

def w(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content.lstrip("\n"))

WEB = "/sessions/optimistic-admiring-tesla/lms/apps/web"

# ── package.json ──────────────────────────────────────────────────────────────

w(f"{WEB}/package.json", """
{
  "name": "web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@tanstack/react-query": "^5.28.0",
    "zustand": "^4.5.2",
    "next-pwa": "^5.6.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.2",
    "lucide-react": "^0.378.0",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-slot": "^1.0.2"
  },
  "devDependencies": {
    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.5"
  }
}
""")

w(f"{WEB}/tsconfig.json", """
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
""")

w(f"{WEB}/next.config.ts", """
import type { NextConfig } from 'next';
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
""")

w(f"{WEB}/tailwind.config.ts", """
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
export default config;
""")

w(f"{WEB}/postcss.config.js", """
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
""")

# ── PWA manifest ──────────────────────────────────────────────────────────────

w(f"{WEB}/public/manifest.json", """
{
  "name": "LMS Dispatcher Training",
  "short_name": "LMS",
  "description": "Dispatcher Training Platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
""")

# ── Types ─────────────────────────────────────────────────────────────────────

w(f"{WEB}/src/types/index.ts", """
export type UserRole = 'STUDENT' | 'MANAGER' | 'ADMIN';
export type ProgressStatus = 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';
export type ExamDecision = 'PASS' | 'RETRY' | 'DISBAND';
export type ExamStatus = 'REQUESTED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type LessonType = 'INTRO' | 'THEORY' | 'DEMO' | 'PRACTICE' | 'TEST' | 'EXAM';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  managerId?: string;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  passThreshold: number;
}

export interface Lesson {
  id: string;
  type: LessonType;
  title: string;
  order: number;
  content?: TextContent | VideoContent | DialogueContent | CaseContent;
  lessonProgress?: { status: ProgressStatus }[];
}

export interface TextContent    { type: 'text'; body: string }
export interface VideoContent   { type: 'video'; hlsUrl: string; posterUrl?: string }
export interface DialogueContent { type: 'dialogue'; messages: { role: 'broker' | 'dispatcher' | 'driver'; text: string }[] }
export interface CaseContent    { type: 'case'; scenario: string; options: { label: string; explanation: string }[]; correctIndex: number }

export interface ChapterProgressItem {
  id: string;
  title: string;
  order: number;
  status: ProgressStatus;
  testPassed: boolean;
  examPassed: boolean;
  lessonsTotal: number;
  lessonsCompleted: number;
}

export interface CourseProgress {
  courseId: string;
  overallPercent: number;
  chapters: ChapterProgressItem[];
}

export interface ExamRequest {
  id: string;
  chapterId: string;
  status: ExamStatus;
  decision?: ExamDecision;
  comment?: string;
  scheduledAt?: string;
  createdAt: string;
  chapter: { id: string; title: string };
  student?: { id: string; firstName: string; lastName: string; email: string };
}

export interface TestQuestion {
  id: string;
  text: string;
  isMultiple: boolean;
  options: { id: string; text: string }[];
}

export interface TestResult {
  score: number;
  passed: boolean;
  threshold: number;
  results: { questionId: string; isCorrect: boolean; explanation?: string; correctOptionIds: string[] }[];
}
""")

# ── API client ────────────────────────────────────────────────────────────────

w(f"{WEB}/src/lib/api/client.ts", """
const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message ?? 'Request failed');
  }
  return json.data as T;
}
""")

w(f"{WEB}/src/lib/api/auth.ts", """
import { apiFetch } from './client';
import type { User } from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ accessToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiFetch<User>('/auth/me'),
};
""")

w(f"{WEB}/src/lib/api/courses.ts", """
import { apiFetch } from './client';
import type { Chapter, Lesson, ChapterProgressItem, CourseProgress } from '@/types';

export const coursesApi = {
  getAll: () =>
    apiFetch<{ id: string; title: string; chapters: Chapter[] }[]>('/courses'),

  getProgress: (courseId: string) =>
    apiFetch<CourseProgress>(`/progress/courses/${courseId}`),

  initializeCourse: (courseId: string) =>
    apiFetch<void>(`/progress/courses/${courseId}/initialize`, { method: 'POST' }),

  getChapter: (chapterId: string) =>
    apiFetch<{ chapter: { id: string; title: string; lessons: Lesson[] }; progress: any }>(
      `/chapters/${chapterId}`,
    ),

  getLesson: (lessonId: string) =>
    apiFetch<{ lesson: Lesson; progress: any }>(`/lessons/${lessonId}`),

  completeLesson: (lessonId: string) =>
    apiFetch<{ completed: boolean; nextLessonId: string | null }>(
      `/lessons/${lessonId}/complete`,
      { method: 'POST' },
    ),
};
""")

w(f"{WEB}/src/lib/api/tests.ts", """
import { apiFetch } from './client';
import type { TestQuestion, TestResult } from '@/types';

export const testsApi = {
  getQuestions: (chapterId: string) =>
    apiFetch<TestQuestion[]>(`/tests/chapters/${chapterId}/questions`),

  submit: (chapterId: string, answers: { questionId: string; selectedOptionIds: string[] }[]) =>
    apiFetch<TestResult>(`/tests/chapters/${chapterId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  getAttempts: (chapterId: string) =>
    apiFetch<{ id: string; score: number; passed: boolean; completedAt: string }[]>(
      `/tests/chapters/${chapterId}/attempts`,
    ),
};
""")

w(f"{WEB}/src/lib/api/exams.ts", """
import { apiFetch } from './client';
import type { ExamRequest } from '@/types';
import type { ExamDecision } from '@/types';

export const examsApi = {
  request: (chapterId: string, preferredAt?: string) =>
    apiFetch<ExamRequest>('/exams/request', {
      method: 'POST',
      body: JSON.stringify({ chapterId, preferredAt }),
    }),

  myExams: () => apiFetch<ExamRequest[]>('/exams/my'),

  pending: () => apiFetch<ExamRequest[]>('/exams/pending'),

  review: (examId: string, decision: ExamDecision, comment: string) =>
    apiFetch<ExamRequest>(`/exams/${examId}/review`, {
      method: 'POST',
      body: JSON.stringify({ decision, comment }),
    }),
};
""")

# ── Auth store ────────────────────────────────────────────────────────────────

w(f"{WEB}/src/lib/stores/auth.store.ts", """
import { create } from 'zustand';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') localStorage.setItem('access_token', token);
    set({ user, token });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('access_token');
    set({ user: null, token: null });
  },

  isAuthenticated: () => !!get().token,
}));
""")

# ── Utility ───────────────────────────────────────────────────────────────────

w(f"{WEB}/src/lib/utils.ts", """
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fullName(u: { firstName: string; lastName: string }) {
  return `${u.firstName} ${u.lastName}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}
""")

# ── Root layout ───────────────────────────────────────────────────────────────

w(f"{WEB}/src/app/globals.css", """
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { -webkit-tap-highlight-color: transparent; }
  body { @apply bg-gray-50 text-gray-900 font-sans; }
}

@layer components {
  .btn-primary {
    @apply w-full py-3 px-4 bg-brand-600 text-white font-semibold rounded-xl
           active:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .btn-ghost {
    @apply py-2 px-4 text-gray-600 rounded-xl active:bg-gray-100 transition-colors;
  }
  .card {
    @apply bg-white rounded-2xl shadow-sm border border-gray-100 p-4;
  }
  .input {
    @apply w-full px-4 py-3 border border-gray-200 rounded-xl text-base
           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent;
  }
}
""")

w(f"{WEB}/src/app/layout.tsx", """
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LMS — Dispatcher Training',
  description: 'Logistics dispatcher training platform',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'LMS' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
""")

# ── Providers ─────────────────────────────────────────────────────────────────

w(f"{WEB}/src/components/providers.tsx", """
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
  }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
""")

# ── Auth pages ────────────────────────────────────────────────────────────────

w(f"{WEB}/src/app/(auth)/layout.tsx", """
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-600 px-4">
      {children}
    </div>
  );
}
""")

w(f"{WEB}/src/app/(auth)/login/page.tsx", """
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth.store';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { accessToken, user } = await authApi.login(email, password);
      setAuth(user, accessToken);
      if (user.role === 'ADMIN') router.replace('/admin');
      else if (user.role === 'MANAGER') router.replace('/manager');
      else router.replace('/learn');
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Dispatcher Training</h1>
        <p className="text-blue-100 mt-1 text-sm">Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>
        <button className="btn-primary mt-2" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
""")

# ── Student layout (mobile bottom nav) ───────────────────────────────────────

w(f"{WEB}/src/app/(student)/layout.tsx", """
import { Providers } from '@/components/providers';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen pb-20">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <BottomNav />
      </div>
    </Providers>
  );
}
""")

# ── Bottom nav ────────────────────────────────────────────────────────────────

w(f"{WEB}/src/components/layout/bottom-nav.tsx", """
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ChartBar, GraduationCap, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/learn',    label: 'Course',   icon: BookOpen },
  { href: '/progress', label: 'Progress', icon: ChartBar },
  { href: '/exams',    label: 'Exams',    icon: GraduationCap },
  { href: '/profile',  label: 'Profile',  icon: User },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors',
                active ? 'text-brand-600' : 'text-gray-400',
              )}
            >
              <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
""")

# ── Student: Learn (course home) ──────────────────────────────────────────────

w(f"{WEB}/src/app/(student)/learn/page.tsx", """
'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { coursesApi } from '@/lib/api/courses';
import { useAuthStore } from '@/lib/stores/auth.store';
import { ChapterCard } from '@/components/domain/chapter-card';
import { ProgressRing } from '@/components/domain/progress-ring';

const COURSE_ID = 'course-dispatchers-v1';

export default function LearnPage() {
  const user = useAuthStore((s) => s.user);

  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress', COURSE_ID],
    queryFn: () => coursesApi.getProgress(COURSE_ID),
  });

  useEffect(() => {
    if (!progress) coursesApi.initializeCourse(COURSE_ID).catch(() => {});
  }, [progress]);

  if (isLoading) return <CourseSkeleton />;

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">US Trucking Course</h1>
          <p className="text-gray-500 text-sm mt-0.5">Hello, {user?.firstName} 👋</p>
        </div>
        <ProgressRing percent={progress?.overallPercent ?? 0} />
      </div>

      <div className="space-y-3">
        {(progress?.chapters ?? []).map((ch) => (
          <ChapterCard key={ch.id} chapter={ch} />
        ))}
      </div>
    </div>
  );
}

function CourseSkeleton() {
  return (
    <div className="px-4 pt-6 space-y-3 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
      ))}
    </div>
  );
}
""")

# ── ChapterCard component ─────────────────────────────────────────────────────

w(f"{WEB}/src/components/domain/chapter-card.tsx", """
'use client';
import Link from 'next/link';
import { CheckCircle2, Lock, PlayCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChapterProgressItem } from '@/types';

interface Props { chapter: ChapterProgressItem }

export function ChapterCard({ chapter }: Props) {
  const locked = chapter.status === 'LOCKED';
  const done   = chapter.examPassed;

  return (
    <Link
      href={locked ? '#' : `/learn/chapters/${chapter.id}`}
      className={cn(
        'card flex items-center gap-4 transition-all active:scale-[0.98]',
        locked && 'opacity-60 pointer-events-none',
      )}
    >
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
        done   ? 'bg-green-100' :
        locked ? 'bg-gray-100'  : 'bg-brand-100',
      )}>
        {done   ? <CheckCircle2 className="w-6 h-6 text-green-600" /> :
         locked ? <Lock className="w-5 h-5 text-gray-400" /> :
                  <PlayCircle className="w-6 h-6 text-brand-600" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">Ch. {chapter.order}</span>
          {chapter.testPassed && !chapter.examPassed && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
              Exam pending
            </span>
          )}
          {done && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Complete
            </span>
          )}
        </div>
        <p className="font-semibold text-gray-900 truncate mt-0.5">{chapter.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all"
              style={{
                width: chapter.lessonsTotal > 0
                  ? `${Math.round((chapter.lessonsCompleted / chapter.lessonsTotal) * 100)}%`
                  : '0%',
              }}
            />
          </div>
          <span className="text-xs text-gray-400 shrink-0">
            {chapter.lessonsCompleted}/{chapter.lessonsTotal}
          </span>
        </div>
      </div>

      {!locked && <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />}
    </Link>
  );
}
""")

# ── ProgressRing ──────────────────────────────────────────────────────────────

w(f"{WEB}/src/components/domain/progress-ring.tsx", """
interface Props { percent: number; size?: number }

export function ProgressRing({ percent, size = 56 }: Props) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={6} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke="#2563eb" strokeWidth={6}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
        {percent}%
      </span>
    </div>
  );
}
""")

# ── Chapter detail page ───────────────────────────────────────────────────────

w(f"{WEB}/src/app/(student)/learn/chapters/[id]/page.tsx", """
'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { coursesApi } from '@/lib/api/courses';
import { cn } from '@/lib/utils';
import { CheckCircle2, PlayCircle, Lock, ChevronLeft } from 'lucide-react';
import type { LessonType } from '@/types';

const ICONS: Record<LessonType, string> = {
  INTRO: '📖', THEORY: '📚', DEMO: '🎬',
  PRACTICE: '✏️', TEST: '📝', EXAM: '🎓',
};

export default function ChapterPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['chapter', id],
    queryFn: () => coursesApi.getChapter(id),
  });

  if (isLoading) return <div className="p-4 animate-pulse space-y-3">{Array.from({length:5}).map((_,i)=><div key={i} className="h-16 bg-gray-200 rounded-xl"/>)}</div>;

  const { chapter } = data!;

  return (
    <div className="max-w-lg mx-auto">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl text-gray-500">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg truncate">{chapter.title}</h1>
      </div>

      <div className="p-4 space-y-2">
        {chapter.lessons.map((lesson) => {
          const status = lesson.lessonProgress?.[0]?.status ?? 'LOCKED';
          const isLocked = status === 'LOCKED';
          const isDone   = status === 'COMPLETED';
          return (
            <button
              key={lesson.id}
              onClick={() => !isLocked && router.push(`/learn/lessons/${lesson.id}`)}
              disabled={isLocked}
              className={cn(
                'w-full card flex items-center gap-4 text-left transition-all active:scale-[0.98]',
                isLocked && 'opacity-50',
              )}
            >
              <span className="text-2xl">{ICONS[lesson.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  {lesson.type}
                </p>
                <p className="font-semibold text-gray-900 truncate">{lesson.title}</p>
              </div>
              {isDone   ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> :
               isLocked ? <Lock className="w-4 h-4 text-gray-300 shrink-0" /> :
                          <PlayCircle className="w-5 h-5 text-brand-500 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
""")

# ── Lesson viewer page ────────────────────────────────────────────────────────

w(f"{WEB}/src/app/(student)/learn/lessons/[id]/page.tsx", """
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { coursesApi } from '@/lib/api/courses';
import { LessonContent } from '@/components/domain/lesson-content';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const qc      = useQueryClient();
  const [done, setDone] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => coursesApi.getLesson(id),
  });

  const complete = useMutation({
    mutationFn: () => coursesApi.completeLesson(id),
    onSuccess: (res) => {
      setDone(true);
      qc.invalidateQueries({ queryKey: ['progress'] });
      qc.invalidateQueries({ queryKey: ['chapter'] });
      setTimeout(() => {
        if (res.nextLessonId) router.replace(`/learn/lessons/${res.nextLessonId}`);
        else router.back();
      }, 1200);
    },
  });

  if (isLoading) return <div className="p-6 animate-pulse"><div className="h-8 bg-gray-200 rounded mb-4"/><div className="h-64 bg-gray-200 rounded"/></div>;

  const { lesson, progress } = data!;
  const alreadyDone = progress?.status === 'COMPLETED';

  return (
    <div className="max-w-lg mx-auto flex flex-col min-h-screen">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl text-gray-500">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 uppercase tracking-wide">{lesson.type}</p>
          <h1 className="font-bold truncate">{lesson.title}</h1>
        </div>
      </div>

      <div className="flex-1 p-4">
        <LessonContent content={lesson.content} />
      </div>

      <div className="p-4 pb-6">
        {done ? (
          <div className="flex items-center justify-center gap-2 py-3 text-green-600 font-semibold">
            <CheckCircle2 className="w-5 h-5" /> Done! Moving on…
          </div>
        ) : alreadyDone ? (
          <button className="btn-primary bg-gray-100 text-gray-600" onClick={() => router.back()}>
            Back to Chapter
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => complete.mutate()}
            disabled={complete.isPending}
          >
            {complete.isPending ? 'Saving…' : 'Mark as Complete →'}
          </button>
        )}
      </div>
    </div>
  );
}
""")

# ── LessonContent renderer ────────────────────────────────────────────────────

w(f"{WEB}/src/components/domain/lesson-content.tsx", """
'use client';
import type { TextContent, VideoContent, DialogueContent, CaseContent } from '@/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type Content = TextContent | VideoContent | DialogueContent | CaseContent | undefined;

export function LessonContent({ content }: { content: Content }) {
  if (!content) return <p className="text-gray-400 italic">No content yet.</p>;

  switch (content.type) {
    case 'text':     return <TextRenderer c={content} />;
    case 'video':    return <VideoRenderer c={content} />;
    case 'dialogue': return <DialogueRenderer c={content} />;
    case 'case':     return <CaseRenderer c={content} />;
    default:         return null;
  }
}

function TextRenderer({ c }: { c: TextContent }) {
  return (
    <div
      className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: c.body }}
    />
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
  return (
    <div className="space-y-3">
      {c.messages.map((m, i) => {
        const isDispatcher = m.role === 'dispatcher';
        return (
          <div key={i} className={cn('flex', isDispatcher ? 'justify-end' : 'justify-start')}>
            {!isDispatcher && (
              <span className="text-xs text-gray-400 uppercase font-medium self-end mb-1 mr-2">
                {m.role}
              </span>
            )}
            <div className={cn(
              'max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
              isDispatcher
                ? 'bg-brand-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm',
            )}>
              {m.text}
            </div>
            {isDispatcher && (
              <span className="text-xs text-gray-400 uppercase font-medium self-end mb-1 ml-2">
                you
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CaseRenderer({ c }: { c: CaseContent }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm font-medium text-amber-800 mb-1">📋 Scenario</p>
        <p className="text-gray-800 leading-relaxed">{c.scenario}</p>
      </div>

      <p className="font-semibold text-gray-700">What would you do?</p>
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
                !showResult && 'border-gray-200 active:border-brand-400',
                showResult && isCorrect && 'border-green-500 bg-green-50',
                showResult && isChosen && !isCorrect && 'border-red-400 bg-red-50',
                showResult && !isChosen && !isCorrect && 'border-gray-100 opacity-60',
              )}
            >
              <p className="font-medium text-gray-800">{opt.label}</p>
              {showResult && (isChosen || isCorrect) && (
                <p className="text-sm mt-1 text-gray-600">{opt.explanation}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
""")

# ── Progress page ─────────────────────────────────────────────────────────────

w(f"{WEB}/src/app/(student)/progress/page.tsx", """
'use client';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api/courses';
import { ProgressRing } from '@/components/domain/progress-ring';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';

const COURSE_ID = 'course-dispatchers-v1';

export default function ProgressPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['progress', COURSE_ID],
    queryFn: () => coursesApi.getProgress(COURSE_ID),
  });

  if (isLoading) return <div className="p-4 animate-pulse space-y-3">{Array.from({length:5}).map((_,i)=><div key={i} className="h-14 bg-gray-200 rounded-xl"/>)}</div>;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">My Progress</h1>
        <ProgressRing percent={data?.overallPercent ?? 0} />
      </div>

      <div className="space-y-2">
        {(data?.chapters ?? []).map((ch) => (
          <div key={ch.id} className="card flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm font-bold text-gray-500">
              {ch.order}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{ch.title}</p>
              <p className="text-xs text-gray-400">
                {ch.lessonsCompleted}/{ch.lessonsTotal} lessons
                {ch.testPassed ? ' · Test ✓' : ''}
              </p>
            </div>
            {ch.examPassed   ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> :
             ch.status === 'LOCKED' ? <Circle className="w-5 h-5 text-gray-300 shrink-0" /> :
             <Circle className="w-5 h-5 text-brand-400 shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
""")

# ── Exams page (student) ──────────────────────────────────────────────────────

w(f"{WEB}/src/app/(student)/exams/page.tsx", """
'use client';
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/lib/api/exams';
import { formatDate } from '@/lib/utils';
import { GraduationCap } from 'lucide-react';

const BADGE: Record<string, string> = {
  REQUESTED: 'bg-yellow-100 text-yellow-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
};

const DECISION_BADGE: Record<string, string> = {
  PASS:    'bg-green-100 text-green-700',
  RETRY:   'bg-yellow-100 text-yellow-700',
  DISBAND: 'bg-red-100 text-red-700',
};

export default function ExamsPage() {
  const { data: exams = [], isLoading } = useQuery({
    queryKey: ['my-exams'],
    queryFn: examsApi.myExams,
  });

  if (isLoading) return <div className="p-4 animate-pulse space-y-3">{Array.from({length:3}).map((_,i)=><div key={i} className="h-24 bg-gray-200 rounded-2xl"/>)}</div>;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-xl font-bold mb-6">My Exams</h1>

      {exams.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No exams yet. Pass a chapter test to request one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div key={exam.id} className="card space-y-2">
              <div className="flex items-start justify-between">
                <p className="font-semibold">{exam.chapter.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE[exam.status]}`}>
                  {exam.status}
                </span>
              </div>
              {exam.decision && (
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${DECISION_BADGE[exam.decision]}`}>
                  {exam.decision}
                </span>
              )}
              {exam.comment && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{exam.comment}</p>
              )}
              <p className="text-xs text-gray-400">{formatDate(exam.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
""")

# ── Manager layout + pages ────────────────────────────────────────────────────

w(f"{WEB}/src/app/(manager)/layout.tsx", """
import { Providers } from '@/components/providers';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </Providers>
  );
}
""")

w(f"{WEB}/src/app/(manager)/manager/exams/page.tsx", """
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '@/lib/api/exams';
import { useState } from 'react';
import type { ExamDecision } from '@/types';
import { cn } from '@/lib/utils';

export default function ManagerExamsPage() {
  const qc = useQueryClient();
  const { data: exams = [], isLoading } = useQuery({
    queryKey: ['pending-exams'],
    queryFn: examsApi.pending,
  });

  const [reviewing, setReviewing] = useState<string | null>(null);
  const [decision, setDecision] = useState<ExamDecision>('PASS');
  const [comment, setComment] = useState('');

  const review = useMutation({
    mutationFn: () => examsApi.review(reviewing!, decision, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pending-exams'] });
      setReviewing(null);
      setComment('');
    },
  });

  if (isLoading) return <div className="p-4 animate-pulse space-y-3">{Array.from({length:3}).map((_,i)=><div key={i} className="h-28 bg-gray-200 rounded-2xl"/>)}</div>;

  const DECISIONS: { value: ExamDecision; label: string; color: string }[] = [
    { value: 'PASS',    label: '✅ Pass',    color: 'border-green-500 bg-green-50 text-green-700' },
    { value: 'RETRY',   label: '🔄 Retry',   color: 'border-yellow-500 bg-yellow-50 text-yellow-700' },
    { value: 'DISBAND', label: '❌ Disband', color: 'border-red-500 bg-red-50 text-red-700' },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-xl font-bold mb-6">Pending Exams ({exams.length})</h1>

      <div className="space-y-4">
        {exams.map((exam) => (
          <div key={exam.id} className="card space-y-3">
            <div>
              <p className="font-semibold">
                {exam.student?.firstName} {exam.student?.lastName}
              </p>
              <p className="text-sm text-gray-500">{exam.chapter?.title}</p>
            </div>

            {reviewing === exam.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {DECISIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDecision(d.value)}
                      className={cn(
                        'py-2 rounded-xl border-2 text-sm font-medium transition-all',
                        decision === d.value ? d.color : 'border-gray-200 text-gray-500',
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="Comment (required, min 10 chars)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="btn-primary"
                    onClick={() => review.mutate()}
                    disabled={comment.length < 10 || review.isPending}
                  >
                    Submit
                  </button>
                  <button className="btn-ghost" onClick={() => setReviewing(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="btn-primary"
                onClick={() => setReviewing(exam.id)}
              >
                Review Exam
              </button>
            )}
          </div>
        ))}

        {exams.length === 0 && (
          <p className="text-center text-gray-400 py-12">No pending exams 🎉</p>
        )}
      </div>
    </div>
  );
}
""")

# ── Profile page ──────────────────────────────────────────────────────────────

w(f"{WEB}/src/app/(student)/profile/page.tsx", """
'use client';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function ProfilePage() {
  const user      = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router    = useRouter();

  function logout() {
    clearAuth();
    router.replace('/login');
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-xl font-bold mb-6">Profile</h1>
      <div className="card flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center">
          <User className="w-7 h-7 text-brand-600" />
        </div>
        <div>
          <p className="font-bold">{user?.firstName} {user?.lastName}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
            {user?.role}
          </span>
        </div>
      </div>

      <button
        onClick={logout}
        className="card w-full flex items-center gap-3 text-red-500 active:bg-red-50"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Sign out</span>
      </button>
    </div>
  );
}
""")

# ── Root redirect ─────────────────────────────────────────────────────────────

w(f"{WEB}/src/app/page.tsx", """
import { redirect } from 'next/navigation';
export default function RootPage() {
  redirect('/login');
}
""")

w(f"{WEB}/src/app/login/page.tsx", """
import { redirect } from 'next/navigation';
export default function LoginRedirect() {
  redirect('/(auth)/login');
}
""")

# Actually the auth group needs its own login route at top level for simplicity
w(f"{WEB}/src/app/(auth)/login/page.tsx", open(f"{WEB}/src/app/(auth)/login/page.tsx").read())

print("✅ Frontend files written")
