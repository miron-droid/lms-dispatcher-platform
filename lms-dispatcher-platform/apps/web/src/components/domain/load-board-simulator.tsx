'use client';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Star, ArrowUpDown, Filter } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';

interface Load {
  id: string; origin: string; dest: string; miles: number; dh: number;
  rate: number; rpm: number; weight: number; commodity: string;
  equipment: string; broker: string; age: string; backhaul: 'strong' | 'moderate' | 'weak';
}

const TRUCK = { city: 'Nashville, TN', equipment: 'Dry Van 53\'' };

const LOADS: Load[] = [
  { id: 'L1', origin: 'Memphis, TN', dest: 'Dallas, TX', miles: 450, dh: 210, rate: 1575, rpm: 3.50, weight: 38000, commodity: 'Paper Products', equipment: 'Dry Van', broker: 'CH Robinson', age: '2h', backhaul: 'strong' },
  { id: 'L2', origin: 'Nashville, TN', dest: 'Atlanta, GA', miles: 250, dh: 5, rate: 625, rpm: 2.50, weight: 42000, commodity: 'Auto Parts', equipment: 'Dry Van', broker: 'TQL', age: '45m', backhaul: 'strong' },
  { id: 'L3', origin: 'Nashville, TN', dest: 'Chicago, IL', miles: 470, dh: 5, rate: 1316, rpm: 2.80, weight: 36000, commodity: 'Consumer Goods', equipment: 'Dry Van', broker: 'Echo', age: '1h', backhaul: 'strong' },
  { id: 'L4', origin: 'Knoxville, TN', dest: 'Charlotte, NC', miles: 270, dh: 180, rate: 756, rpm: 2.80, weight: 28000, commodity: 'Textiles', equipment: 'Dry Van', broker: 'Coyote', age: '3h', backhaul: 'moderate' },
  { id: 'L5', origin: 'Nashville, TN', dest: 'Jacksonville, FL', miles: 560, dh: 5, rate: 1400, rpm: 2.50, weight: 44000, commodity: 'Building Materials', equipment: 'Dry Van', broker: 'XPO', age: '30m', backhaul: 'weak' },
  { id: 'L6', origin: 'Chattanooga, TN', dest: 'Houston, TX', miles: 780, dh: 135, rate: 2106, rpm: 2.70, weight: 40000, commodity: 'Electronics', equipment: 'Dry Van', broker: 'Uber Freight', age: '4h', backhaul: 'strong' },
  { id: 'L7', origin: 'Nashville, TN', dest: 'Indianapolis, IN', miles: 290, dh: 5, rate: 957, rpm: 3.30, weight: 32000, commodity: 'Food (dry)', equipment: 'Dry Van', broker: 'Convoy', age: '15m', backhaul: 'strong' },
  { id: 'L8', origin: 'Memphis, TN', dest: 'Laredo, TX', miles: 870, dh: 210, rate: 1914, rpm: 2.20, weight: 43000, commodity: 'Machinery', equipment: 'Flatbed', broker: 'Landstar', age: '6h', backhaul: 'weak' },
  { id: 'L9', origin: 'Nashville, TN', dest: 'Columbus, OH', miles: 380, dh: 5, rate: 1216, rpm: 3.20, weight: 35000, commodity: 'Retail Goods', equipment: 'Dry Van', broker: 'JB Hunt', age: '1h', backhaul: 'strong' },
  { id: 'L10', origin: 'Huntsville, AL', dest: 'Miami, FL', miles: 720, dh: 115, rate: 1584, rpm: 2.20, weight: 41000, commodity: 'Furniture', equipment: 'Dry Van', broker: 'GlobalTranz', age: '5h', backhaul: 'weak' },
  { id: 'L11', origin: 'Nashville, TN', dest: 'St. Louis, MO', miles: 310, dh: 5, rate: 1023, rpm: 3.30, weight: 30000, commodity: 'Beverages', equipment: 'Dry Van', broker: 'Schneider', age: '2h', backhaul: 'moderate' },
  { id: 'L12', origin: 'Louisville, KY', dest: 'Detroit, MI', miles: 350, dh: 175, rate: 875, rpm: 2.50, weight: 38000, commodity: 'Plastics', equipment: 'Dry Van', broker: 'Werner', age: '3h', backhaul: 'moderate' },
];

const BEST_IDS = ['L3', 'L7', 'L9']; // Best picks: low DH, good RPM, strong backhaul

