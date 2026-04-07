'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Phone, PhoneOff } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface CallOption {
  id: string;
  text: string;
  quality: 'best' | 'good' | 'ok' | 'poor';
  explanation: string;
}

interface CallStep {
  id: number;
  from: 'broker' | 'dispatcher' | 'system';
  text: string;
  delayMs: number;
  options?: CallOption[];
}

/* ── Scenario data ─────────────────────────────────────────────────────────── */

const LOAD_INFO = {
  origin: 'Dallas, TX',
  destination: 'Chicago, IL',
  miles: 925,
  weight: '42,000 lbs',
  type: 'Dry Van',
  posted: 1850,
  marketRate: 2.50,
};

const CALL_STEPS: CallStep[] = [
  {
    id: 1, from: 'system', text: 'Calling Swift Logistics...', delayMs: 1500,
  },
  {
    id: 2, from: 'system', text: 'Connected  0:00', delayMs: 800,
  },
  {
    id: 3, from: 'broker', delayMs: 2000,
    text: "Hi, this is Mark from Swift Logistics. You're calling about the Dallas to Chicago load?",
  },
  {
    id: 4, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      {
        id: 'a',
        text: "Hi Mark, this is dispatch from Apex Transport, MC-482910. We have a driver 20 miles out in Fort Worth, ready to pick up today. I'd like to run this at $2,800 — 925 miles through I-35 and I-55, it's a solid lane for us.",
        quality: 'best',
        explanation: 'Professional intro with MC#, driver proximity, and a confident opening counter above market — leaves room to negotiate down.',
      },
      {
        id: 'b',
        text: "Hey Mark. I saw your Dallas–Chicago load. We can do it for $2,500. We have a truck nearby.",
        quality: 'good',
        explanation: 'Reasonable counter at market rate, but no MC# and less detail weakens the position.',
      },
      {
        id: 'c',
        text: "$1,850 works for us. We'll take it.",
        quality: 'poor',
        explanation: 'Accepting the posted rate without negotiation leaves ~$600 on the table. Posted rates are almost always negotiable.',
      },
      {
        id: 'd',
        text: "Yeah, what's the best rate you can do on this one?",
        quality: 'ok',
        explanation: 'Asking the broker to bid against himself can work, but you give up control of the negotiation by not anchoring first.',
      },
    ],
  },
  {
    id: 5, from: 'broker', delayMs: 2200,
    text: "I appreciate the interest. That rate's a bit high for this lane right now. Best I can do is $2,100.",
  },
  {
    id: 6, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      {
        id: 'a',
        text: "Mark, I hear you, but fuel's at $3.90 a gallon and this is 925 miles. With tolls through Illinois and deadhead to get my driver positioned after Chicago, I need to be at $2,400 to make this work for my carrier.",
        quality: 'best',
        explanation: 'Counter with specific justification (fuel cost, tolls, deadhead) — shows you know the numbers and gives the broker reasons to go higher.',
      },
      {
        id: 'b',
        text: "$2,100 sounds fair. Let's do it.",
        quality: 'ok',
        explanation: '$2,100 is $2.27/mile — below market. Accepting the first counter-offer too quickly signals you would have taken less.',
      },
      {
        id: 'c',
        text: "That's way too low. I've got other loads to look at — call me when you're serious.",
        quality: 'poor',
        explanation: 'Threatening to walk away this early is aggressive and unprofessional. You haven\'t even tried to negotiate yet.',
      },
      {
        id: 'd',
        text: "How about we meet at $2,300? That keeps both of us in the game.",
        quality: 'good',
        explanation: 'Solid counter with a collaborative tone. Could be stronger with cost justification.',
      },
    ],
  },
  {
    id: 7, from: 'broker', delayMs: 2000,
    text: "Alright, I talked to my manager. I can go to $2,300 but that is my absolute ceiling. Take it or leave it.",
  },
  {
    id: 8, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      {
        id: 'a',
        text: "$2,300 works. Before I confirm — what's your detention policy after free time, and do you cover layover if the shipper pushes the appointment?",
        quality: 'best',
        explanation: 'Accepting a fair rate AND immediately protecting your driver with detention/layover questions. This is what experienced dispatchers do.',
      },
      {
        id: 'b',
        text: "$2,300, deal. Let's book it.",
        quality: 'good',
        explanation: 'Good rate accepted, but you missed the chance to negotiate accessorial protections (detention, layover) that can add $200+ to a load.',
      },
      {
        id: 'c',
        text: "I really need $2,500. Can you check with your manager one more time?",
        quality: 'ok',
        explanation: 'Pushing past the broker\'s stated ceiling risks losing the load entirely. The $2,300 rate ($2.49/mile) is already at market.',
      },
      {
        id: 'd',
        text: "Let me think about it and call you back in an hour.",
        quality: 'poor',
        explanation: 'Good loads at good rates get booked fast. Hesitating means another carrier books it in 10 minutes.',
      },
    ],
  },
  {
    id: 9, from: 'broker', delayMs: 2000,
    text: "Alright, $2,300 it is. I'll send the rate confirmation right over. What's your MC number and carrier email?",
  },
  {
    id: 10, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      {
        id: 'a',
        text: "MC-482910, email is dispatch@apextransport.com. Can you also send the shipper's contact info and the pickup number? I want my driver to have everything before he rolls.",
        quality: 'best',
        explanation: 'Providing info promptly AND proactively requesting shipper contact + pickup number prevents problems at the dock.',
      },
      {
        id: 'b',
        text: "MC-482910, dispatch@apextransport.com. We'll watch for the rate con.",
        quality: 'good',
        explanation: 'Clean and professional, but not asking for shipper contact means your driver may struggle if there\'s a dock issue.',
      },
      {
        id: 'c',
        text: "Can you email the rate con first? I want to review it before I give you our MC.",
        quality: 'ok',
        explanation: 'Reviewing rate cons is smart, but withholding your MC (which is public info) slows the process and seems inexperienced.',
      },
      {
        id: 'd',
        text: "Uh, hold on... I think our MC is... 4-8-something. Let me find it. And what email do you need again?",
        quality: 'poor',
        explanation: 'Not having your own MC# and email ready is unprofessional. Brokers lose confidence and may move to another carrier.',
      },
    ],
  },
  {
    id: 11, from: 'broker', delayMs: 2200,
    text: "Perfect. Pickup is tomorrow 6:00 AM at 1200 Industrial Blvd, Dallas. Delivery by end of day Thursday in Chicago. It's a live load, about 2 hours.",
  },
  {
    id: 12, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      {
        id: 'a',
        text: "Got it — 6 AM at 1200 Industrial Blvd. Can you confirm it's a full 42,000 lbs dry van, no pallets exchange? And is Thursday delivery a hard appointment or FCFS? I want to make sure my driver's ELD hours line up.",
        quality: 'best',
        explanation: 'Verifying weight, equipment, pallet exchange, and appointment type prevents surprises. Mentioning ELD shows professionalism.',
      },
      {
        id: 'b',
        text: "Copy that. Any lumper fees at delivery, or is the receiver no-touch freight?",
        quality: 'good',
        explanation: 'Good question about lumper fees — they can eat $200-$400 out of your profit if you\'re not prepared.',
      },
      {
        id: 'c',
        text: "Ok, got it.",
        quality: 'ok',
        explanation: 'Not asking follow-up questions about a load means you\'ll discover problems on the road when it\'s too late.',
      },
      {
        id: 'd',
        text: "(Doesn't write anything down or repeat the details back)",
        quality: 'poor',
        explanation: 'Not confirming pickup details is how drivers show up at wrong addresses or wrong times. Always read back the details.',
      },
    ],
  },
  {
    id: 13, from: 'broker', delayMs: 2000,
    text: "It's a full 42K, no pallet exchange, Thursday delivery is FCFS before 5 PM. Anything else you need from me?",
  },
  {
    id: 14, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      {
        id: 'a',
        text: "One last thing — what's your direct number for updates? And confirm your detention policy: how much free time and what's the hourly rate after that?",
        quality: 'best',
        explanation: 'Getting the broker\'s direct line (not the main office number) and confirming detention policy IN ADVANCE saves hours of headache later.',
      },
      {
        id: 'b',
        text: "Just want to confirm — what's your detention policy in case the shipper or receiver runs late?",
        quality: 'good',
        explanation: 'Smart to ask about detention, but also get the broker\'s direct number. The main office line can mean 30+ min hold times.',
      },
      {
        id: 'c',
        text: "Nope, we're all good. Talk to you later, Mark.",
        quality: 'ok',
        explanation: 'Ending without confirming detention policy or getting a direct number leaves you exposed if something goes wrong.',
      },
      {
        id: 'd',
        text: "(Hangs up without saying goodbye or confirming any final details)",
        quality: 'poor',
        explanation: 'Ending a call abruptly is unprofessional and you haven\'t secured any protections for your driver or your carrier.',
      },
    ],
  },
  {
    id: 15, from: 'broker', delayMs: 1800,
    text: "My direct cell is 214-555-0173. Detention is 2 hours free time, then $75 per hour after that. Rate con will be in your inbox in 5 minutes. Good doing business with you!",
  },
  {
    id: 16, from: 'system', text: 'Call ended  4:32', delayMs: 1200,
  },
];

