'use client';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';

interface Crisis {
  id: string; title: string; titleRu: string; severity: 'critical' | 'high' | 'medium';
  icon: string; desc: string; descRu: string;
  escalateDesc: string; escalateDescRu: string;
  correctPriority: number;
  steps: { prompt: string; promptRu: string; options: { id: string; text: string; textRu: string; correct: boolean; explanation: string; explanationRu: string }[] }[];
}

const CRISES: Crisis[] = [
  {
    id: 'c1', title: 'Driver Breakdown I-40', titleRu: 'Поломка на I-40', severity: 'critical', icon: '🚨',
    desc: 'Truck won\'t start near Amarillo, TX. 38K lbs reefer produce. Delivery in Phoenix in 8 hours.',
    descRu: 'Грузовик не заводится у Амарилло, TX. 38K lbs рефрижератор. Доставка в Финикс через 8 часов.',
    escalateDesc: 'Produce temperature rising! Receiver threatening to refuse load.',
    escalateDescRu: 'Температура продуктов растёт! Получатель угрожает отказать в приёмке.',
    correctPriority: 1,
    steps: [
      { prompt: 'What do you do first?', promptRu: 'Что делаете первым?', options: [
        { id: 'a', text: 'Call breakdown service immediately', textRu: 'Звоню в аварийную службу немедленно', correct: true, explanation: 'Correct! Time is critical with reefer.', explanationRu: 'Верно! Время критично для рефрижератора.' },
        { id: 'b', text: 'Call the broker first', textRu: 'Звоню брокеру первым', correct: false, explanation: 'Broker can wait 5 min. Get help rolling first.', explanationRu: 'Брокер подождёт 5 мин. Сначала помощь.' },
        { id: 'c', text: 'Tell driver to try restarting', textRu: 'Скажу водителю попробовать завести', correct: false, explanation: 'He already tried. Don\'t waste time.', explanationRu: 'Он уже пробовал. Не теряйте время.' },
      ]},
      { prompt: 'Breakdown ETA 2 hours. Delivery at risk.', promptRu: 'Ремонт через 2 часа. Доставка под угрозой.', options: [
        { id: 'a', text: 'Notify broker + request 4-hour delivery extension', textRu: 'Уведомить брокера + запросить продление на 4 часа', correct: true, explanation: 'Professional handling. Broker appreciates proactive comms.', explanationRu: 'Профессионально. Брокер ценит проактивность.' },
        { id: 'b', text: 'Wait and hope repair is faster', textRu: 'Ждать и надеяться на быстрый ремонт', correct: false, explanation: 'Never gamble with delivery times.', explanationRu: 'Никогда не рискуйте сроками доставки.' },
        { id: 'c', text: 'Find a replacement truck immediately', textRu: 'Искать замену грузовика немедленно', correct: false, explanation: 'Transloading reefer cargo takes hours. Extension is faster.', explanationRu: 'Перегрузка рефрижератора занимает часы. Продление быстрее.' },
      ]},
    ],
  },
  {
    id: 'c2', title: 'Late Delivery Nashville', titleRu: 'Опоздание в Нэшвилл', severity: 'high', icon: '⏰',
    desc: 'Driver arrived 3 hours late. Receiver threatening $500 penalty and refusing load.',
    descRu: 'Водитель опоздал на 3 часа. Получатель угрожает штрафом $500 и отказом от груза.',
    escalateDesc: 'Receiver has closed the dock. Load must be rescheduled = extra $300 layover.',
    escalateDescRu: 'Получатель закрыл док. Груз нужно перенести = лишние $300 за простой.',
    correctPriority: 2,
    steps: [
      { prompt: 'Receiver is upset. What do you do?', promptRu: 'Получатель зол. Что делаете?', options: [
        { id: 'a', text: 'Call receiver, apologize, negotiate acceptance', textRu: 'Позвонить получателю, извиниться, договориться', correct: true, explanation: 'Professional communication resolves most issues.', explanationRu: 'Профессиональная коммуникация решает большинство проблем.' },
        { id: 'b', text: 'Blame traffic and demand they accept', textRu: 'Обвинить пробки и потребовать принять груз', correct: false, explanation: 'Aggressive approach makes things worse.', explanationRu: 'Агрессивный подход усугубляет ситуацию.' },
        { id: 'c', text: 'Ignore and file claim later', textRu: 'Игнорировать и подать претензию позже', correct: false, explanation: 'Ignoring = guaranteed penalty + damaged reputation.', explanationRu: 'Игнорирование = гарантированный штраф + испорченная репутация.' },
      ]},
    ],
  },
  {
    id: 'c3', title: 'Cancelled Load Columbus', titleRu: 'Отмена в Колумбусе', severity: 'medium', icon: '📋',
    desc: 'Shipper cancelled load 2 hours before pickup. Driver is empty in Columbus, OH.',
    descRu: 'Грузоотправитель отменил груз за 2 часа до погрузки. Водитель пустой в Колумбусе.',
    escalateDesc: 'Driver has been sitting 4 hours. Losing money every minute.',
    escalateDescRu: 'Водитель стоит 4 часа. Теряет деньги каждую минуту.',
    correctPriority: 3,
    steps: [
      { prompt: 'Load cancelled. What\'s your plan?', promptRu: 'Груз отменён. Ваш план?', options: [
        { id: 'a', text: 'File TONU claim ($250) + search load board for Columbus loads', textRu: 'Подать TONU ($250) + искать грузы из Колумбуса на бирже', correct: true, explanation: 'TONU protects carrier. Immediate search minimizes downtime.', explanationRu: 'TONU защищает перевозчика. Быстрый поиск минимизирует простой.' },
        { id: 'b', text: 'Send driver home', textRu: 'Отправить водителя домой', correct: false, explanation: 'Full day lost = $500+ in lost revenue.', explanationRu: 'Потерян целый день = $500+ упущенного дохода.' },
        { id: 'c', text: 'Wait for shipper to reschedule', textRu: 'Ждать перенос от грузоотправителя', correct: false, explanation: 'Could take hours or days. Find a new load now.', explanationRu: 'Может занять часы или дни. Ищите новый груз сейчас.' },
      ]},
    ],
  },
];

