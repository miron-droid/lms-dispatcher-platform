'use client';
import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { QUESTIONS, DAILY_EXAMS, PASS_THRESHOLD, TOTAL_QUESTIONS } from '@/data/daily-exams';
import { useDailyExamStore } from '@/lib/stores/daily-exam.store';

// ─────────────────────────────────────────────────────────────────────────────
// Mascot SVG
// ─────────────────────────────────────────────────────────────────────────────
function MascotSvg({ mood = 'neutral', size = 80 }: { mood?: 'neutral' | 'happy' | 'sad' | 'celebrate' | 'thinking'; size?: number }) {
  const eyeY = mood === 'happy' || mood === 'celebrate' ? 38 : 36;
  const mouthPath =
    mood === 'happy' || mood === 'celebrate'
      ? 'M 38 52 Q 50 62 62 52'
      : mood === 'sad'
      ? 'M 38 58 Q 50 50 62 58'
      : mood === 'thinking'
      ? 'M 40 55 Q 50 57 60 55'
      : 'M 40 54 Q 50 60 60 54';

  return (
    <svg width={size} height={size} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="28" y="74" width="44" height="36" rx="12" fill="#3b82f6" />
      {/* Shirt detail */}
      <rect x="44" y="74" width="12" height="20" rx="2" fill="#2563eb" />
      {/* Head */}
      <circle cx="50" cy="42" r="30" fill="#fde68a" />
      {/* Headset band */}
      <path d="M 22 42 Q 50 10 78 42" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Headset ears */}
      <rect x="16" y="38" width="12" height="16" rx="6" fill="#1e293b" />
      <rect x="72" y="38" width="12" height="16" rx="6" fill="#1e293b" />
      {/* Mic */}
      <path d="M 16 50 Q 10 58 18 60" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="19" cy="61" r="3" fill="#ef4444" />
      {/* Eyes */}
      {mood === 'happy' || mood === 'celebrate' ? (
        <>
          <path d="M 34 {eyeY} Q 38 32 42 {eyeY}" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 58 {eyeY} Q 62 32 66 {eyeY}" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      ) : mood === 'thinking' ? (
        <>
          <ellipse cx="38" cy="36" rx="5" ry="4" fill="#1e293b" />
          <ellipse cx="62" cy="34" rx="4" ry="5" fill="#1e293b" />
          <circle cx="65" cy="28" r="2" fill="#1e293b" />
          <circle cx="70" cy="24" r="1.5" fill="#1e293b" />
          <circle cx="74" cy="21" r="1" fill="#1e293b" />
        </>
      ) : (
        <>
          <ellipse cx="38" cy={eyeY} rx="5" ry="5" fill="#1e293b" />
          <ellipse cx="62" cy={eyeY} rx="5" ry="5" fill="#1e293b" />
          <circle cx="40" cy={eyeY - 1} r="1.5" fill="white" />
          <circle cx="64" cy={eyeY - 1} r="1.5" fill="white" />
        </>
      )}
      {/* Mouth */}
      <path d={mouthPath} stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Blush */}
      {(mood === 'happy' || mood === 'celebrate') && (
        <>
          <ellipse cx="28" cy="48" rx="7" ry="4" fill="#fca5a5" opacity="0.5" />
          <ellipse cx="72" cy="48" rx="7" ry="4" fill="#fca5a5" opacity="0.5" />
        </>
      )}
      {/* Arms */}
      {mood === 'celebrate' ? (
        <>
          <path d="M 28 82 Q 10 68 14 56" stroke="#fde68a" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 72 82 Q 90 68 86 56" stroke="#fde68a" strokeWidth="8" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <path d="M 28 85 Q 12 95 14 108" stroke="#fde68a" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 72 85 Q 88 95 86 108" stroke="#fde68a" strokeWidth="8" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Vocabulary pairs for matching mini-game
// ─────────────────────────────────────────────────────────────────────────────
const VOCAB_PAIRS: Record<number, { term: string; def: string }[]> = {
  1: [
    { term: 'Shipper', def: 'Грузоотправитель' },
    { term: 'Carrier', def: 'Перевозчик' },
    { term: 'Broker', def: 'Посредник' },
    { term: 'RPM', def: 'Ставка за милю' },
  ],
  2: [
    { term: 'Dead Zone', def: 'Зона без грузов' },
    { term: 'Backhaul', def: 'Обратный груз' },
    { term: 'Hotspot', def: 'Активная зона' },
    { term: 'Freight Zone', def: 'Зона грузопотока' },
  ],
  3: [
    { term: 'Dry Van', def: 'Закрытый фургон' },
    { term: 'Reefer', def: 'Рефрижератор' },
    { term: 'Flatbed', def: 'Открытая платформа' },
    { term: 'Tanker', def: 'Цистерна' },
  ],
  4: [
    { term: 'Rate Con', def: 'Подтверждение ставки' },
    { term: 'BOL', def: 'Транспортная накладная' },
    { term: 'POD', def: 'Подтверждение доставки' },
    { term: 'TONU', def: 'Оплата за отмену' },
  ],
  5: [
    { term: 'DAT', def: 'Биржа грузов' },
    { term: 'Load Board', def: 'Доска объявлений' },
    { term: 'Posting', def: 'Объявление о грузе' },
    { term: 'Bid', def: 'Ставка на груз' },
  ],
  6: [
    { term: 'Spot Rate', def: 'Текущая рыночная ставка' },
    { term: 'Lane', def: 'Маршрутное направление' },
    { term: 'Dedicated', def: 'Закреплённый маршрут' },
    { term: 'Factoring', def: 'Факторинг дебиторки' },
  ],
  7: [
    { term: 'HOS', def: 'Режим труда и отдыха' },
    { term: 'ELD', def: 'Электронный журнал' },
    { term: 'DOT', def: 'Транспортный департамент' },
    { term: 'CDL', def: 'Коммерческие права' },
  ],
  8: [
    { term: 'Detention', def: 'Оплата за простой' },
    { term: 'Layover', def: 'Вынужденный ночлег' },
    { term: 'Lumper', def: 'Разгрузчик склада' },
    { term: 'FSC', def: 'Топливная надбавка' },
  ],
  9: [
    { term: 'Breakdown', def: 'Поломка грузовика' },
    { term: 'Repower', def: 'Смена тягача' },
    { term: 'Dispute', def: 'Спор по оплате' },
    { term: 'No-show', def: 'Водитель не явился' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Hearts display
// ─────────────────────────────────────────────────────────────────────────────
function Hearts({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={cn('text-lg transition-all duration-300', i < count ? 'opacity-100' : 'opacity-20 grayscale')}>
          ❤️
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// XP Badge
// ─────────────────────────────────────────────────────────────────────────────
function XpBadge({ xp }: { xp: number }) {
  return (
    <div className="flex items-center gap-1 bg-yellow-100 border border-yellow-300 px-2.5 py-1 rounded-full">
      <span className="text-sm">⚡</span>
      <span className="text-xs font-black text-yellow-700">{xp} XP</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chapter colors
// ─────────────────────────────────────────────────────────────────────────────
const CHAPTER_COLORS: Record<number, { bg: string; border: string; badge: string; text: string }> = {
  1: { bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-500',   text: 'text-blue-700' },
  2: { bg: 'bg-green-50',  border: 'border-green-200',  badge: 'bg-green-500',  text: 'text-green-700' },
  3: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-500', text: 'text-orange-700' },
  4: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-500', text: 'text-purple-700' },
  5: { bg: 'bg-cyan-50',   border: 'border-cyan-200',   badge: 'bg-cyan-500',   text: 'text-cyan-700' },
  6: { bg: 'bg-pink-50',   border: 'border-pink-200',   badge: 'bg-pink-500',   text: 'text-pink-700' },
  7: { bg: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-500',  text: 'text-amber-700' },
  8: { bg: 'bg-emerald-50',border: 'border-emerald-200',badge: 'bg-emerald-500',text: 'text-emerald-700' },
  9: { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-500',    text: 'text-red-700' },
};

const CHAPTER_NAMES: Record<number, string> = {
  1: 'Введение', 2: 'География', 3: 'Оборудование',
  4: 'Документы', 5: 'Биржи грузов', 6: 'Брокеры',
  7: 'Водители', 8: 'Переговоры', 9: 'Проблемы',
};

// ─────────────────────────────────────────────────────────────────────────────
// Matching Mini-game
// ─────────────────────────────────────────────────────────────────────────────
type MatchTile = { id: string; text: string; type: 'term' | 'def'; pairIndex: number; matched: boolean; wrong: boolean };

function MatchingGame({ chapter, onComplete }: { chapter: number; onComplete: (correct: boolean) => void }) {
  const pairs = VOCAB_PAIRS[chapter] ?? VOCAB_PAIRS[1];
  const [tiles, setTiles] = useState<MatchTile[]>(() => {
    const terms: MatchTile[] = pairs.map((p, i) => ({
      id: `t${i}`, text: p.term, type: 'term', pairIndex: i, matched: false, wrong: false,
    }));
    const defs: MatchTile[] = pairs.map((p, i) => ({
      id: `d${i}`, text: p.def, type: 'def', pairIndex: i, matched: false, wrong: false,
    }));
    // Shuffle each column independently
    const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
    return [...shuffle(terms), ...shuffle(defs)];
  });
  const [selected, setSelected] = useState<MatchTile | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [shakeId, setShakeId] = useState<string | null>(null);

  const termTiles = tiles.filter(t => t.type === 'term');
  const defTiles = tiles.filter(t => t.type === 'def');
  const allMatched = tiles.every(t => t.matched);

  useEffect(() => {
    if (allMatched) {
      setTimeout(() => onComplete(mistakes === 0), 400);
    }
  }, [allMatched, mistakes, onComplete]);

  const handleTile = (tile: MatchTile) => {
    if (tile.matched) return;

    if (!selected) {
      setSelected(tile);
      return;
    }

    if (selected.id === tile.id) {
      setSelected(null);
      return;
    }

    // Check if same type — just switch selection
    if (selected.type === tile.type) {
      setSelected(tile);
      return;
    }

    // Try to match
    if (selected.pairIndex === tile.pairIndex) {
      // Correct match!
      setTiles(prev => prev.map(t =>
        t.id === selected.id || t.id === tile.id ? { ...t, matched: true } : t
      ));
      setSelected(null);
    } else {
      // Wrong match
      setMistakes(m => m + 1);
      setShakeId(tile.id);
      setTimeout(() => {
        setShakeId(null);
        setSelected(null);
        setTiles(prev => prev.map(t =>
          t.id === selected.id || t.id === tile.id ? { ...t, wrong: false } : t
        ));
      }, 600);
    }
  };

  return (
    <div className="duo-slide-up">
      <p className="text-center text-sm font-semibold text-gray-500 dark:text-[#a1a1a6] mb-3">
        🔗 Соедини термины с определениями
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          {termTiles.map(tile => (
            <button
              key={tile.id}
              onClick={() => handleTile(tile)}
              className={cn(
                'w-full px-3 py-3 rounded-xl text-sm font-bold border-2 transition-all duration-200 text-center',
                tile.matched
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-700 duo-match-success opacity-60'
                  : selected?.id === tile.id
                  ? 'bg-blue-100 border-blue-500 text-blue-800 scale-[1.02] shadow-md'
                  : shakeId === tile.id
                  ? 'bg-red-100 border-red-400 text-red-700 duo-shake'
                  : 'bg-white dark:bg-[#2c2c2e] border-gray-200 dark:border-white/[0.08] text-gray-800 dark:text-[#f5f5f7] hover:border-blue-300 hover:bg-blue-50 active:scale-95'
              )}
            >
              {tile.matched ? '✓ ' : ''}{tile.text}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {defTiles.map(tile => (
            <button
              key={tile.id}
              onClick={() => handleTile(tile)}
              className={cn(
                'w-full px-3 py-3 rounded-xl text-sm border-2 transition-all duration-200 text-center leading-tight',
                tile.matched
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-700 duo-match-success opacity-60'
                  : selected?.id === tile.id
                  ? 'bg-violet-100 border-violet-500 text-violet-800 scale-[1.02] shadow-md'
                  : shakeId === tile.id
                  ? 'bg-red-100 border-red-400 text-red-700 duo-shake'
                  : 'bg-white dark:bg-[#2c2c2e] border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-[#a1a1a6] hover:border-violet-300 hover:bg-violet-50 active:scale-95'
              )}
            >
              {tile.matched ? '✓ ' : ''}{tile.text}
            </button>
          ))}
        </div>
      </div>
      {mistakes > 0 && (
        <p className="text-center text-xs text-red-400 mt-2">Ошибок: {mistakes}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Question format types
// ─────────────────────────────────────────────────────────────────────────────
type QFormat = 'list' | 'grid' | 'chips' | 'binary' | 'word';
function getFormat(qIndex: number): QFormat {
  const seq: QFormat[] = ['list', 'grid', 'chips', 'binary', 'word', 'grid', 'chips', 'list', 'binary', 'word'];
  return seq[qIndex % seq.length];
}

type OptionProps = {
  options: { id: string; text: string; correct: boolean }[];
  selectedId: string | null;
  onAnswer: (id: string) => void;
};

// ── Format 1: List (classic) ─────────────────────────────────────────────────
function ListQuestion({ options, selectedId, onAnswer }: OptionProps) {
  const labels = ['А', 'Б', 'В', 'Г'];
  return (
    <div className="space-y-2.5">
      {options.map((opt, idx) => {
        const isSelected = selectedId === opt.id;
        const showResult = !!selectedId;
        let style = 'bg-white dark:bg-[#2c2c2e] border-2 border-gray-200 dark:border-white/[0.08] text-gray-800 dark:text-[#f5f5f7] hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]';
        if (showResult && isSelected && opt.correct)  style = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-900 duo-bounce-correct';
        else if (showResult && isSelected && !opt.correct) style = 'bg-red-100 border-2 border-red-400 text-red-900 duo-shake';
        else if (showResult && opt.correct) style = 'bg-emerald-50 border-2 border-emerald-400 text-emerald-800';
        else if (showResult) style = 'bg-gray-50 dark:bg-[#1c1c1e] border-2 border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-[#636366]';
        return (
          <button key={opt.id} onClick={() => !selectedId && onAnswer(opt.id)} disabled={!!selectedId}
            className={cn('duo-slide-up w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium text-sm transition-all duration-200 text-left shadow-sm', style)}
            style={{ animationDelay: `${0.05 + idx * 0.07}s` }}>
            <span className={cn('w-7 h-7 rounded-xl font-black text-xs flex-shrink-0 flex items-center justify-center',
              showResult && opt.correct && isSelected ? 'bg-emerald-500 text-white' :
              showResult && isSelected && !opt.correct ? 'bg-red-400 text-white' :
              showResult && opt.correct ? 'bg-emerald-200 text-emerald-700' :
              showResult ? 'bg-gray-200 dark:bg-[#3a3a3c] text-gray-400 dark:text-[#636366]' : 'bg-gray-100 dark:bg-[#2c2c2e] text-gray-600 dark:text-[#a1a1a6]')}>
              {showResult && isSelected && opt.correct ? '✓' : showResult && isSelected ? '✗' : labels[idx]}
            </span>
            <span className="leading-snug">{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Format 2: Grid cards (2×2) ───────────────────────────────────────────────
const GRID_COLORS = [
  { base: '#3b82f6', light: '#eff6ff', border: '#93c5fd' },
  { base: '#10b981', light: '#ecfdf5', border: '#6ee7b7' },
  { base: '#f59e0b', light: '#fffbeb', border: '#fcd34d' },
  { base: '#8b5cf6', light: '#f5f3ff', border: '#c4b5fd' },
];
function GridQuestion({ options, selectedId, onAnswer }: OptionProps) {
  const labels = ['А', 'Б', 'В', 'Г'];
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt, idx) => {
        const c = GRID_COLORS[idx];
        const isSelected = selectedId === opt.id;
        const showResult = !!selectedId;
        const isCorrect = opt.correct;
        const animClass = showResult && isSelected && isCorrect ? 'duo-bounce-correct' :
                          showResult && isSelected && !isCorrect ? 'duo-shake' : 'grid-card-in';
        const bg    = showResult && isCorrect ? '#d1fae5' : showResult && isSelected ? '#fee2e2' : showResult ? '#f9fafb' : c.light;
        const border = showResult && isCorrect ? '#34d399' : showResult && isSelected ? '#f87171' : showResult ? '#e5e7eb' : c.border;
        return (
          <button key={opt.id} onClick={() => !selectedId && onAnswer(opt.id)} disabled={!!selectedId}
            className={cn('relative rounded-2xl p-4 text-left shadow-md transition-all duration-200 active:scale-95 border-2', animClass)}
            style={{ backgroundColor: bg, borderColor: border, animationDelay: `${idx * 0.09}s`, minHeight: 90 }}>
            <span className="block text-xs font-black mb-2 opacity-60" style={{ color: showResult ? '#6b7280' : c.base }}>
              {labels[idx]}
            </span>
            <span className="block font-bold text-sm leading-snug text-gray-800 dark:text-[#f5f5f7]">{opt.text}</span>
            {showResult && isCorrect && <span className="absolute top-2.5 right-2.5 text-base">✅</span>}
            {showResult && isSelected && !isCorrect && <span className="absolute top-2.5 right-2.5 text-base">❌</span>}
          </button>
        );
      })}
    </div>
  );
}

// ── Format 3: Chips / tap-to-fill ───────────────────────────────────────────
function ChipsQuestion({ options, selectedId, onAnswer }: OptionProps) {
  const selected = options.find(o => o.id === selectedId);
  const showResult = !!selectedId;
  return (
    <div>
      {/* Answer slot */}
      <div className={cn(
        'rounded-2xl border-2 border-dashed min-h-[62px] flex items-center justify-center mb-5 px-4 transition-all duration-300',
        !showResult ? 'border-gray-300 dark:border-white/[0.12] bg-gray-50 dark:bg-[#1c1c1e]' :
        selected?.correct ? 'border-emerald-400 bg-emerald-50 slot-fill' : 'border-red-400 bg-red-50 duo-shake'
      )}>
        {selected ? (
          <span className={cn('font-bold text-base text-center', selected.correct ? 'text-emerald-700' : 'text-red-600')}>
            {selected.correct ? '✅ ' : '❌ '}{selected.text}
          </span>
        ) : (
          <span className="text-gray-400 dark:text-[#636366] text-sm">👆 Нажмите на правильный ответ</span>
        )}
      </div>
      {/* Chips */}
      <div className="flex flex-wrap gap-2.5 justify-center">
        {options.map((opt, idx) => {
          const isSelected = selectedId === opt.id;
          const isCorrect = opt.correct;
          const animClass = isSelected && isCorrect ? 'chip-correct' :
                            isSelected && !isCorrect ? 'duo-shake' : 'chip-in';
          let chipCls = 'bg-white dark:bg-[#2c2c2e] border-2 border-gray-200 dark:border-white/[0.08] text-gray-800 dark:text-[#f5f5f7] hover:border-blue-400 hover:bg-blue-50 hover:scale-105 active:scale-95 shadow-sm';
          if (showResult && isSelected && isCorrect)  chipCls = 'bg-emerald-100 border-2 border-emerald-400 text-emerald-800 shadow-md';
          else if (showResult && isSelected && !isCorrect) chipCls = 'bg-red-100 border-2 border-red-400 text-red-700';
          else if (showResult && isCorrect) chipCls = 'bg-emerald-50 border-2 border-emerald-300 text-emerald-700 opacity-80';
          else if (showResult) chipCls = 'bg-gray-50 dark:bg-[#1c1c1e] border-2 border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-[#636366] opacity-40 wrong-fade';
          return (
            <button key={opt.id} onClick={() => !selectedId && onAnswer(opt.id)} disabled={!!selectedId}
              className={cn('px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200', animClass, chipCls)}
              style={{ animationDelay: `${idx * 0.09}s` }}>
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Format 4: Binary (Верно / Неверно) ──────────────────────────────────────
// Shows either the CORRECT or a WRONG option — user judges which
function BinaryQuestion({ options, selectedId, onAnswer }: OptionProps) {
  const correct = options.find(o => o.correct)!;
  const wrongs  = options.filter(o => !o.correct);
  // Stable per render: show correct half the time
  const [showCorrect]  = useState(() => Math.random() > 0.5);
  const shown          = showCorrect ? correct : wrongs[0];
  const showResult     = !!selectedId;

  const handleVote = (saysCorrect: boolean) => {
    if (selectedId) return;
    const userRight = saysCorrect === showCorrect;
    onAnswer(userRight ? correct.id : wrongs[0].id);
  };

  const voted = showResult ? (selectedId === correct.id ? true : false) : null;

  return (
    <div className="duo-slide-up">
      {/* Statement card */}
      <div className={cn(
        'rounded-2xl border-2 p-5 mb-5 text-center transition-all duration-300 shadow-sm',
        !showResult ? 'bg-white dark:bg-[#2c2c2e] border-gray-200 dark:border-white/[0.08]' :
        (showCorrect ? 'bg-emerald-50 border-emerald-400' : 'bg-red-50 border-red-300')
      )}>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-[#636366] mb-2">Это верное утверждение?</p>
        <p className="font-bold text-base text-gray-900 dark:text-[#f5f5f7] leading-snug">«{shown.text}»</p>
        {showResult && (
          <p className={cn('text-xs font-bold mt-2', showCorrect ? 'text-emerald-600' : 'text-red-500')}>
            {showCorrect ? '✅ Это правильный ответ' : '❌ Это неверный ответ'}
          </p>
        )}
      </div>

      {/* ВЕРНО / НЕВЕРНО buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleVote(true)}
          disabled={showResult}
          className={cn(
            'py-4 rounded-2xl font-black text-base border-2 transition-all duration-200 active:scale-95 shadow-sm',
            showResult
              ? (showCorrect && voted ? 'bg-emerald-500 text-white border-emerald-500' :
                 !showCorrect && !voted ? 'bg-red-400 text-white border-red-400 duo-shake' :
                 'bg-gray-100 dark:bg-[#2c2c2e] text-gray-400 dark:text-[#636366] border-gray-200 dark:border-white/[0.08] opacity-50')
              : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
          )}
        >
          ✅ ВЕРНО
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={showResult}
          className={cn(
            'py-4 rounded-2xl font-black text-base border-2 transition-all duration-200 active:scale-95 shadow-sm',
            showResult
              ? (!showCorrect && voted === false ? 'bg-red-500 text-white border-red-500' :
                 showCorrect && voted === false ? 'bg-emerald-500 text-white border-emerald-500' :
                 'bg-gray-100 dark:bg-[#2c2c2e] text-gray-400 dark:text-[#636366] border-gray-200 dark:border-white/[0.08] opacity-50')
              : 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
          )}
        >
          ❌ НЕВЕРНО
        </button>
      </div>

      {showResult && (
        <p className="text-center text-xs text-gray-400 dark:text-[#636366] mt-3">
          Правильный ответ: <strong className="text-gray-700 dark:text-[#f5f5f7]">{correct.text}</strong>
        </p>
      )}
    </div>
  );
}

// ── Format 5: Word Builder (tap chunks to assemble answer) ───────────────────
function splitChunks(text: string): string[] {
  const words = text.split(' ');
  if (words.length <= 2) return words;
  const n = words.length <= 5 ? 3 : 4;
  const size = Math.ceil(words.length / n);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += size) chunks.push(words.slice(i, i + size).join(' '));
  return chunks;
}

function WordBuilder({ options, selectedId, onAnswer }: OptionProps) {
  const correct   = options.find(o => o.correct)!;
  const wrongOpt  = options.find(o => !o.correct)!;
  const chunks    = splitChunks(correct.text);
  const [bank,    setBank]    = useState<{ id: string; text: string; used: boolean }[]>(() =>
    [...chunks.map((c, i) => ({ id: String(i), text: c, used: false }))]
      .sort(() => Math.random() - 0.5)
  );
  const [assembled, setAssembled] = useState<string[]>([]);
  const showResult = !!selectedId;

  const tap = (id: string) => {
    if (showResult) return;
    setBank(b => b.map(t => t.id === id ? { ...t, used: true } : t));
    setAssembled(a => [...a, id]);
  };
  const remove = (id: string) => {
    if (showResult) return;
    setBank(b => b.map(t => t.id === id ? { ...t, used: false } : t));
    setAssembled(a => a.filter(x => x !== id));
  };
  const submit = () => {
    const assembled_text = assembled.map(id => bank.find(t => t.id === id)!.text).join(' ');
    onAnswer(assembled_text === correct.text ? correct.id : wrongOpt.id);
  };

  const allUsed = bank.every(t => t.used);
  const assembledText = assembled.map(id => bank.find(t => t.id === id)!.text).join(' ');
  const isCorrectAssembly = assembledText === correct.text;

  return (
    <div className="duo-slide-up">
      <p className="text-center text-xs font-bold text-gray-400 dark:text-[#636366] uppercase tracking-widest mb-3">
        🔤 Собери правильный ответ
      </p>

      {/* Assembly zone */}
      <div className={cn(
        'min-h-[64px] rounded-2xl border-2 border-dashed p-3 mb-4 flex flex-wrap gap-2 items-center',
        showResult
          ? (isCorrectAssembly ? 'bg-emerald-50 border-emerald-400' : 'bg-red-50 border-red-400')
          : assembled.length ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 dark:bg-[#1c1c1e] border-gray-200 dark:border-white/[0.08]'
      )}>
        {assembled.length === 0 && (
          <span className="text-gray-400 dark:text-[#636366] text-sm w-full text-center">Нажимай слова ниже →</span>
        )}
        {assembled.map((id, i) => {
          const chunk = bank.find(t => t.id === id)!;
          return (
            <button key={`${id}-${i}`} onClick={() => !showResult && remove(id)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition-all duration-150 active:scale-95',
                showResult
                  ? (isCorrectAssembly ? 'bg-emerald-200 border-emerald-400 text-emerald-800' : 'bg-red-200 border-red-400 text-red-800')
                  : 'bg-blue-100 border-blue-400 text-blue-800 hover:bg-blue-200'
              )}>
              {chunk.text}
            </button>
          );
        })}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {bank.map((t, i) => (
          <button key={t.id} onClick={() => !t.used && !showResult && tap(t.id)}
            disabled={t.used || showResult}
            className={cn(
              'px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200',
              t.used ? 'opacity-0 pointer-events-none' : 'chip-in bg-white dark:bg-[#2c2c2e] border-gray-200 dark:border-white/[0.08] text-gray-800 dark:text-[#f5f5f7] hover:border-blue-400 hover:bg-blue-50 hover:scale-105 active:scale-95 shadow-sm'
            )}
            style={{ animationDelay: `${i * 0.08}s` }}>
            {t.text}
          </button>
        ))}
      </div>

      {/* Submit */}
      {!showResult && (
        <button onClick={submit} disabled={!allUsed}
          className={cn(
            'w-full py-3 rounded-2xl font-black text-sm transition-all duration-200',
            allUsed
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md'
              : 'bg-gray-100 dark:bg-[#2c2c2e] text-gray-400 dark:text-[#636366] cursor-not-allowed border-2 border-gray-200 dark:border-white/[0.08]'
          )}>
          {allUsed ? 'Проверить ✓' : `Осталось выбрать: ${bank.filter(t => !t.used).length}`}
        </button>
      )}

      {showResult && (
        <div className={cn('text-center text-sm font-bold mt-1', isCorrectAssembly ? 'text-emerald-600' : 'text-red-500')}>
          {isCorrectAssembly ? '🎉 Верно собрано!' : `Правильно: «${correct.text}»`}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Confetti
// ─────────────────────────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899'][i % 6],
    left: `${5 + i * 4.5}%`,
    delay: `${(i * 0.1).toFixed(1)}s`,
    duration: `${1.2 + (i % 4) * 0.3}s`,
    size: i % 3 === 0 ? 12 : i % 2 === 0 ? 8 : 10,
    shape: i % 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 0 ? '50%' : p.shape === 1 ? '2px' : '50% 0 50% 0',
            animation: `confetti-fall ${p.duration} ${p.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main DuoExamPlayer
// ─────────────────────────────────────────────────────────────────────────────
type Screen = 'intro' | 'question' | 'result';
type FeedbackState = { visible: boolean; correct: boolean; explanation: string; correctText: string } | null;

export function DuoExamPlayer({ day, onBack }: { day: number; onBack: () => void }) {
  const { setResult } = useDailyExamStore();
  const exam = DAILY_EXAMS.find(e => e.day === day)!;
  const questions = exam.questionIds.map(id => QUESTIONS[id]);

  const [screen, setScreen] = useState<Screen>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [xp, setXp] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [cardKey, setCardKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [matchingDone, setMatchingDone] = useState(false);

  const currentQ = questions[qIndex];
  const isMatchingRound = (qIndex + 1) % 5 === 0;
  const col = CHAPTER_COLORS[currentQ?.chapter ?? 1];
  const qFormat = getFormat(qIndex);

  const advance = useCallback(() => {
    setFeedback(null);
    setSelectedId(null);
    if (qIndex + 1 >= TOTAL_QUESTIONS) {
      setScreen('result');
    } else {
      setQIndex(i => i + 1);
      setCardKey(k => k + 1);
      setMatchingDone(false);
    }
  }, [qIndex]);

  const handleAnswer = useCallback((optionId: string) => {
    if (selectedId || feedback) return;
    setSelectedId(optionId);

    const option = currentQ.options.find(o => o.id === optionId)!;
    const correct = option.correct;
    const correctOption = currentQ.options.find(o => o.correct)!;

    if (correct) {
      setScore(s => s + 1);
      setXp(x => x + 10);
    } else {
      setHearts(h => Math.max(0, h - 1));
    }

    setFeedback({
      visible: true,
      correct,
      explanation: currentQ.explanation,
      correctText: correctOption.text,
    });
  }, [selectedId, feedback, currentQ]);

  const handleMatchComplete = useCallback((correct: boolean) => {
    if (correct) {
      setScore(s => s + 1);
      setXp(x => x + 15);
    } else {
      setHearts(h => Math.max(0, h - 1));
    }
    setMatchingDone(true);
    setFeedback({
      visible: true,
      correct,
      explanation: correct ? 'Все пары совпали! Отличная работа!' : 'Некоторые пары не совпали. Повтори термины!',
      correctText: '',
    });
  }, []);

  // Results
  useEffect(() => {
    if (screen === 'result') {
      const passed = score >= PASS_THRESHOLD;
      setResult(day, score, passed);
      if (passed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [screen, score, day, setResult]);

  // ── INTRO SCREEN ────────────────────────────────────────────────────────────
  if (screen === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
        <div className="animate-float mb-2">
          <MascotSvg mood="happy" size={120} />
        </div>
        <div className="duo-pop text-center mb-8">
          <div className="inline-block bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest">
            День {day}
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-[#f5f5f7] mb-1">Ежедневный экзамен</h1>
          <p className="text-gray-500 dark:text-[#a1a1a6] text-sm">20 вопросов · 3 жизни · Нужно 15 правильных</p>
        </div>

        <div className="flex gap-6 mb-8 duo-slide-up">
          <div className="text-center">
            <div className="text-2xl mb-1">❤️❤️❤️</div>
            <p className="text-xs text-gray-400 dark:text-[#636366]">3 жизни</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs text-gray-400 dark:text-[#636366]">XP за ответы</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🔗</div>
            <p className="text-xs text-gray-400 dark:text-[#636366]">Мини-игры</p>
          </div>
        </div>

        <button
          onClick={() => setScreen('question')}
          className="w-64 py-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-lg rounded-2xl shadow-lg transition-all duration-200"
        >
          Начать! 🚀
        </button>
        <button onClick={onBack} className="mt-4 text-sm text-gray-400 dark:text-[#636366] hover:text-gray-600 dark:text-[#a1a1a6] transition-colors">
          ← Назад к экзаменам
        </button>
      </div>
    );
  }

  // ── RESULT SCREEN ───────────────────────────────────────────────────────────
  if (screen === 'result') {
    const passed = score >= PASS_THRESHOLD;
    const pct = Math.round((score / TOTAL_QUESTIONS) * 100);

    return (
      <div className={cn('min-h-screen flex flex-col items-center justify-center p-6', passed ? 'bg-gradient-to-br from-emerald-50 to-green-100' : 'bg-gradient-to-br from-red-50 to-orange-100')}>
        {showConfetti && <Confetti />}

        <div className={cn('duo-celebrate mb-2', passed ? 'animate-float' : '')}>
          <MascotSvg mood={passed ? 'celebrate' : 'sad'} size={130} />
        </div>

        <div className="duo-pop text-center mb-6">
          <div className="text-5xl mb-3">{passed ? '🏆' : '😔'}</div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-[#f5f5f7] mb-1">
            {passed ? 'Сдал!' : 'Не сдал'}
          </h2>
          <p className="text-gray-500 dark:text-[#a1a1a6]">{passed ? 'Отличная работа, диспетчер!' : 'Не расстраивайся, попробуй ещё раз'}</p>
        </div>

        {/* Score */}
        <div className="duo-slide-up w-full max-w-sm mb-6">
          <div className="bg-white dark:bg-[#2c2c2e] rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-white/[0.06]">
            {/* Big score */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={cn('text-6xl font-black', passed ? 'text-emerald-600' : 'text-red-500')}>{score}</div>
              <div className="text-2xl text-gray-300 dark:text-[#636366] font-light">/</div>
              <div className="text-3xl font-bold text-gray-400 dark:text-[#636366]">{TOTAL_QUESTIONS}</div>
            </div>

            {/* Progress bar */}
            <div className="h-4 bg-gray-100 dark:bg-[#2c2c2e] rounded-full overflow-hidden mb-4">
              <div
                className={cn('h-full rounded-full transition-all duration-1000', passed ? 'bg-emerald-500' : 'bg-red-400')}
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 dark:bg-[#1c1c1e] rounded-2xl p-3">
                <div className="text-xl font-black text-emerald-600">{score}</div>
                <div className="text-[10px] text-gray-400 dark:text-[#636366] font-medium">ВЕРНО</div>
              </div>
              <div className="bg-gray-50 dark:bg-[#1c1c1e] rounded-2xl p-3">
                <div className="text-xl font-black text-red-500">{TOTAL_QUESTIONS - score}</div>
                <div className="text-[10px] text-gray-400 dark:text-[#636366] font-medium">НЕВЕРНО</div>
              </div>
              <div className="bg-gray-50 dark:bg-[#1c1c1e] rounded-2xl p-3">
                <div className="text-xl font-black text-yellow-600">{xp}</div>
                <div className="text-[10px] text-gray-400 dark:text-[#636366] font-medium">XP</div>
              </div>
            </div>

            {/* Hearts remaining */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-xs text-gray-400 dark:text-[#636366]">Осталось жизней:</span>
              <Hearts count={hearts} />
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => {
              setQIndex(0); setScore(0); setXp(0); setHearts(3);
              setSelectedId(null); setFeedback(null); setCardKey(0); setMatchingDone(false);
              setScreen('question');
            }}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-base rounded-2xl shadow transition-all"
          >
            🔄 Пройти ещё раз
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 bg-white dark:bg-[#2c2c2e] hover:bg-gray-50 dark:hover:bg-white/5 dark:bg-[#1c1c1e] active:scale-95 text-gray-700 dark:text-[#f5f5f7] font-semibold rounded-2xl border border-gray-200 dark:border-white/[0.08] transition-all"
          >
            ← К списку экзаменов
          </button>
        </div>
      </div>
    );
  }

  // ── QUESTION SCREEN ─────────────────────────────────────────────────────────
  const progress = ((qIndex) / TOTAL_QUESTIONS) * 100;

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-[#2c2c2e] border-b border-gray-100 dark:border-white/[0.06] px-4 py-3">
        <div className="max-w-lg lg:max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 dark:text-[#636366] hover:text-gray-600 dark:text-[#a1a1a6] text-lg mr-1">✕</button>
          {/* Progress bar */}
          <div className="flex-1 h-3 bg-gray-100 dark:bg-[#2c2c2e] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Hearts count={hearts} />
          </div>
          <XpBadge xp={xp} />
        </div>
        <div className="max-w-lg lg:max-w-2xl mx-auto mt-1 text-center">
          <span className="text-[10px] text-gray-400 dark:text-[#636366] font-medium">{qIndex + 1} / {TOTAL_QUESTIONS}</span>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        <div className="max-w-lg lg:max-w-2xl mx-auto" key={cardKey}>
          {/* Chapter badge */}
          <div className="duo-card-enter flex items-center justify-center gap-2 mb-3">
            <span className={cn('text-xs font-black px-3 py-1 rounded-full text-white', col.badge)}>
              Глава {currentQ.chapter} · {CHAPTER_NAMES[currentQ.chapter]}
            </span>
            {isMatchingRound && (
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                🔗 Мини-игра
              </span>
            )}
          </div>

{/* Question card */}
          <div className={cn('duo-card-enter rounded-3xl border-2 p-5 mb-4 shadow-sm', col.bg, col.border)} style={{ animationDelay: '0.1s' }}>
            {/* Scenario */}
            {currentQ.scenario && (
              <div className="bg-white/80 border border-blue-200 rounded-2xl p-3 mb-3 text-sm text-blue-800 leading-relaxed">
                <span className="font-bold text-blue-600 text-xs uppercase tracking-wide block mb-1">📋 Ситуация</span>
                {currentQ.scenario}
              </div>
            )}
            {/* Question text */}
            {!isMatchingRound && (
              <p className="text-gray-900 dark:text-[#f5f5f7] font-bold text-base leading-snug">{currentQ.text}</p>
            )}
            {isMatchingRound && (
              <p className={cn('text-sm font-bold mb-1', col.text)}>Глава {currentQ.chapter}: Словарный раунд</p>
            )}
          </div>

          {/* Format badge */}
          {!isMatchingRound && (
            <div className="flex justify-center mb-3">
              <span className="text-[10px] font-bold text-gray-400 dark:text-[#636366] uppercase tracking-widest px-3 py-1 bg-white dark:bg-[#2c2c2e] rounded-full border border-gray-200 dark:border-white/[0.08] shadow-sm">
                {qFormat === 'grid'   ? '🟦 Выбери карточку'        :
                 qFormat === 'chips'  ? '🫧 Нажми правильный ответ' :
                 qFormat === 'binary' ? '⚖️ Верно или неверно?'     :
                 qFormat === 'word'   ? '🔤 Собери ответ'           :
                                        '📋 Выбери ответ'}
              </span>
            </div>
          )}

          {/* Matching mini-game OR question formats */}
          {isMatchingRound && !matchingDone ? (
            <MatchingGame chapter={currentQ.chapter} onComplete={handleMatchComplete} />
          ) : !isMatchingRound ? (
            qFormat === 'grid'   ? <GridQuestion   options={currentQ.options} selectedId={selectedId} onAnswer={handleAnswer} /> :
            qFormat === 'chips'  ? <ChipsQuestion  options={currentQ.options} selectedId={selectedId} onAnswer={handleAnswer} /> :
            qFormat === 'binary' ? <BinaryQuestion options={currentQ.options} selectedId={selectedId} onAnswer={handleAnswer} /> :
            qFormat === 'word'   ? <WordBuilder    options={currentQ.options} selectedId={selectedId} onAnswer={handleAnswer} /> :
                                   <ListQuestion   options={currentQ.options} selectedId={selectedId} onAnswer={handleAnswer} />
          ) : null}
        </div>
      </div>

      {/* Feedback Sheet */}
      {feedback?.visible && (
        <div style={{ position: 'fixed', bottom: 24, left: 0, right: 0, zIndex: 20 }} className="lg:pl-56 px-4">
          <div
            className={cn('duo-sheet-up shadow-2xl rounded-2xl', feedback.correct ? 'bg-emerald-100 border-2 border-emerald-300' : 'bg-red-100 border-2 border-red-300')}
            style={{ maxWidth: 672, marginLeft: 'auto', marginRight: 'auto', padding: '14px 20px 16px' }}
          >
            <p style={{ textAlign: 'center', fontWeight: 900, fontSize: 14, color: '#111827', marginBottom: 4 }}>
              {feedback.correct ? '✅ Правильно!' : '❌ Неверно'}
            </p>
            {!feedback.correct && feedback.correctText && (
              <p style={{ textAlign: 'center', fontSize: 12, color: '#111827', marginBottom: 2 }}>
                Ответ: <strong>{feedback.correctText}</strong>
              </p>
            )}
            <p style={{ textAlign: 'center', fontSize: 12, color: '#374151', lineHeight: 1.5, marginBottom: 12 }}>
              {feedback.explanation}
            </p>
            <button
              onClick={advance}
              style={{ display: 'block', width: '100%', padding: '9px 0', fontWeight: 900, fontSize: 14, borderRadius: 12, border: 'none', cursor: 'pointer' }}
              className={cn(feedback.correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white')}
            >
              {qIndex + 1 >= TOTAL_QUESTIONS ? 'Завершить 🏁' : 'Продолжить →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
