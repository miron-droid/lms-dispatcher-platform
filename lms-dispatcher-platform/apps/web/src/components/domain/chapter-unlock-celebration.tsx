'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';
import { cn } from '@/lib/utils';

const UNLOCK_KEY = 'dispatchgo-chapter-unlocked';

/** Call this from anywhere (e.g. chapter detail page after chapter completes). */
export function triggerChapterUnlock(chapterNumber: number, nextChapterId?: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    UNLOCK_KEY,
    JSON.stringify({ chapter: chapterNumber, nextId: nextChapterId ?? null, at: Date.now() }),
  );
  // Notify listeners in the same tab (storage event only fires cross-tab).
  window.dispatchEvent(new CustomEvent('dispatchgo:chapter-unlocked'));
}

interface UnlockPayload {
  chapter: number;
  nextId: string | null;
  at: number;
}

export function ChapterUnlockCelebration() {
  const { t } = useLang();
  const router = useRouter();
  const [payload, setPayload] = useState<UnlockPayload | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Watch for unlock signal
  useEffect(() => {
    function check() {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(UNLOCK_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as UnlockPayload;
        if (parsed && typeof parsed.chapter === 'number') setPayload(parsed);
      } catch {
        localStorage.removeItem(UNLOCK_KEY);
      }
    }
    check();
    window.addEventListener('dispatchgo:chapter-unlocked', check);
    window.addEventListener('storage', check);
    return () => {
      window.removeEventListener('dispatchgo:chapter-unlocked', check);
      window.removeEventListener('storage', check);
    };
  }, []);

  // Confetti
  useEffect(() => {
    if (!payload) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const colors = ['#10b981', '#34d399', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa'];
    const pieces = Array.from({ length: 140 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.4,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.2,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let raf = 0;
    let t0 = performance.now();
    function frame(now: number) {
      if (!ctx || !canvas) return;
      const dt = Math.min(32, now - t0);
      t0 = now;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      pieces.forEach((p) => {
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.vy += 0.05 * (dt / 16);
        p.rot += p.vr * (dt / 16);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        ctx.restore();
      });
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(raf);
  }, [payload]);

  function dismiss() {
    localStorage.removeItem(UNLOCK_KEY);
    setPayload(null);
  }

  function goNext() {
    const nextId = payload?.nextId;
    dismiss();
    if (nextId) router.push(`/learn/chapters/${nextId}`);
    else router.push('/learn');
  }

  if (!payload) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadein"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100vw', height: '100vh' }}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400" />

        <div className="px-7 pt-10 pb-6 text-center">
          <div className="text-6xl mb-3 animate-bounce-slow">🎉</div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
            {t('celebrate_badge')}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#f5f5f7] mb-2">
            {t('celebrate_title').replace('{n}', String(payload.chapter))}
          </h2>
          <p className="text-sm text-gray-600 dark:text-[#a1a1a6] max-w-sm mx-auto">
            {t('celebrate_body')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-5 pb-6">
          <button
            onClick={dismiss}
            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-[#f5f5f7] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            {t('celebrate_stay')}
          </button>
          <button
            onClick={goNext}
            className="flex-[1.4] flex items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-sm transition-colors"
          >
            {t('celebrate_next_chapter')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