const ESCALATE_TIME = 30; // seconds

export function CrisisDashboard() {
  const { lang } = useLang();
  const [phase, setPhase] = useState<'triage' | 'resolving' | 'summary'>('triage');
  const [clock, setClock] = useState(0);
  const [triageOrder, setTriageOrder] = useState<string[]>([]);
  const [activeCrisis, setActiveCrisis] = useState<string | null>(null);
  const [crisisState, setCrisisState] = useState<Record<string, { step: number; escalated: boolean; resolved: boolean; correct: number }>>({
    c1: { step: 0, escalated: false, resolved: false, correct: 0 },
    c2: { step: 0, escalated: false, resolved: false, correct: 0 },
    c3: { step: 0, escalated: false, resolved: false, correct: 0 },
  });
  const clockRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    clockRef.current = setInterval(() => setClock(c => c + 1), 1000);
    return () => { if (clockRef.current) clearInterval(clockRef.current); };
  }, []);

  // Escalation check
  useEffect(() => {
    if (phase !== 'resolving') return;
    const unresolved = CRISES.filter(c => !crisisState[c.id].resolved && c.id !== activeCrisis);
    unresolved.forEach(c => {
      if (clock > ESCALATE_TIME && !crisisState[c.id].escalated) {
        setCrisisState(s => ({ ...s, [c.id]: { ...s[c.id], escalated: true } }));
      }
    });
  }, [clock, phase, activeCrisis, crisisState]);

  function selectCrisis(id: string) {
    if (phase === 'triage') {
      setTriageOrder([...triageOrder, id]);
      setActiveCrisis(id);
      setPhase('resolving');
    } else {
      setActiveCrisis(id);
    }
  }

  function answerStep(crisisId: string, optionId: string) {
    const crisis = CRISES.find(c => c.id === crisisId)!;
    const state = crisisState[crisisId];
    const step = crisis.steps[state.step];
    const option = step.options.find(o => o.id === optionId)!;

    const newState = { ...state, step: state.step + 1, correct: state.correct + (option.correct ? 1 : 0) };
    if (newState.step >= crisis.steps.length) newState.resolved = true;
    setCrisisState(s => ({ ...s, [crisisId]: newState }));

    if (newState.resolved) {
      // Find next unresolved
      const next = CRISES.find(c => !crisisState[c.id].resolved && c.id !== crisisId);
      if (next) {
        setTimeout(() => setActiveCrisis(next.id), 500);
      } else {
        setTimeout(() => { setPhase('summary'); if (clockRef.current) clearInterval(clockRef.current); }, 800);
      }
    }
  }

  const allResolved = Object.values(crisisState).every(s => s.resolved);
  const formatClock = () => {
    const mins = 47 + Math.floor(clock * 5 / 60);
    const displayMin = mins % 60;
    const hour = 14 + Math.floor(mins / 60);
    return `${hour}:${String(displayMin).padStart(2, '0')} CT`;
  };

  if (phase === 'summary') {
    const triageScore = triageOrder[0] === 'c1' ? 30 : triageOrder[0] === 'c2' ? 15 : 5;
    const decisionScore = Object.values(crisisState).reduce((s, c) => s + c.correct * 17, 0);
    const timeScore = clock < 45 ? 20 : clock < 60 ? 15 : 5;
    const total = Math.min(100, triageScore + decisionScore + timeScore);

    return (
      <div className="mt-6 card p-6 bg-gray-900 text-white border-0 space-y-4">
        <h3 className="text-lg font-bold text-center">{lang === 'ru' ? 'Результат кризис-менеджмента' : 'Crisis Management Results'}</h3>
        <p className="text-4xl font-bold text-center">{total}/100</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'Приоритизация' : 'Triage'}</span><span>{triageScore}/30</span></div>
          <div className="flex justify-between"><span className="text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'Решения' : 'Decisions'}</span><span>{decisionScore}/50</span></div>
          <div className="flex justify-between"><span className="text-gray-400 dark:text-[#636366]">{lang === 'ru' ? 'Скорость' : 'Speed'}</span><span>{timeScore}/20</span></div>
        </div>
        <p className="text-center text-sm">{total >= 80 ? '🌟 Crisis commander!' : total >= 50 ? '👍 Solid under pressure' : '📚 Practice prioritization'}</p>
      </div>
    );
  }

  const active = CRISES.find(c => c.id === activeCrisis);
  const activeState = activeCrisis ? crisisState[activeCrisis] : null;

  return (
    <div className="mt-6 rounded-2xl overflow-hidden bg-gray-900 text-white">
      {/* Clock header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-400" />
          <span className="font-mono text-sm">{formatClock()}</span>
        </div>
        <span className="text-xs text-gray-400 dark:text-[#636366]">
          {Object.values(crisisState).filter(s => s.resolved).length}/3 {lang === 'ru' ? 'решено' : 'resolved'}
        </span>
      </div>

      {/* Crisis cards */}
      <div className="p-3 space-y-2">
        {CRISES.map(c => {
          const state = crisisState[c.id];
          const isActive = activeCrisis === c.id;
          const sevColor = c.severity === 'critical' ? 'border-red-500 bg-red-500/10' : c.severity === 'high' ? 'border-orange-500 bg-orange-500/10' : 'border-yellow-500 bg-yellow-500/10';
          const sevBadge = c.severity === 'critical' ? 'bg-red-500' : c.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500';

          if (state.resolved) {
            return (
              <div key={c.id} className="border border-green-500/30 bg-green-500/5 rounded-xl px-4 py-2 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-400">{lang === 'ru' ? c.titleRu : c.title}</span>
                <span className="text-xs text-green-600 ml-auto">✓</span>
              </div>
            );
          }

          return (
            <div key={c.id}>
              <button
                onClick={() => selectCrisis(c.id)}
                className={cn('w-full text-left border rounded-xl px-4 py-3 transition-all', sevColor, isActive && 'ring-2 ring-white/20')}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full text-white font-bold uppercase', sevBadge)}>
                    {c.severity}
                  </span>
                  <span className="text-sm font-semibold">{c.icon} {lang === 'ru' ? c.titleRu : c.title}</span>
                  {state.escalated && <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse ml-auto" />}
                </div>
                <p className="text-xs text-gray-400 dark:text-[#636366]">
                  {state.escalated
                    ? (lang === 'ru' ? c.escalateDescRu : c.escalateDesc)
                    : (lang === 'ru' ? c.descRu : c.desc)}
                </p>
              </button>

              {/* Active crisis resolution */}
              {isActive && activeState && activeState.step < (active?.steps.length ?? 0) && (
                <div className="mt-2 ml-4 space-y-2">
                  <p className="text-sm text-gray-300 dark:text-[#636366]">
                    {lang === 'ru' ? active!.steps[activeState.step].promptRu : active!.steps[activeState.step].prompt}
                  </p>
                  {active!.steps[activeState.step].options.map(opt => (
                    <button key={opt.id} onClick={() => answerStep(c.id, opt.id)}
                      className="w-full text-left text-sm px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors">
                      {lang === 'ru' ? opt.textRu : opt.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {phase === 'triage' && (
        <p className="text-center text-xs text-gray-500 dark:text-[#a1a1a6] pb-3">
          {lang === 'ru' ? '⬆️ Выберите кризис для обработки первым' : '⬆️ Tap a crisis to handle first'}
        </p>
      )}
    </div>
  );
}
