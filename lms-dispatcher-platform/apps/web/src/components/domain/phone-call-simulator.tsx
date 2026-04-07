'use client';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Phone, PhoneOff } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';

interface Round {
  broker: string;
  options: { id: string; text: string; score: number; reaction: string }[];
  tip?: string;
}

const ROUNDS: Round[] = [
  {
    broker: "Hey, I've got a dry van from Chicago to Dallas, 920 miles. Rate is $1,840. Interested?",
    options: [
      { id: 'a', text: "That's way below market. I need $2,400.", score: -5, reaction: "Whoa, that's aggressive. I've got other carriers lined up." },
      { id: 'b', text: "The load board shows $2.35/mile average on this lane. I'd need at least $2,150 to make it work.", score: 10, reaction: "Fair point. I can stretch to $1,950. That's about all budget allows." },
      { id: 'c', text: "Sure, I'll take it.", score: -10, reaction: "Great! ...That was easy. (You left $300+ on the table)" },
    ],
    tip: 'Always counter with market data, not emotions.',
  },
  {
    broker: "Alright, I hear you on the market rate. Best I can do is $1,950.",
    options: [
      { id: 'a', text: "My driver has a perfect on-time record and is available right now. $2,100 and I confirm immediately.", score: 10, reaction: "Hmm, the reliability factor... Let me see. $2,050?" },
      { id: 'b', text: "No way. $2,300 or I walk.", score: -5, reaction: "That's too high for this lane. Maybe next time." },
      { id: 'c', text: "Okay, $1,950 works.", score: -5, reaction: "Deal. (But you could have gotten more)" },
    ],
    tip: 'Emphasize your driver\'s reliability — brokers pay more for certainty.',
  },
  {
    broker: "Okay, $2,050. But I need the truck there by 6 AM sharp.",
    options: [
      { id: 'a', text: "My driver can do 6 AM. $2,100 and we have a deal.", score: 10, reaction: "You drive a hard bargain. Fine, $2,100. Deal." },
      { id: 'b', text: "6 AM is tight. I'd need $2,150 for the early pickup.", score: 5, reaction: "Can't go that high. $2,100 is my absolute max." },
      { id: 'c', text: "Fine, $2,050.", score: 0, reaction: "Great, sending rate con now." },
    ],
    tip: 'Know when to close. A small concession to lock the deal is often worth it.',
  },
  {
    broker: "Deal at $2,100. Sending rate con now. What's your MC number?",
    options: [
      { id: 'a', text: "MC-123456. Quick question — does the rate con include detention after 2 hours?", score: 10, reaction: "Standard 2-hour free time, then $75/hour. I'll add it." },
      { id: 'b', text: "MC-123456. Send it over.", score: 5, reaction: "On its way." },
      { id: 'c', text: "MC-123456.", score: 0, reaction: "Got it. Rate con incoming." },
    ],
    tip: 'Always confirm detention terms before signing. Protect your driver.',
  },
  {
    broker: "Rate con sent. Anything else you need?",
    options: [
      { id: 'a', text: "Got it. I'll have my driver check in at pickup. Thanks Mike, good working with you.", score: 10, reaction: "Likewise! Let me know if you need loads next week too." },
      { id: 'b', text: "Can you also confirm lumper coverage?", score: 5, reaction: "No lumper on this one, it's no-touch freight. You're good." },
      { id: 'c', text: "Nope.", score: -5, reaction: "Okay... Talk later. (Build the relationship!)" },
    ],
    tip: 'End calls professionally. Good rapport = better rates next time.',
  },
];