/* ── Audio wave animation component ────────────────────────────────────────── */

function AudioWave({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-6">
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={cn(
            'w-[3px] rounded-full transition-all duration-300',
            active ? 'bg-blue-400' : 'bg-gray-300',
          )}
          style={{
            height: active ? `${12 + Math.sin(i * 1.2) * 8}px` : '4px',
            animation: active ? `audioWave 0.8s ease-in-out ${i * 0.1}s infinite alternate` : 'none',
          }}
        />
      ))}
    </div>
  );
}

/* ── Quality badge helper ──────────────────────────────────────────────────── */

const QUALITY_META = {
  best: { icon: '✅', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Best' },
  good: { icon: '👍', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Good' },
  ok:   { icon: '⚠️', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'OK' },
  poor: { icon: '❌', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Poor' },
};

/* ── Main component ────────────────────────────────────────────────────────── */

export function BrokerCallSimulator() {
  const { lang } = useLang();
  const [visibleCount, setVisibleCount] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [finished, setFinished] = useState(false);
  const [negotiatedRate, setNegotiatedRate] = useState(LOAD_INFO.posted);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleMessages = CALL_STEPS.slice(0, visibleCount);
  const currentMsg = visibleCount < CALL_STEPS.length ? CALL_STEPS[visibleCount] : null;
  const waitingForResponse = currentMsg?.options && !responses[currentMsg.id];
  const brokerSpeaking = !waitingForResponse && visibleCount < CALL_STEPS.length && currentMsg?.from === 'broker';

  /* Track the negotiated rate based on choices */
  useEffect(() => {
    // Step 4 (id=4): opening counter
    const step4 = responses[4];
    const step6 = responses[6];
    const step8 = responses[8];

    if (step4 === 'c') {
      // Accepted $1,850 immediately
      setNegotiatedRate(1850);
    } else if (step6 === 'b') {
      // Accepted $2,100
      setNegotiatedRate(2100);
    } else if (step8) {
      // All other paths converge at $2,300
      setNegotiatedRate(2300);
    }
  }, [responses]);

  /* Auto-advance non-interactive steps */
  useEffect(() => {
    if (visibleCount >= CALL_STEPS.length) {
      setTimeout(() => setFinished(true), 1500);
      return;
    }
    const msg = CALL_STEPS[visibleCount];
    if (msg.options && !responses[msg.id]) return;
    const timer = setTimeout(() => setVisibleCount(v => v + 1), msg.delayMs);
    return () => clearTimeout(timer);
  }, [visibleCount, responses]);

  /* Auto-scroll */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleCount, responses]);

  function handleResponse(msgId: number, optionId: string, quality: string) {
    const option = CALL_STEPS.find(m => m.id === msgId)?.options?.find(o => o.id === optionId);
    if (!option) return;
    setResponses(r => ({ ...r, [msgId]: optionId }));
    setTotalQuestions(t => t + 1);
    if (quality === 'best') setScore(s => s + 10);
    else if (quality === 'good') setScore(s => s + 7);
    else if (quality === 'ok') setScore(s => s + 4);
    // poor = 0 points
    setTimeout(() => setVisibleCount(v => v + 1), 400);
  }

  function reset() {
    setVisibleCount(0);
    setResponses({});
    setScore(0);
    setTotalQuestions(0);
    setFinished(false);
    setNegotiatedRate(LOAD_INFO.posted);
  }

  /* ── Result screen ──────────────────────────────────────────────────────── */
  if (finished) {
    const maxScore = totalQuestions * 10;
    const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const rpm = (negotiatedRate / LOAD_INFO.miles).toFixed(2);

    return (
      <div className="mt-6 rounded-2xl bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[rgba(255,255,255,0.08)] p-6 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
          <Phone className="w-7 h-7 text-blue-600" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-[#f5f5f7]">{pct}%</p>
        <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">
          {lang === 'ru' ? 'Навыки переговоров с брокером' : 'Broker Negotiation Score'}
        </p>
        <p className="text-xs text-gray-400 dark:text-[#636366]">{score}/{maxScore} {lang === 'ru' ? 'баллов' : 'points'}</p>

        {/* RPM Breakdown */}
        <div className="bg-gray-50 dark:bg-[#1c1c1e] rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-[#a1a1a6]">
            {lang === 'ru' ? 'Результат переговоров' : 'Negotiation Result'}
          </p>
          <div className="flex items-center justify-center gap-2 text-lg font-bold text-blue-700">
            <span>${negotiatedRate.toLocaleString()}</span>
            <span className="text-gray-400 dark:text-[#636366] font-normal text-sm">for</span>
            <span>{LOAD_INFO.miles} mi</span>
          </div>
          <p className={cn(
            'text-xl font-bold',
            parseFloat(rpm) >= 2.40 ? 'text-green-600' :
            parseFloat(rpm) >= 2.20 ? 'text-blue-600' :
            parseFloat(rpm) >= 2.00 ? 'text-yellow-600' :
            'text-red-600'
          )}>
            ${rpm}/mile RPM
          </p>
          <p className="text-xs text-gray-400 dark:text-[#636366]">
            {lang === 'ru' ? 'Рыночная ставка' : 'Market rate'}: ~$2.50/mi &middot;{' '}
            {lang === 'ru' ? 'Опубликовано' : 'Posted'}: ${(LOAD_INFO.posted / LOAD_INFO.miles).toFixed(2)}/mi
          </p>
        </div>

        <p className="text-sm text-gray-600 dark:text-[#a1a1a6]">
          {pct >= 90 ? (lang === 'ru'
            ? '🌟 Отлично! Профессиональные навыки переговоров'
            : '🌟 Excellent! You negotiated like a pro — strong rate with full load protections.')
          : pct >= 70 ? (lang === 'ru'
            ? '👍 Хорошо, но есть что улучшить'
            : '👍 Good negotiation, but you left some money or protections on the table.')
          : pct >= 50 ? (lang === 'ru'
            ? '📖 Нужно подтянуть навыки'
            : '📖 Fair attempt. Review rate negotiation tactics and accessorial protections.')
          : (lang === 'ru'
            ? '📚 Перечитай раздел по переговорам с брокерами'
            : '📚 Needs improvement. Study broker negotiation fundamentals before your next call.')}
        </p>

        <button
          onClick={reset}
          className="mt-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          {lang === 'ru' ? 'Попробовать снова' : 'Try Again'}
        </button>
      </div>
    );
  }

  /* ── Call UI ─────────────────────────────────────────────────────────────── */
  return (
    <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200 dark:border-[rgba(255,255,255,0.08)] bg-gray-50 dark:bg-[#1c1c1e]" style={{ maxHeight: 780 }}>
      {/* ── CSS for audio wave animation ── */}
      <style>{`
        @keyframes audioWave {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1); }
        }
      `}</style>

      {/* ── Header: phone call style ── */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold ring-2 ring-blue-400">
          ML
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Mark L. — Swift Logistics</p>
          <p className="text-xs text-blue-200">
            {LOAD_INFO.origin} → {LOAD_INFO.destination} &middot; {LOAD_INFO.miles} mi &middot; {LOAD_INFO.type}
          </p>
        </div>
        <AudioWave active={brokerSpeaking} />
        {visibleCount >= CALL_STEPS.length ? (
          <PhoneOff className="w-5 h-5 text-red-300" />
        ) : (
          <Phone className="w-5 h-5" />
        )}
      </div>

      {/* ── Load info bar ── */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-blue-800">
        <span className="font-medium">Posted: ${LOAD_INFO.posted.toLocaleString()}</span>
        <span>({(LOAD_INFO.posted / LOAD_INFO.miles).toFixed(2)}/mi)</span>
        <span className="text-blue-400">|</span>
        <span>Market: ~${LOAD_INFO.marketRate.toFixed(2)}/mi</span>
        <span className="text-blue-400">|</span>
        <span>{LOAD_INFO.weight}</span>
      </div>

      {/* ── Call transcript area ── */}
      <div ref={scrollRef} className="p-4 space-y-3 overflow-y-auto" style={{ minHeight: 280, maxHeight: 380 }}>
        {visibleMessages.map(msg => {
          /* System messages: call status */
          if (msg.from === 'system') {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-xs text-gray-400 dark:text-[#636366] bg-gray-100 dark:bg-[#2c2c2e] px-3 py-1 rounded-full">
                  {msg.text}
                </span>
              </div>
            );
          }

          /* Broker speaking */
          if (msg.from === 'broker') {
            return (
              <div key={msg.id} className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-[#3a3a3c] flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-[#a1a1a6] mt-0.5">
                  ML
                </div>
                <div className="bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[rgba(255,255,255,0.08)] rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%] shadow-sm">
                  <p className="text-xs font-medium text-gray-400 dark:text-[#636366] mb-0.5">Mark — Broker</p>
                  <p className="text-sm text-gray-800 dark:text-[#f5f5f7]">{msg.text}</p>
                </div>
              </div>
            );
          }

          /* Dispatcher response (chosen) */
          const chosen = responses[msg.id];
          const option = msg.options?.find(o => o.id === chosen);
          if (!option) return null;
          const qm = QUALITY_META[option.quality];

          return (
            <div key={msg.id} className="space-y-1.5">
              <div className="flex items-start justify-end gap-2">
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                  <p className="text-xs font-medium text-blue-200 mb-0.5">You — Dispatcher</p>
                  <p className="text-sm">{option.text}</p>
                </div>
              </div>
              <div className={cn(
                'mx-2 px-3 py-1.5 rounded-lg text-xs border',
                qm.bg, qm.text, qm.border,
              )}>
                {qm.icon} {option.explanation}
              </div>
            </div>
          );
        })}

        {/* Broker typing indicator */}
        {brokerSpeaking && (
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-[#3a3a3c] flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-[#a1a1a6]">
              ML
            </div>
            <div className="bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[rgba(255,255,255,0.08)] rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Dispatcher response options ── */}
      {waitingForResponse && currentMsg?.options && (
        <div className="bg-white dark:bg-[#2c2c2e] border-t border-gray-200 dark:border-[rgba(255,255,255,0.08)] p-3 space-y-2">
          <p className="text-xs font-medium text-gray-400 dark:text-[#636366] uppercase tracking-wide px-1">
            {lang === 'ru' ? 'Выберите ответ:' : 'Choose your response:'}
          </p>
          {currentMsg.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleResponse(currentMsg.id, opt.id, opt.quality)}
              className="w-full text-left text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-blue-400 hover:bg-blue-50 transition-colors leading-relaxed"
            >
              {opt.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
