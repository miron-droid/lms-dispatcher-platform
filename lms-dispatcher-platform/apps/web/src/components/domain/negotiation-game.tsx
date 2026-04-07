'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n/lang-context';

interface BrokerRound {
  name: string; personality: string; load: string; miles: number;
  opening: number; floor: number; ceiling: number; market: number; costPerMile: number;
}

const ROUNDS: BrokerRound[] = [
  { name: 'Budget Brian', personality: '💰 Tough', load: 'Dallas → Chicago, Dry Van', miles: 920, opening: 1840, floor: 2024, ceiling: 2300, market: 2208, costPerMile: 1.65 },
  { name: 'Fair Fiona', personality: '🤝 Reasonable', load: 'Atlanta → Miami, Reefer', miles: 660, opening: 2310, floor: 2508, ceiling: 2970, market: 2640, costPerMile: 1.85 },
  { name: 'Premium Pete', personality: '⭐ Generous', load: 'LA → Phoenix, Dry Van', miles: 370, opening: 1110, floor: 1184, ceiling: 1480, market: 1295, costPerMile: 1.65 },
];

export function NegotiationGame() {
  const { lang } = useLang();
  const [roundIdx, setRoundIdx] = useState(0);
  const [sliderVal, setSliderVal] = useState(2200);
  const [phase, setPhase] = useState<'offer' | 'thinking' | 'response' | 'result' | 'summary'>('offer');
  const [brokerOffer, setBrokerOffer] = useState(ROUNDS[0].opening);
  const [attempts, setAttempts] = useState(0);
  const [results, setResults] = useState<{ rate: number; margin: number; grade: string }[]>([]);
  const [dealRate, setDealRate] = useState(0);

  const r = ROUNDS[roundIdx];
  const carrierCost = Math.round(r.costPerMile * r.miles);
  const margin = sliderVal - carrierCost;
  const marginPct = Math.round((margin / sliderVal) * 100);

  function submitCounter() {
    setPhase('thinking');
    setTimeout(() => {
      if (sliderVal > r.ceiling * 1.2) {
        // Walk away
        setDealRate(0);
        setPhase('result');
        return;
      }
      if (sliderVal <= brokerOffer * 1.05) {
        // Deal!
        setDealRate(sliderVal);
        setPhase('result');
        return;
      }
      // Counter
      const mid = Math.round((sliderVal + brokerOffer) / 2);
      const newOffer = Math.min(r.ceiling, Math.max(r.floor, mid));
      setBrokerOffer(newOffer);
      setAttempts(a => a + 1);
      if (attempts >= 2) {
        setDealRate(newOffer);
        setPhase('result');
      } else {
        setSliderVal(newOffer + 50);
        setPhase('offer');
      }
    }, 1500);
  }

  function acceptBrokerOffer() {
    setDealRate(brokerOffer);
    setPhase('result');
  }

  function nextRound() {
    const finalMargin = dealRate > 0 ? Math.round(((dealRate - carrierCost) / dealRate) * 100) : 0;
    const grade = dealRate === 0 ? 'F' : finalMargin >= 25 ? 'A' : finalMargin >= 20 ? 'B' : finalMargin >= 15 ? 'C' : 'D';
    const newResults = [...results, { rate: dealRate, margin: finalMargin, grade }];
    setResults(newResults);

    if (roundIdx + 1 >= ROUNDS.length) {
      setPhase('summary');
    } else {
      const next = ROUNDS[roundIdx + 1];
      setRoundIdx(roundIdx + 1);
      setBrokerOffer(next.opening);
      setSliderVal(Math.round(next.market * 0.95));
      setAttempts(0);
      setDealRate(0);
      setPhase('offer');
    }
  }

  if (phase === 'summary') {
    const avgGrade: number[] = results.map(r => r.grade === 'A' ? 4 : r.grade === 'B' ? 3 : r.grade === 'C' ? 2 : r.grade === 'D' ? 1 : 0);
    const avg = avgGrade.reduce((s: number, v: number) => s + v, 0) / avgGrade.length;
    return (
      <div className="mt-6 card p-6 space-y-4">
        <h3 className="text-lg font-bold text-center">{lang === 'ru' ? 'Результаты торгов' : 'Negotiation Results'}</h3>
        {ROUNDS.map((rd, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1c1c1e] rounded-xl">
            <span className={cn('text-2xl font-bold', results[i]?.grade === 'A' ? 'text-green-600' : results[i]?.grade === 'B' ? 'text-blue-600' : results[i]?.grade === 'F' ? 'text-red-600' : 'text-yellow-600')}>
              {results[i]?.grade}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{rd.name} — {rd.load}</p>
              <p className="text-xs text-gray-500 dark:text-[#a1a1a6]">
                {results[i]?.rate > 0 ? `$${results[i].rate.toLocaleString()} · ${results[i].margin}% margin` : 'Deal lost'}
              </p>
            </div>
          </div>
        ))}
        <p className="text-center text-sm text-gray-500 dark:text-[#a1a1a6]">
          {avg >= 3.5 ? '🌟 Master negotiator!' : avg >= 2.5 ? '👍 Solid performance' : '📚 Keep practicing'}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400 dark:text-[#636366] uppercase">{lang === 'ru' ? 'Торги' : 'Negotiation'}</p>
        <p className="text-xs text-gray-400 dark:text-[#636366]">{roundIdx + 1}/{ROUNDS.length}</p>
      </div>

      {/* Load info */}
      <div className="card p-3 bg-gray-900 text-white border-0">
        <p className="text-xs text-gray-400 dark:text-[#636366]">{r.personality} · {r.name}</p>
        <p className="font-semibold">{r.load}</p>
        <p className="text-xs text-gray-400 dark:text-[#636366]">{r.miles} mi · Market: ${r.market.toLocaleString()}</p>
      </div>

      {/* Broker offer */}
      <div className="bg-gray-100 dark:bg-[#2c2c2e] rounded-xl p-3">
        <p className="text-xs text-gray-500 dark:text-[#a1a1a6] mb-1">{lang === 'ru' ? 'Предложение брокера' : 'Broker offers'}:</p>
        <p className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7]">${brokerOffer.toLocaleString()}</p>
        <p className="text-xs text-gray-400 dark:text-[#636366]">${(brokerOffer / r.miles).toFixed(2)}/mi</p>
      </div>

      {phase === 'offer' && (
        <>
          {/* Slider */}
          <div>
            <p className="text-xs text-gray-500 dark:text-[#a1a1a6] mb-2">{lang === 'ru' ? 'Ваше предложение' : 'Your counter-offer'}:</p>
            <input type="range" min={Math.round(r.opening * 0.8)} max={Math.round(r.ceiling * 1.3)} step={25}
              value={sliderVal} onChange={e => setSliderVal(Number(e.target.value))}
              className="w-full accent-brand-500" />
            <p className="text-2xl font-bold text-center mt-1">${sliderVal.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-[#636366] text-center">${(sliderVal / r.miles).toFixed(2)}/mi</p>
          </div>

          {/* P&L */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="card p-2">
              <p className="text-xs text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'Расходы' : 'Cost'}</p>
              <p className="font-bold text-sm">${carrierCost.toLocaleString()}</p>
            </div>
            <div className="card p-2">
              <p className="text-xs text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'Маржа' : 'Margin'}</p>
              <p className={cn('font-bold text-sm', margin < 0 ? 'text-red-600' : marginPct >= 25 ? 'text-green-600' : marginPct >= 15 ? 'text-yellow-600' : 'text-red-600')}>
                ${margin.toLocaleString()}
              </p>
            </div>
            <div className="card p-2">
              <p className="text-xs text-gray-400 dark:text-[#636366]">%</p>
              <p className={cn('font-bold text-sm', marginPct >= 25 ? 'text-green-600' : marginPct >= 15 ? 'text-yellow-600' : 'text-red-600')}>
                {marginPct}%
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={submitCounter} className="btn-primary flex-1">
              {lang === 'ru' ? 'Предложить' : 'Counter'} ({attempts + 1}/3)
            </button>
            <button onClick={acceptBrokerOffer} className="btn-ghost border border-gray-200 dark:border-[rgba(255,255,255,0.08)] flex-1">
              {lang === 'ru' ? 'Принять' : 'Accept'} ${brokerOffer.toLocaleString()}
            </button>
          </div>
        </>
      )}

      {phase === 'thinking' && (
        <div className="text-center py-6">
          <div className="flex justify-center gap-1 mb-2">
            {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
          </div>
          <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">{r.name} {lang === 'ru' ? 'думает...' : 'is thinking...'}</p>
        </div>
      )}

      {phase === 'result' && (
        <div className="card p-4 text-center space-y-2">
          {dealRate > 0 ? (
            <>
              <p className="text-green-600 font-bold text-lg">🤝 {lang === 'ru' ? 'Сделка!' : 'Deal!'}</p>
              <p className="text-2xl font-bold">${dealRate.toLocaleString()}</p>
              <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">${(dealRate / r.miles).toFixed(2)}/mi · {Math.round(((dealRate - carrierCost) / dealRate) * 100)}% margin</p>
            </>
          ) : (
            <p className="text-red-500 font-bold text-lg">❌ {lang === 'ru' ? 'Брокер ушёл' : 'Broker walked away'}</p>
          )}
          <button onClick={nextRound} className="btn-primary mt-2">
            {roundIdx + 1 >= ROUNDS.length ? (lang === 'ru' ? 'Результаты' : 'See Results') : (lang === 'ru' ? 'Следующий →' : 'Next Round →')}
          </button>
        </div>
      )}
    </div>
  );
}
