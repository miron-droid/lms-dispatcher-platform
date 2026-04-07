'use client';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, Phone } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';

interface Message {
  id: number;
  from: 'driver' | 'dispatcher' | 'system';
  text: string;
  delayMs: number;
  options?: { id: string; text: string; quality: 'best' | 'good' | 'ok' | 'poor'; explanation: string }[];
}

const MESSAGES: Message[] = [
  { id: 1, from: 'system', text: 'Today, 8:42 AM', delayMs: 500 },
  { id: 2, from: 'driver', text: 'Hey boss, just got to the shipper in Memphis. Gate is locked, nobody here 🤔', delayMs: 1200 },
  { id: 3, from: 'driver', text: 'Appointment was 8:30 AM. Been waiting 15 min already', delayMs: 2000 },
  {
    id: 4, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      { id: 'a', text: 'Let me call the shipper contact right now. Send me the address from the rate con — I\'ll also notify the broker about potential detention.', quality: 'best', explanation: 'Proactive — takes immediate multi-step action: calls shipper + alerts broker' },
      { id: 'b', text: 'Did you try calling the number on the rate con yourself?', quality: 'good', explanation: 'Reasonable, but dispatcher should take the lead, not push back to driver' },
      { id: 'c', text: 'Just wait a bit more, they\'ll open soon', quality: 'poor', explanation: 'Passive — wastes driver\'s HOS clock, no action taken' },
      { id: 'd', text: 'That\'s weird. Send me photos of the gate — I\'ll email the broker about it.', quality: 'ok', explanation: 'Takes some action but too slow — calling is faster than emailing in urgent situations' },
    ],
  },
  { id: 5, from: 'driver', text: 'Thanks. Address is 4521 Warehouse Dr, Memphis TN 38118', delayMs: 1500 },
  { id: 6, from: 'system', text: '9:15 AM', delayMs: 800 },
  { id: 7, from: 'driver', text: 'Update: they opened the gate. But now they say load won\'t be ready for 2 more hours 😤', delayMs: 2000 },
  { id: 8, from: 'driver', text: 'That puts me behind on delivery in Atlanta by tonight', delayMs: 1500 },
  {
    id: 9, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      { id: 'a', text: 'I\'m calling the broker now to report detention and negotiate a delivery extension. I\'ll also check if the receiver has a later appointment available. Don\'t worry — I\'ll handle it.', quality: 'best', explanation: 'Full ownership: detention claim + delivery rescheduling + receiver coordination' },
      { id: 'b', text: 'Let me file for detention right away. Free time is 2 hours, after that it\'s $75/hr. I\'ll also call the broker about the delivery window.', quality: 'good', explanation: 'Good knowledge of detention rules + addresses delivery, but should also check receiver availability' },
      { id: 'c', text: 'That sucks. Let me know when you\'re loaded', quality: 'poor', explanation: 'No action — doesn\'t address the delivery risk, detention money, or broker notification' },
      { id: 'd', text: 'Can you ask them to speed up loading? Tell them we have a tight delivery window.', quality: 'ok', explanation: 'Puts pressure on driver to negotiate — that\'s the dispatcher\'s job, not the driver\'s' },
    ],
  },
  { id: 10, from: 'system', text: '11:30 AM', delayMs: 800 },
  { id: 11, from: 'driver', text: 'Finally loaded. BOL says 42,000 lbs. But I weighed in at 81,200 total. That\'s 1,200 lbs over! 😰', delayMs: 2000 },
  {
    id: 12, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      { id: 'a', text: 'Do NOT leave the shipper. Go back to the dock and ask them to remove 2 pallets. I\'m calling the broker now to adjust the BOL. 80,000 lbs is the federal max — no exceptions.', quality: 'best', explanation: 'Correct — prevents overweight violation ($1,000+ fine), takes immediate action on both ends' },
      { id: 'b', text: 'Go back to the dock. Can they rearrange the load to redistribute weight across axles? I\'ll check the axle limits for your truck type.', quality: 'good', explanation: 'Good thinking on axle distribution, but total GVW still exceeds 80K — weight must be removed' },
      { id: 'c', text: 'You\'ll probably be fine, just avoid weigh stations on the way', quality: 'poor', explanation: 'DANGEROUS — overweight is a federal violation ($1,000+ fine). Bypassing scales is also illegal and trackable.' },
      { id: 'd', text: 'How accurate is that scale? Try a different truck stop scale to double-check.', quality: 'ok', explanation: 'Scales can vary 200-300 lbs, but 1,200 over is too much to gamble — safer to offload' },
    ],
  },
  { id: 13, from: 'driver', text: 'Good call. They took off 2 pallets. New weight 79,400. We\'re good 👍', delayMs: 2000 },
  { id: 14, from: 'system', text: '3:45 PM', delayMs: 800 },
  { id: 15, from: 'driver', text: 'On I-22 heading to Atlanta. Traffic is backed up for miles. GPS says 2 hour delay 😩', delayMs: 2000 },
  {
    id: 16, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      { id: 'a', text: 'I\'ll call the broker and receiver right now with an updated ETA of ~9:30 PM. How many HOS hours do you have left? If it\'s tight, we\'ll find a safe parking spot.', quality: 'best', explanation: 'Proactive communication to both parties + checks driver\'s legal hours + safety backup plan' },
      { id: 'b', text: 'Let me look at alternate routes. I see US-78 might save 45 minutes. I\'ll also update the broker on the new ETA.', quality: 'good', explanation: 'Good initiative with route alternative + broker notification. Should also check HOS.' },
      { id: 'c', text: 'Nothing we can do about traffic 🤷', quality: 'poor', explanation: 'Must notify broker/receiver about late delivery — it\'s a contractual obligation' },
      { id: 'd', text: 'Can you push through? The receiver closes at 10 PM.', quality: 'ok', explanation: 'Shows urgency awareness but doesn\'t check HOS or notify parties — could lead to violation' },
    ],
  },
  { id: 17, from: 'driver', text: 'I\'ve got 4 hours of drive time left. Should be enough. Thanks for handling the calls 🙏', delayMs: 1500 },
  { id: 18, from: 'system', text: '8:50 PM', delayMs: 800 },
  { id: 19, from: 'driver', text: 'Almost there. Receiver says dock 7 but there\'s a truck already in dock 7. Security can\'t reach the warehouse manager 🫠', delayMs: 2000 },
  {
    id: 20, from: 'dispatcher', text: '', delayMs: 500,
    options: [
      { id: 'a', text: 'I\'m calling the broker\'s after-hours line now — they can reach the receiver\'s ops team. Park by dock 7 and keep your engine running. I\'ll have an answer in 10 minutes.', quality: 'best', explanation: 'Escalates through proper channel (broker → receiver ops), gives driver clear instructions and timeline' },
      { id: 'b', text: 'Ask security to try the warehouse manager again. In the meantime, check if any other dock is open.', quality: 'good', explanation: 'Practical but relies on driver to solve a coordination problem — dispatcher should handle calls' },
      { id: 'c', text: 'Just wait there, someone will figure it out eventually', quality: 'poor', explanation: 'Driver is on HOS clock and fatigued — every minute of waiting costs money and safety' },
      { id: 'd', text: 'Take a photo of the dock and the truck blocking it. I\'ll document this for a detention claim tomorrow.', quality: 'ok', explanation: 'Good for documentation but doesn\'t solve the immediate problem of getting unloaded tonight' },
    ],
  },
  { id: 21, from: 'driver', text: 'They moved the other truck. Backing into dock 7 now. Should be unloaded in 30 min. Thanks boss, you saved the day 💪', delayMs: 2000 },
  { id: 22, from: 'system', text: '9:35 PM — Delivery complete ✅', delayMs: 1000 },
];