export function LoadBoardSimulator() {
  const { lang } = useLang();
  const [sortField, setSortField] = useState<'rpm' | 'rate' | 'dh' | 'miles'>('rpm');
  const [sortAsc, setSortAsc] = useState(false);
  const [maxDH, setMaxDH] = useState(250);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const sorted = useMemo(() => {
    return [...LOADS]
      .filter(l => l.dh <= maxDH && l.equipment === 'Dry Van')
      .sort((a, b) => sortAsc ? (a[sortField] - b[sortField]) : (b[sortField] - a[sortField]));
  }, [sortField, sortAsc, maxDH]);

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  }

  function toggleSelect(id: string) {
    if (submitted) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });
  }

  const selectedLoads = LOADS.filter(l => selected.has(l.id));
  const totalRevenue = selectedLoads.reduce((s, l) => s + l.rate, 0);
  const totalMiles = selectedLoads.reduce((s, l) => s + l.miles, 0);
  const avgRpm = totalMiles > 0 ? (totalRevenue / totalMiles).toFixed(2) : '0.00';

  const score = submitted ? (() => {
    let s = 0;
    selected.forEach(id => { if (BEST_IDS.includes(id)) s += 33; });
    return Math.min(100, s + (selected.size === 3 ? 1 : 0));
  })() : 0;

  return (
    <div className="mt-6 space-y-3">
      <div className="card p-3 bg-gradient-to-r from-brand-50 to-white">
        <p className="text-sm font-bold text-gray-900 dark:text-[#f5f5f7]">🚛 {lang === 'ru' ? 'Ваш грузовик' : 'Your Truck'}: {TRUCK.equipment}</p>
        <p className="text-xs text-gray-500 dark:text-[#a1a1a6]">📍 {TRUCK.city}</p>
        <p className="text-xs text-gray-400 dark:text-[#636366] mt-1">{lang === 'ru' ? 'Выберите 3 лучших груза' : 'Pick the 3 best loads'}</p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 text-xs">
        <Filter className="w-4 h-4 text-gray-400 dark:text-[#636366]" />
        <span className="text-gray-500 dark:text-[#a1a1a6]">Max DH:</span>
        <input type="range" min={25} max={250} step={25} value={maxDH}
          onChange={e => setMaxDH(Number(e.target.value))} className="flex-1 accent-brand-500" />
        <span className="font-mono text-gray-700 dark:text-[#a1a1a6] w-12">{maxDH} mi</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.08)]">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#1c1c1e] text-gray-500 dark:text-[#a1a1a6] font-medium">
              <th className="p-2 text-left">⭐</th>
              <th className="p-2 text-left">Origin → Dest</th>
              <th className="p-2 text-right cursor-pointer" onClick={() => toggleSort('miles')}>
                Miles <ArrowUpDown className="w-3 h-3 inline" />
              </th>
              <th className="p-2 text-right cursor-pointer" onClick={() => toggleSort('rate')}>
                Rate <ArrowUpDown className="w-3 h-3 inline" />
              </th>
              <th className="p-2 text-right cursor-pointer" onClick={() => toggleSort('rpm')}>
                RPM <ArrowUpDown className="w-3 h-3 inline" />
              </th>
              <th className="p-2 text-right cursor-pointer" onClick={() => toggleSort('dh')}>
                DH <ArrowUpDown className="w-3 h-3 inline" />
              </th>
              <th className="p-2 text-center">BH</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(l => (
              <tr key={l.id} className={cn(
                'border-t border-gray-50 transition-colors',
                selected.has(l.id) && 'bg-brand-50',
                submitted && BEST_IDS.includes(l.id) && 'bg-green-50',
              )}>
                <td className="p-2">
                  <button onClick={() => toggleSelect(l.id)}>
                    <Star className={cn('w-4 h-4', selected.has(l.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-[#636366]')} />
                  </button>
                </td>
                <td className="p-2">
                  <p className="font-medium text-gray-900 dark:text-[#f5f5f7]">{l.origin}</p>
                  <p className="text-gray-500 dark:text-[#a1a1a6]">→ {l.dest}</p>
                </td>
                <td className="p-2 text-right font-mono">{l.miles}</td>
                <td className="p-2 text-right font-mono">${l.rate.toLocaleString()}</td>
                <td className={cn('p-2 text-right font-mono font-bold',
                  l.rpm >= 3.0 ? 'text-green-600' : l.rpm >= 2.5 ? 'text-yellow-600' : 'text-red-600'
                )}>${l.rpm.toFixed(2)}</td>
                <td className={cn('p-2 text-right font-mono',
                  l.dh <= 20 ? 'text-green-600' : l.dh <= 100 ? 'text-yellow-600' : 'text-red-600'
                )}>{l.dh}</td>
                <td className="p-2 text-center">
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                    l.backhaul === 'strong' ? 'bg-green-100 text-green-700' :
                    l.backhaul === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  )}>{l.backhaul === 'strong' ? '🟢' : l.backhaul === 'moderate' ? '🟡' : '🔴'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom bar */}
      <div className="card p-3 flex items-center justify-between">
        <div className="flex gap-4 text-xs">
          <span><strong>{selected.size}</strong>/3 {lang === 'ru' ? 'выбрано' : 'selected'}</span>
          <span>${totalRevenue.toLocaleString()}</span>
          <span>{avgRpm} RPM</span>
        </div>
        {!submitted ? (
          <button
            onClick={() => selected.size === 3 && setSubmitted(true)}
            disabled={selected.size !== 3}
            className="btn-primary w-auto px-4 py-2 text-xs disabled:opacity-40"
          >
            {lang === 'ru' ? 'Подтвердить' : 'Submit Picks'}
          </button>
        ) : (
          <div className="text-center">
            <p className="text-2xl font-bold">{score}/100</p>
            <p className="text-xs text-gray-500 dark:text-[#a1a1a6]">
              {score >= 80 ? '🌟 ' + (lang === 'ru' ? 'Отличный выбор!' : 'Great picks!') :
               score >= 50 ? '👍 ' + (lang === 'ru' ? 'Неплохо' : 'Not bad') :
               '📚 ' + (lang === 'ru' ? 'Обрати внимание на DH и backhaul' : 'Watch deadhead & backhaul')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
