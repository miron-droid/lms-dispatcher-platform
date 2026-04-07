'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n/lang-context';

const EQUIPMENT = [
  { id: 'cv', name: 'Cargo Van', nameRu: 'Карго Вэн', emoji: '📦', specs: '2-4 pallets · 5,000 lbs · No CDL' },
  { id: 'bt16', name: 'Box Truck 16ft', nameRu: 'Бокс Трак 16ft', emoji: '🚚', specs: '6-8 pallets · 7,000 lbs · No CDL' },
  { id: 'bt26', name: 'Box Truck 26ft', nameRu: 'Бокс Трак 26ft', emoji: '🚛', specs: '12-14 pallets · 10,000 lbs · CDL B' },
  { id: 'dv', name: 'Dry Van 53ft', nameRu: 'Драй Вэн 53ft', emoji: '📋', specs: '24-26 pallets · 45,000 lbs · CDL A' },
  { id: 'fb', name: 'Flatbed', nameRu: 'Флэтбед', emoji: '🔩', specs: 'Open · 48,000 lbs · CDL A' },
  { id: 'rf', name: 'Reefer', nameRu: 'Рефрижератор', emoji: '❄️', specs: 'Temp control · 43,000 lbs · CDL A' },
];

const ROUNDS = [
  { id: 1, desc: '3 boxes medical equipment, 800 lbs, urgent same-day delivery', descRu: '3 коробки мед. оборудования, 800 lbs, срочная доставка в тот же день', answer: 'cv', why: { cv: '', bt16: 'Overkill for 3 boxes', bt26: 'Way too big', dv: 'Need a full semi for 3 boxes?', fb: 'Medical equipment needs enclosed space', rf: 'No temp control needed' } },
  { id: 2, desc: '6 pallets furniture, 5,500 lbs, residential delivery with liftgate', descRu: '6 паллет мебели, 5,500 lbs, жилая доставка с лифтгейтом', answer: 'bt16', why: { cv: 'Too small for 6 pallets', bt16: '', bt26: 'Works but more expensive than needed', dv: 'Overkill — and no liftgate on semi', fb: 'Furniture needs enclosed space', rf: 'No temp control needed' } },
  { id: 3, desc: '12 pallets canned goods, 9,800 lbs, retail store dock delivery', descRu: '12 паллет консервов, 9,800 lbs, доставка на док магазина', answer: 'bt26', why: { cv: 'Way too small', bt16: 'Only fits 6-8 pallets', bt26: '', dv: 'Works but too expensive for this load', fb: 'Canned goods need enclosed trailer', rf: 'No temp control needed' } },
  { id: 4, desc: '24 pallets paper products, 42,000 lbs, warehouse dock-to-dock', descRu: '24 паллеты бумажной продукции, 42,000 lbs, склад-склад', answer: 'dv', why: { cv: 'Are you serious?', bt16: 'Max 7,000 lbs — way over', bt26: 'Max 10,000 lbs — way over', dv: '', fb: 'Paper needs weather protection', rf: 'No temp control needed' } },
  { id: 5, desc: 'Steel beams, 8ft wide, 36,000 lbs, construction site', descRu: 'Стальные балки, 8 футов шириной, 36,000 lbs, строительная площадка', answer: 'fb', why: { cv: 'Steel beams in a van?', bt16: 'Can\'t load 8ft wide beams', bt26: 'Can\'t load from top/side', dv: 'Beams need crane loading from top', fb: '', rf: 'Steel doesn\'t need refrigeration' } },
  { id: 6, desc: '20 pallets frozen chicken, 38,000 lbs, must maintain -10°F', descRu: '20 паллет замороженной курицы, 38,000 lbs, температура -10°F', answer: 'rf', why: { cv: 'No temp control, too small', bt16: 'No temp control, too small', bt26: 'No temp control', dv: 'No refrigeration unit', fb: 'Open trailer for frozen food?!', rf: '' } },
];

export function EquipmentMatcher() {
  const { lang } = useLang();
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = ROUNDS[round];

  function confirm() {
    if (!selected || !current) return;
    if (selected === current.answer) {
      setResult('correct');
      setScore(s => s + (attempts === 0 ? 1 : 0));
      setTimeout(() => {
        if (round + 1 >= ROUNDS.length) setFinished(true);
        else { setRound(r => r + 1); setSelected(null); setResult(null); setAttempts(0); }
      }, 1500);
    } else {
      setResult('wrong');
      setAttempts(a => a + 1);
      setTimeout(() => { setResult(null); setSelected(null); }, 2000);
    }
  }

  if (finished) {
    return (
      <div className="mt-6 card p-6 text-center space-y-3">
        <p className="text-4xl">🔧</p>
        <p className="text-2xl font-bold">{score}/{ROUNDS.length}</p>
        <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">{lang === 'ru' ? 'правильных с первой попытки' : 'correct on first try'}</p>
        <p className="text-sm">{score >= 5 ? '🌟 ' + (lang === 'ru' ? 'Эксперт по оборудованию!' : 'Equipment expert!') : score >= 3 ? '👍' : '📚 ' + (lang === 'ru' ? 'Перечитай раздел' : 'Review the section')}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400 dark:text-[#636366] uppercase tracking-wide">
          {lang === 'ru' ? 'Подбор оборудования' : 'Equipment Match'}
        </p>
        <p className="text-xs text-gray-400 dark:text-[#636366]">{round + 1}/{ROUNDS.length}</p>
      </div>

      {/* Load ticket */}
      <div className="bg-gray-900 text-white rounded-xl p-4">
        <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-[#636366] mb-1">
          {lang === 'ru' ? 'Описание груза' : 'Load Description'}
        </p>
        <p className="text-sm font-medium leading-relaxed">
          {lang === 'ru' ? current.descRu : current.desc}
        </p>
      </div>

      {/* Equipment grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        {EQUIPMENT.map(eq => {
          const isSelected = selected === eq.id;
          const isCorrect = result === 'correct' && eq.id === current.answer;
          const isWrong = result === 'wrong' && isSelected;
          return (
            <button
              key={eq.id}
              onClick={() => !result && setSelected(eq.id)}
              disabled={!!result}
              className={cn(
                'card p-3 text-left transition-all',
                isSelected && !result && 'border-brand-500 ring-2 ring-brand-200',
                isCorrect && 'border-green-500 bg-green-50 ring-2 ring-green-200',
                isWrong && 'border-red-400 bg-red-50 animate-[shake_0.5s_ease-in-out]',
              )}
            >
              <span className="text-2xl">{eq.emoji}</span>
              <p className="text-sm font-semibold mt-1">{lang === 'ru' ? eq.nameRu : eq.name}</p>
              <p className="text-[10px] text-gray-400 dark:text-[#636366] mt-0.5">{eq.specs}</p>
            </button>
          );
        })}
      </div>

      {/* Wrong explanation */}
      {result === 'wrong' && selected && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          ❌ {(current.why as unknown as Record<string, string>)[selected]}
        </div>
      )}

      {/* Correct message */}
      {result === 'correct' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
          ✅ {lang === 'ru' ? 'Идеальное совпадение!' : 'Perfect match!'}
        </div>
      )}

      {/* Confirm button */}
      {!result && (
        <button onClick={confirm} disabled={!selected} className="btn-primary disabled:opacity-40">
          {lang === 'ru' ? 'Подтвердить' : 'Confirm Match'}
        </button>
      )}
    </div>
  );
}