export function DriverChatSimulator() {
  const { lang } = useLang();
  const [visibleCount, setVisibleCount] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [finished, setFinished] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleMessages = MESSAGES.slice(0, visibleCount);
  const currentMsg = visibleCount < MESSAGES.length ? MESSAGES[visibleCount] : null;
  const waitingForResponse = currentMsg?.options && !responses[currentMsg.id];

  useEffect(() => {
    if (visibleCount >= MESSAGES.length) {
      setTimeout(() => setFinished(true), 1000);
      return;
    }
    const msg = MESSAGES[visibleCount];
    if (msg.options && !responses[msg.id]) return;
    const timer = setTimeout(() => setVisibleCount(v => v + 1), msg.delayMs);
    return () => clearTimeout(timer);
  }, [visibleCount, responses]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleCount, responses]);

  function handleResponse(msgId: number, optionId: string, quality: string) {
    const option = MESSAGES.find(m => m.id === msgId)?.options?.find(o => o.id === optionId);
    if (!option) return;
    setResponses(r => ({ ...r, [msgId]: optionId }));
    setTotalQuestions(t => t + 1);
    if (quality === 'best') setScore(s => s + 10);
    else if (quality === 'good') setScore(s => s + 7);
    else if (quality === 'ok') setScore(s => s + 4);
    setTimeout(() => setVisibleCount(v => v + 1), 300);
  }

  if (finished) {
    const maxScore = totalQuestions * 10;
    const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    return (
      <div className="mt-6 rounded-2xl bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[rgba(255,255,255,0.08)] p-6 text-center space-y-3">
        <p className="text-4xl">📱</p>
        <p className="text-2xl font-bold">{pct}%</p>
        <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">
          {lang === 'ru' ? 'Навыки общения с водителем' : 'Driver Communication Score'}
        </p>
        <p className="text-xs text-gray-400 dark:text-[#636366]">{score}/{maxScore} {lang === 'ru' ? 'баллов' : 'points'}</p>
        <p className="text-sm text-gray-600 dark:text-[#a1a1a6]">
          {pct >= 90 ? '🌟 ' + (lang === 'ru' ? 'Отлично! Профессиональная коммуникация' : 'Excellent! Professional communication') :
           pct >= 70 ? '👍 ' + (lang === 'ru' ? 'Хорошо, но есть что улучшить' : 'Good, but room for improvement') :
           pct >= 50 ? '📖 ' + (lang === 'ru' ? 'Нужно подтянуть навыки коммуникации' : 'Communication skills need work') :
           '📚 ' + (lang === 'ru' ? 'Перечитай раздел про коммуникацию с водителями' : 'Review the driver communication section')}
        </p>
        <button
          onClick={() => { setVisibleCount(0); setResponses({}); setScore(0); setTotalQuestions(0); setFinished(false); }}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition-colors"
        >
          {lang === 'ru' ? 'Пройти заново' : 'Try Again'}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200 dark:border-[rgba(255,255,255,0.08)] bg-gray-100 dark:bg-[#2c2c2e]" style={{ maxHeight: 700 }}>
      <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-3">
        <ChevronLeft className="w-5 h-5" />
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">CM</div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Carlos M.</p>
          <p className="text-xs text-green-200">Load #BR-4421 · Memphis → Atlanta</p>
        </div>
        <Phone className="w-5 h-5" />
      </div>

      <div ref={scrollRef} className="p-3 space-y-2 overflow-y-auto" style={{ minHeight: 300, maxHeight: 380 }}>
        {visibleMessages.map(msg => {
          if (msg.from === 'system') {
            return <p key={msg.id} className="text-center text-xs text-gray-400 dark:text-[#636366] py-1">{msg.text}</p>;
          }
          if (msg.from === 'driver') {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl rounded-bl-sm px-3 py-2 max-w-[80%] shadow-sm">
                  <p className="text-sm text-gray-800 dark:text-[#f5f5f7]">{msg.text}</p>
                </div>
              </div>
            );
          }
          const chosen = responses[msg.id];
          const option = msg.options?.find(o => o.id === chosen);
          if (!option) return null;
          return (
            <div key={msg.id}>
              <div className="flex justify-end">
                <div className="bg-green-500 text-white rounded-2xl rounded-br-sm px-3 py-2 max-w-[80%]">
                  <p className="text-sm">{option.text}</p>
                </div>
              </div>
              <div className={cn(
                'mx-2 mt-1 px-2 py-1 rounded-lg text-xs',
                option.quality === 'best' ? 'bg-green-50 text-green-700' :
                option.quality === 'good' ? 'bg-blue-50 text-blue-700' :
                option.quality === 'ok' ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              )}>
                {option.quality === 'best' ? '✅' : option.quality === 'good' ? '👍' : option.quality === 'ok' ? '⚠️' : '❌'} {option.explanation}
              </div>
            </div>
          );
        })}

        {!waitingForResponse && visibleCount < MESSAGES.length && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl px-4 py-2 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {waitingForResponse && currentMsg?.options && (
        <div className="bg-white dark:bg-[#2c2c2e] border-t border-gray-200 dark:border-[rgba(255,255,255,0.08)] p-2 space-y-1.5">
          {currentMsg.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleResponse(currentMsg.id, opt.id, opt.quality)}
              className="w-full text-left text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              {opt.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