export function PhoneCallSimulator() {
  const { lang } = useLang();
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'choose' | 'reaction' | 'tip' | 'done'>('typing');
  const [displayedText, setDisplayedText] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [callTime, setCallTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const current = round < ROUNDS.length ? ROUNDS[round] : null;

  // Call timer
  useEffect(() => {
    timerRef.current = setInterval(() => setCallTime(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (phase !== 'typing' || !current) return;
    setDisplayedText('');
    let i = 0;
    const text = current.broker;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); setTimeout(() => setPhase('choose'), 300); }
    }, 25);
    return () => clearInterval(interval);
  }, [phase, round, current]);

  function choose(optId: string) {
    const opt = current?.options.find(o => o.id === optId);
    if (!opt) return;
    setSelectedId(optId);
    setTotalScore(s => s + opt.score);
    setPhase('reaction');
    setTimeout(() => {
      if (current?.tip) { setPhase('tip'); }
      else { nextRound(); }
    }, 2000);
  }

  function nextRound() {
    if (round + 1 >= ROUNDS.length) { setPhase('done'); if (timerRef.current) clearInterval(timerRef.current); }
    else { setRound(r => r + 1); setPhase('typing'); setSelectedId(null); }
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const maxScore = ROUNDS.length * 10;
  const pct = Math.max(0, Math.round((totalScore / maxScore) * 100));
  const selectedOpt = current?.options.find(o => o.id === selectedId);

  if (phase === 'done') {
    return (
      <div className="mt-6 card p-6 text-center space-y-3 bg-gray-900 text-white border-0">
        <PhoneOff className="w-8 h-8 mx-auto text-red-400" />
        <p className="text-sm text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'Звонок завершён' : 'Call ended'} · {formatTime(callTime)}</p>
        <p className="text-3xl font-bold">{pct}%</p>
        <p className="text-sm">{pct >= 80 ? '🌟 Pro negotiator!' : pct >= 50 ? '👍 Solid call' : '📚 Practice more'}</p>
        <p className="text-xs text-gray-500 dark:text-[#a1a1a6]">{lang === 'ru' ? 'Итоговая ставка' : 'Final rate'}: $2,100 | RPM: $2.28</p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl overflow-hidden bg-gray-900 text-white">
      {/* Call header */}
      <div className="px-4 pt-5 pb-3 text-center">
        <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-xl font-bold mx-auto mb-2">MT</div>
        <p className="font-semibold">Mike from TQL</p>
        <p className="text-xs text-green-400 flex items-center justify-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Connected · {formatTime(callTime)}
        </p>
        <p className="text-xs text-gray-500 dark:text-[#a1a1a6] mt-1">Chicago → Dallas · 920 mi · Dry Van</p>
      </div>

      {/* Waveform */}
      <div className="flex items-end justify-center gap-1 h-8 mb-4">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={cn(
            'w-1 bg-green-500 rounded-full transition-all',
            phase === 'typing' ? 'animate-pulse' : 'h-1'
          )} style={{ height: phase === 'typing' ? `${12 + Math.random() * 20}px` : 4, animationDelay: `${i * 100}ms` }} />
        ))}
      </div>

      {/* Broker message */}
      <div className="px-4 pb-3">
        <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 text-sm">
          {displayedText}
          {phase === 'typing' && <span className="animate-pulse">|</span>}
        </div>
      </div>

      {/* Reaction */}
      {phase === 'reaction' && selectedOpt && (
        <div className="px-4 pb-3 space-y-2">
          <div className="bg-green-800/30 rounded-2xl rounded-br-sm px-4 py-2 text-sm text-right ml-8">
            {selectedOpt.text}
          </div>
          <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-2 text-sm">
            {selectedOpt.reaction}
          </div>
          <div className={cn('text-xs text-center py-1', selectedOpt.score > 0 ? 'text-green-400' : selectedOpt.score < 0 ? 'text-red-400' : 'text-gray-500 dark:text-[#a1a1a6]')}>
            {selectedOpt.score > 0 ? `+${selectedOpt.score}` : selectedOpt.score} pts
          </div>
        </div>
      )}

      {/* Tip */}
      {phase === 'tip' && current?.tip && (
        <div className="px-4 pb-3">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-2 text-xs text-yellow-300">
            💡 {current.tip}
          </div>
          <button onClick={nextRound} className="w-full mt-2 py-2 text-xs text-gray-400 dark:text-[#636366] hover:text-white">
            {lang === 'ru' ? 'Далее →' : 'Continue →'}
          </button>
        </div>
      )}

      {/* Options */}
      {phase === 'choose' && current && (
        <div className="px-4 pb-4 space-y-2">
          {current.options.map(opt => (
            <button key={opt.id} onClick={() => choose(opt.id)}
              className="w-full text-left text-sm px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700">
              {opt.text}
            </button>
          ))}
        </div>
      )}

      {/* Round indicator */}
      <div className="px-4 pb-3 flex justify-center gap-1">
        {ROUNDS.map((_, i) => (
          <div key={i} className={cn('w-2 h-2 rounded-full', i <= round ? 'bg-green-500' : 'bg-gray-700')} />
        ))}
      </div>
    </div>
  );
}
