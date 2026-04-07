'use client';

import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n/lang-context';
import { cn } from '@/lib/utils';
import {
  Truck, Package, Phone, CheckCircle, AlertTriangle,
  Star, MapPin, ArrowRight, GraduationCap, RotateCcw,
} from 'lucide-react';

type Lang = 'en' | 'ru';

interface FeedbackState {
  correct: boolean;
  en: string;
  ru: string;
  selectedIdx: number;
}

type OnOption = (idx: number, correct: boolean, en: string, ru: string) => void;

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total, lang }: { step: number; total: number; lang: Lang }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">
          {lang === 'ru' ? 'Симуляция' : 'Simulation'}
        </span>
        <span className="text-xs font-medium text-gray-400 dark:text-[#636366]">
          {lang === 'ru' ? `Шаг ${step} из ${total}` : `Step ${step} of ${total}`}
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 dark:bg-[#2c2c2e] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 px-0.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={cn(
              'w-1.5 h-1.5 rounded-full transition-all duration-300',
              i < step ? 'bg-brand-500 scale-110' : 'bg-gray-200 dark:bg-[#3a3a3c]',
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Feedback Banner ──────────────────────────────────────────────────────────

function FeedbackBanner({ feedback, lang }: { feedback: FeedbackState; lang: Lang }) {
  return (
    <div
      className={cn(
        'rounded-2xl p-4 mt-4 border flex gap-3 items-start transition-all duration-300',
        feedback.correct ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200',
      )}
    >
      {feedback.correct
        ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        : <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />}
      <p className={cn('text-sm leading-relaxed', feedback.correct ? 'text-green-800' : 'text-orange-800')}>
        {lang === 'ru' ? feedback.ru : feedback.en}
      </p>
    </div>
  );
}

// ─── Next Button ──────────────────────────────────────────────────────────────

function NextBtn({ onClick, label, labelRu, lang }: {
  onClick: () => void;
  label: string;
  labelRu: string;
  lang: Lang;
}) {
  return (
    <button
      onClick={onClick}
      className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-sm shadow-sm active:opacity-90 transition-opacity"
    >
      {lang === 'ru' ? labelRu : label}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}

// ─── Screen 0: Intro ──────────────────────────────────────────────────────────

function IntroScreen({ lang, onNext }: { lang: Lang; onNext: () => void }) {
  return (
    <div className="space-y-5">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7]">
          {lang === 'ru' ? 'Симуляция: День диспетчера' : 'Simulation: A Day as a Dispatcher'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-[#a1a1a6] leading-relaxed">
          {lang === 'ru'
            ? 'Ты — диспетчер грузоперевозок. Пройди один полный рабочий цикл и узнай, как это работает на практике.'
            : "You are a freight dispatcher. Complete one full work cycle and learn how it works in practice."}
        </p>
      </div>
      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 space-y-2">
        <p className="text-xs font-bold text-brand-700 uppercase tracking-wide mb-3">
          {lang === 'ru' ? 'В этой симуляции ты:' : 'In this simulation you will:'}
        </p>
        {(lang === 'ru' ? [
          '🔍 Выберешь выгодный груз на Load Board',
          '📞 Проведёшь переговоры с брокером',
          '🚛 Будешь отслеживать водителя в пути',
          '⚡ Справишься с непредвиденной ситуацией',
        ] : [
          '🔍 Pick the most profitable load from the Load Board',
          '📞 Negotiate the rate with a broker',
          '🚛 Track your driver on the route',
          '⚡ Handle an unexpected situation professionally',
        ]).map((item, i) => (
          <p key={i} className="text-sm text-brand-800">{item}</p>
        ))}
      </div>
      <NextBtn onClick={onNext} label="Start Simulation →" labelRu="Начать симуляцию →" lang={lang} />
    </div>
  );
}

// ─── Screen 1: Context ────────────────────────────────────────────────────────

function ContextScreen({ lang, onNext }: { lang: Lang; onNext: () => void }) {
  const rows = [
    { icon: '👤', label: lang === 'ru' ? 'Водитель' : 'Driver', value: 'James Miller' },
    { icon: '📍', label: lang === 'ru' ? 'Местоположение' : 'Location', value: 'Los Angeles, CA' },
    { icon: '🚛', label: lang === 'ru' ? 'Тип трейлера' : 'Trailer Type', value: 'Dry Van (53 ft)' },
    { icon: '✅', label: lang === 'ru' ? 'Статус' : 'Status', value: lang === 'ru' ? 'Свободен — ждёт груз' : 'Available — waiting for load' },
  ];
  return (
    <div className="space-y-5">
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
          <Truck className="w-7 h-7 text-blue-600" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7]">
          {lang === 'ru' ? 'Твоя ситуация' : 'Your Situation'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">
          {lang === 'ru'
            ? 'Изучи данные водителя перед поиском груза'
            : "Review your driver's info before searching for a load"}
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-[#1c1c1e] rounded-2xl p-5 space-y-4 border border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-2xl">{r.icon}</span>
            <div>
              <p className="text-xs text-gray-400 dark:text-[#636366] font-medium">{r.label}</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-[#f5f5f7]">{r.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
        <p className="text-sm text-amber-800">
          {lang === 'ru'
            ? '🎯 Задача: найти прибыльный груз с высоким RPM (ставка за милю) и хорошей общей суммой.'
            : '🎯 Goal: find a profitable load with high RPM (rate per mile) and a solid total payout.'}
        </p>
      </div>
      <NextBtn onClick={onNext} label="Open Load Board →" labelRu="Открыть Load Board →" lang={lang} />
    </div>
  );
}

// ─── Screen 2: Load Board ─────────────────────────────────────────────────────

interface Load {
  route: string;
  rate: string;
  miles: string;
  rpm: string;
  rpmNum: number;
  correct: boolean;
  feedback: { en: string; ru: string };
}

const LOADS: Load[] = [
  {
    route: 'CA → TX', rate: '$2,000', miles: '1,500 mi', rpm: '$1.33', rpmNum: 1.33, correct: false,
    feedback: {
      en: "Too low. $2,000 for 1,500 miles gives only $1.33/mi — below market average for a long haul. The driver spends 2+ days for a poor return.",
      ru: "$2,000 за 1,500 миль — всего $1.33/миль. Это ниже рынка для дальнего рейса. Водитель потратит 2+ дня за низкую выплату.",
    },
  },
  {
    route: 'CA → AZ', rate: '$900', miles: '300 mi', rpm: '$3.00', rpmNum: 3.00, correct: false,
    feedback: {
      en: "RPM looks good, but 300 miles is very short. After Arizona, finding the next load is harder — you'll likely deadhead back.",
      ru: "RPM хороший, но 300 миль — очень короткий рейс. После Аризоны найти следующий груз сложнее — скорее всего придётся ехать пустым.",
    },
  },
  {
    route: 'CA → NV', rate: '$700', miles: '270 mi', rpm: '$2.59', rpmNum: 2.59, correct: false,
    feedback: {
      en: "Short haul, low payout. $700 barely covers fuel. You'd need another load immediately, likely adding deadhead miles.",
      ru: "Короткий рейс, маленькая выплата. $700 едва покрывает топливо. Сразу нужен следующий груз — вероятны холостые мили.",
    },
  },
  {
    route: 'CA → WA', rate: '$2,800', miles: '1,100 mi', rpm: '$2.54', rpmNum: 2.54, correct: true,
    feedback: {
      en: "Excellent! $2,800 with $2.54/mi RPM on 1,100 miles. Washington is a strong freight market — easy to find the next load. Optimal pick!",
      ru: "Отлично! $2,800 с RPM $2.54/миль на 1,100 миль. Вашингтон — сильный рынок грузов. Следующий груз найти легко. Оптимальный выбор!",
    },
  },
];

function LoadBoardScreen({ lang, onOption, feedback }: { lang: Lang; onOption: OnOption; feedback: FeedbackState | null }) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
            <Package className="w-7 h-7 text-purple-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7]">
          {lang === 'ru' ? 'Load Board — Выбери груз' : 'Load Board — Choose a Load'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">
          {lang === 'ru'
            ? 'Сравни варианты. Обрати внимание на RPM и общую сумму.'
            : 'Compare options. Pay attention to RPM and total payout.'}
        </p>
      </div>
      <div className="space-y-3">
        {LOADS.map((load, i) => {
          const isSelected = feedback?.selectedIdx === i;
          const isCorrect = load.correct;
          const showResult = feedback !== null;
          return (
            <button
              key={i}
              onClick={() => !showResult && onOption(i, load.correct, load.feedback.en, load.feedback.ru)}
              disabled={showResult}
              className={cn(
                'w-full text-left rounded-2xl border-2 p-4 transition-all duration-200',
                !showResult && 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-brand-300 active:border-brand-500',
                showResult && isSelected && isCorrect && 'border-green-500 bg-green-50',
                showResult && isSelected && !isCorrect && 'border-red-400 bg-red-50',
                showResult && !isSelected && 'border-gray-100 dark:border-[rgba(255,255,255,0.06)] opacity-40',
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 dark:text-[#f5f5f7]">{load.route}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-700 dark:text-[#a1a1a6] font-medium">{load.rate}</span>
                    <span className="text-gray-300 dark:text-[#636366]">•</span>
                    <span className="text-sm text-gray-400 dark:text-[#636366]">{load.miles}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    'text-sm font-bold px-3 py-1 rounded-xl',
                    load.rpmNum >= 2.5 ? 'bg-green-100 text-green-700' : load.rpmNum >= 2.0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700',
                  )}>
                    {load.rpm}<span className="text-xs font-normal">/mi</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-[#636366] mt-1">RPM</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {feedback && <FeedbackBanner feedback={feedback} lang={lang} />}
    </div>
  );
}

// ─── Screen 3: Broker Call ────────────────────────────────────────────────────

interface BrokerOption {
  label: string;
  labelRu: string;
  correct: boolean;
  feedback: { en: string; ru: string };
}

const BROKER_OPTIONS: BrokerOption[] = [
  {
    label: '"Sure, $2,600 works for us!"',
    labelRu: '"Договорились, нас устраивает $2,600!"',
    correct: false,
    feedback: {
      en: "Too quick! Brokers always start with room to negotiate. You left $200+ on the table. A professional always counters the first offer.",
      ru: "Слишком быстро! Брокеры всегда оставляют пространство для торговли. Ты потерял $200+. Профессионал всегда делает встречное предложение.",
    },
  },
  {
    label: '"I need at least $2,900 to make this work."',
    labelRu: '"Мне нужно минимум $2,900, чтобы это было выгодно."',
    correct: true,
    feedback: {
      en: "Professional counter-offer! Clear and reasonable. The broker met you at $2,800 — that's $200 more than the opening offer. Well done!",
      ru: "Профессиональное встречное предложение! Чётко и разумно. Брокер пошёл на $2,800 — на $200 больше стартовой ставки. Отлично!",
    },
  },
  {
    label: '"We won\'t go below $3,500. Final answer."',
    labelRu: '"Мы не пойдём ниже $3,500. Это финальный ответ."',
    correct: false,
    feedback: {
      en: "Too aggressive. $3,500 is well above market for this lane. The broker will simply call another carrier.",
      ru: "Слишком агрессивно. $3,500 значительно выше рынка для этого маршрута. Брокер просто позвонит другому перевозчику.",
    },
  },
  {
    label: '"No thanks, I\'ll find something else."',
    labelRu: '"Нет, спасибо. Найду что-то получше."',
    correct: false,
    feedback: {
      en: "No need to refuse. This is a solid load. Always try to negotiate before declining — you could have gotten $2,800.",
      ru: "Нет причин отказываться. Это хороший груз. Всегда пробуй торговаться — ты мог получить $2,800.",
    },
  },
];

function BrokerCallScreen({ lang, onOption, feedback }: { lang: Lang; onOption: OnOption; feedback: FeedbackState | null }) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
            <Phone className="w-7 h-7 text-green-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7]">
          {lang === 'ru' ? 'Звонок брокеру' : 'Broker Call'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">
          {lang === 'ru' ? 'Ты звонишь по грузу CA → WA' : 'You call about the CA → WA load'}
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-[#1c1c1e] rounded-2xl p-4 border border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
        <p className="text-xs font-semibold text-gray-400 dark:text-[#636366] uppercase tracking-wide mb-2">Broker</p>
        <div className="bg-white dark:bg-[#2c2c2e] rounded-xl p-3 border border-gray-200 dark:border-[rgba(255,255,255,0.08)] shadow-sm">
          <p className="text-sm text-gray-800 dark:text-[#f5f5f7] leading-relaxed">
            {lang === 'ru'
              ? '"Привет! Есть груз LA → Seattle. Ставка $2,600. Интересно?"'
              : '"Hi! I have a load from LA to Seattle. My rate is $2,600. Interested?"'}
          </p>
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-700 dark:text-[#a1a1a6]">
        {lang === 'ru' ? '💬 Что ты отвечаешь?' : '💬 What do you say?'}
      </p>
      <div className="space-y-2">
        {BROKER_OPTIONS.map((opt, i) => {
          const isSelected = feedback?.selectedIdx === i;
          const showResult = feedback !== null;
          return (
            <button
              key={i}
              onClick={() => !showResult && onOption(i, opt.correct, opt.feedback.en, opt.feedback.ru)}
              disabled={showResult}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-sm leading-relaxed',
                !showResult && 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-brand-300 active:border-brand-500',
                showResult && isSelected && opt.correct && 'border-green-500 bg-green-50',
                showResult && isSelected && !opt.correct && 'border-red-400 bg-red-50',
                showResult && !isSelected && 'border-gray-100 dark:border-[rgba(255,255,255,0.06)] opacity-40',
              )}
            >
              {lang === 'ru' ? opt.labelRu : opt.label}
            </button>
          );
        })}
      </div>
      {feedback && <FeedbackBanner feedback={feedback} lang={lang} />}
    </div>
  );
}

// ─── Screen 4: Confirmation ───────────────────────────────────────────────────

function ConfirmationScreen({ lang, onNext }: { lang: Lang; onNext: () => void }) {
  const details = [
    { label: lang === 'ru' ? 'Маршрут' : 'Route', value: 'Los Angeles, CA → Seattle, WA' },
    { label: lang === 'ru' ? 'Ставка' : 'Rate', value: '$2,800' },
    { label: lang === 'ru' ? 'Расстояние' : 'Distance', value: '1,100 miles' },
    { label: 'RPM', value: '$2.54/mile' },
    { label: lang === 'ru' ? 'Загрузка' : 'Pickup', value: lang === 'ru' ? 'Завтра 08:00 AM, LA' : 'Tomorrow 08:00 AM, LA' },
    { label: lang === 'ru' ? 'Доставка' : 'Delivery', value: lang === 'ru' ? 'Послезавтра 18:00 PM, Seattle' : 'Day after 06:00 PM, Seattle' },
  ];
  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7]">
          {lang === 'ru' ? 'Груз забронирован!' : 'Load Booked!'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-[#a1a1a6] mt-1">
          {lang === 'ru'
            ? 'Ты выполнил "book a load" — подтвердил груз для водителя'
            : 'You successfully "booked a load" — confirmed a shipment for your driver'}
        </p>
      </div>
      <div className="bg-green-50 rounded-2xl p-5 border border-green-100 space-y-3">
        <p className="text-xs font-bold text-green-700 uppercase tracking-wide">📄 Rate Confirmation</p>
        {details.map((d, i) => (
          <div key={i} className="flex justify-between items-start gap-2 text-sm">
            <span className="text-green-600 font-medium flex-shrink-0">{d.label}</span>
            <span className="text-gray-800 dark:text-[#f5f5f7] font-semibold text-right">{d.value}</span>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
        <p className="text-sm text-blue-800">
          {lang === 'ru'
            ? '✅ Ты отправил водителю Джеймсу все детали: адрес загрузки, время и инструкции.'
            : '✅ You sent driver James all the details: pickup address, time, and instructions.'}
        </p>
      </div>
      <NextBtn onClick={onNext} label="Send Driver →" labelRu="Отправить водителя →" lang={lang} />
    </div>
  );
}

// ─── Screen 5: En Route ───────────────────────────────────────────────────────

function EnRouteScreen({ lang, onNext }: { lang: Lang; onNext: () => void }) {
  const status = [
    { icon: '📍', label: lang === 'ru' ? 'Местоположение' : 'Location', value: 'Sacramento, CA' },
    { icon: '🏁', label: lang === 'ru' ? 'Пункт назначения' : 'Destination', value: 'Seattle, WA' },
    { icon: '🕐', label: 'ETA', value: lang === 'ru' ? '~14 часов' : '~14 hours' },
    { icon: '📦', label: lang === 'ru' ? 'Груз' : 'Load', value: lang === 'ru' ? 'В порядке ✅' : 'No issues ✅' },
  ];
  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
            <MapPin className="w-7 h-7 text-blue-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7]">
          {lang === 'ru' ? 'Водитель в пути' : 'Driver is En Route'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-[#a1a1a6] mt-1">
          {lang === 'ru'
            ? 'Джеймс забрал груз вовремя и едет в Сиэтл по I-5'
            : 'James picked up on time and is heading to Seattle via I-5'}
        </p>
      </div>
      <div className="bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
          <p className="text-white text-xs font-bold uppercase tracking-wide">
            {lang === 'ru' ? 'Статус рейса' : 'Trip Status'}
          </p>
        </div>
        <div className="p-4 space-y-3">
          {status.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xl">{s.icon}</span>
              <div className="flex-1 flex justify-between items-center">
                <span className="text-xs text-gray-400 dark:text-[#636366]">{s.label}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-[#f5f5f7]">{s.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-[#1c1c1e] rounded-xl p-4 border border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
        <p className="text-xs font-bold text-gray-500 dark:text-[#a1a1a6] uppercase tracking-wide mb-2">Check Call ✓</p>
        <p className="text-sm text-gray-700 dark:text-[#a1a1a6] italic">
          {lang === 'ru'
            ? '"Джеймс, как дела? Всё по плану?" — "Да, всё хорошо. Еду по расписанию."'
            : '"James, how\'s it going? Everything on schedule?" — "Yes, all good. Running on time."'}
        </p>
      </div>
      <NextBtn onClick={onNext} label="Continue →" labelRu="Продолжить →" lang={lang} />
    </div>
  );
}

// ─── Screen 6: Problem ────────────────────────────────────────────────────────

interface ProblemOption {
  label: string;
  labelRu: string;
  correct: boolean;
  feedback: { en: string; ru: string };
}

const PROBLEM_OPTIONS: ProblemOption[] = [
  {
    label: "Ignore it — the driver will figure it out.",
    labelRu: "Игнорировать — водитель сам разберётся.",
    correct: false,
    feedback: {
      en: "Never ignore a delay! The broker and consignee are waiting. Silence damages your reputation and can lead to financial penalties.",
      ru: "Никогда не игнорируй задержку! Брокер и грузополучатель ждут. Молчание наносит ущерб репутации и может привести к штрафам.",
    },
  },
  {
    label: "Call the broker right away, give updated ETA, apologize.",
    labelRu: "Немедленно позвонить брокеру, сообщить новый ETA, извиниться.",
    correct: true,
    feedback: {
      en: "Exactly right! Proactive communication is the key. The broker appreciates the heads-up and will keep working with you. Problem solved professionally.",
      ru: "Именно так! Проактивное общение — ключевой навык диспетчера. Брокер оценит предупреждение и продолжит сотрудничество. Проблема решена профессионально.",
    },
  },
  {
    label: "Tell the driver to speed up and make up the time.",
    labelRu: "Сказать водителю ехать быстрее, наверстать время.",
    correct: false,
    feedback: {
      en: "Dangerous and illegal! Drivers must follow HOS (Hours of Service) regulations. Pressuring a driver to speed can cause accidents, fines, and license loss.",
      ru: "Опасно и незаконно! Водители обязаны соблюдать правила HOS. Давление на водителя может привести к авариям, штрафам и потере лицензии.",
    },
  },
  {
    label: "Cancel the load to avoid any problems.",
    labelRu: "Отменить груз, чтобы избежать проблем.",
    correct: false,
    feedback: {
      en: "Wrong move. Cancelling mid-transit is a serious breach of contract. It will damage your broker relationship, result in penalties, and can get you blacklisted.",
      ru: "Неверное решение. Отмена груза во время перевозки — серьёзное нарушение договора. Это испортит отношения с брокером и может привести к штрафам.",
    },
  },
];

function ProblemScreen({ lang, onOption, feedback }: { lang: Lang; onOption: OnOption; feedback: FeedbackState | null }) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-orange-500" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7]">
          {lang === 'ru' ? '⚠️ Проблема!' : '⚠️ Problem!'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-[#a1a1a6]">
          {lang === 'ru' ? 'Пришло сообщение от водителя' : 'You receive a message from the driver'}
        </p>
      </div>
      <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
        <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">
          {lang === 'ru' ? '💬 Сообщение от Джеймса' : '💬 Message from James'}
        </p>
        <p className="text-sm text-gray-800 dark:text-[#f5f5f7] leading-relaxed">
          {lang === 'ru'
            ? '"Слушай, застрял в пробке у Портленда. Приеду примерно на 2 часа позже. Что делать?"'
            : '"Hey, stuck in heavy traffic near Portland. Looks like I\'ll be about 2 hours late. What should I do?"'}
        </p>
      </div>
      <p className="text-sm font-semibold text-gray-700 dark:text-[#a1a1a6]">
        {lang === 'ru' ? '🤔 Что ты делаешь?' : '🤔 What do you do?'}
      </p>
      <div className="space-y-2">
        {PROBLEM_OPTIONS.map((opt, i) => {
          const isSelected = feedback?.selectedIdx === i;
          const showResult = feedback !== null;
          return (
            <button
              key={i}
              onClick={() => !showResult && onOption(i, opt.correct, opt.feedback.en, opt.feedback.ru)}
              disabled={showResult}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-sm leading-relaxed',
                !showResult && 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-brand-300 active:border-brand-500',
                showResult && isSelected && opt.correct && 'border-green-500 bg-green-50',
                showResult && isSelected && !opt.correct && 'border-red-400 bg-red-50',
                showResult && !isSelected && 'border-gray-100 dark:border-[rgba(255,255,255,0.06)] opacity-40',
              )}
            >
              {lang === 'ru' ? opt.labelRu : opt.label}
            </button>
          );
        })}
      </div>
      {feedback && <FeedbackBanner feedback={feedback} lang={lang} />}
    </div>
  );
}

// ─── Screen 7: Delivery ───────────────────────────────────────────────────────

function DeliveryScreen({ lang, onNext }: { lang: Lang; onNext: () => void }) {
  const items = lang === 'ru' ? [
    'Груз принят грузополучателем',
    'Документы подписаны (BOL)',
    'Брокер уведомлён о доставке',
    'Задержка обработана профессионально',
  ] : [
    'Consignee accepted the load',
    'Documents signed (BOL)',
    'Broker notified of delivery',
    'Delay handled professionally',
  ];
  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7]">
          {lang === 'ru' ? 'Груз доставлен!' : 'Load Delivered!'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-[#a1a1a6] mt-1">
          {lang === 'ru'
            ? 'Несмотря на задержку, Джеймс доставил груз в Сиэтл'
            : 'Despite the delay, James safely delivered the load to Seattle'}
        </p>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-green-50 rounded-xl p-3 border border-green-100">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">{item}</p>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Broker</p>
        <p className="text-sm text-blue-800 italic">
          {lang === 'ru'
            ? '"Спасибо, что предупредил заранее. Бывает. Будем работать снова."'
            : '"Thanks for the heads-up. These things happen. We\'ll work together again."'}
        </p>
      </div>
      <NextBtn onClick={onNext} label="See Results →" labelRu="Посмотреть результаты →" lang={lang} />
    </div>
  );
}

// ─── Screen 8: Summary ────────────────────────────────────────────────────────

function SummaryScreen({ lang, onComplete }: { lang: Lang; onComplete: () => void }) {
  const actions = lang === 'ru' ? [
    'Проанализировал 4 груза и выбрал самый выгодный',
    'Провёл переговоры с брокером (+$200 к стартовой ставке)',
    'Забронировал груз LA → Seattle за $2,800',
    'Контролировал водителя и делал check calls',
    'Профессионально справился с задержкой',
  ] : [
    'Analyzed 4 loads and chose the most profitable',
    'Negotiated with broker (+$200 above opening offer)',
    'Booked load LA → Seattle for $2,800',
    'Tracked driver and made check calls',
    'Handled a 2-hour delay professionally',
  ];
  const financials = [
    { label: lang === 'ru' ? 'Выручка' : 'Gross Revenue', value: '$2,800', bold: false },
    { label: lang === 'ru' ? 'Расходы на топливо' : 'Fuel Cost (~1,100 mi)', value: '−$550', bold: false },
    { label: lang === 'ru' ? 'Комиссия диспетчера (10%)' : 'Dispatcher Fee (10%)', value: '$280', bold: false },
    { label: lang === 'ru' ? 'Чистый доход перевозчика' : 'Net Carrier Revenue', value: '~$1,970', bold: true },
  ];
  const skills = lang === 'ru'
    ? ['Анализ RPM', 'Переговоры', 'Check calls', 'ETA management', 'Кризисное мышление']
    : ['RPM analysis', 'Negotiation', 'Check calls', 'ETA management', 'Crisis handling'];

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
            <Star className="w-9 h-9 text-white fill-white" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7]">
          {lang === 'ru' ? 'Симуляция завершена!' : 'Simulation Complete!'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-[#a1a1a6] mt-1">
          {lang === 'ru' ? 'Вот что ты сделал сегодня' : "Here's what you accomplished today"}
        </p>
      </div>

      <div className="bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3">
          <p className="text-white text-xs font-bold uppercase tracking-wide">
            {lang === 'ru' ? '📋 Выполненные действия' : '📋 Actions Completed'}
          </p>
        </div>
        <div className="p-4 space-y-2">
          {actions.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-[#a1a1a6]">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 rounded-2xl border border-green-100 p-4 space-y-2">
        <p className="text-xs font-bold text-green-700 uppercase tracking-wide">
          {lang === 'ru' ? '💰 Финансовый результат' : '💰 Financial Result'}
        </p>
        {financials.map((f, i) => (
          <div key={i} className={cn('flex justify-between text-sm', f.bold && 'border-t border-green-200 pt-2 mt-1')}>
            <span className={f.bold ? 'font-bold text-green-700' : 'text-green-700'}>{f.label}</span>
            <span className={f.bold ? 'font-bold text-green-700' : 'font-semibold text-gray-700 dark:text-[#a1a1a6]'}>{f.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-purple-50 rounded-xl border border-purple-100 p-4">
        <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-3">
          {lang === 'ru' ? '🏆 Навыки отработаны' : '🏆 Skills Demonstrated'}
        </p>
        <div className="flex flex-wrap gap-2">
          {skills.map((s, i) => (
            <span key={i} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">{s}</span>
          ))}
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm shadow-sm active:opacity-90 transition-opacity"
      >
        {lang === 'ru' ? '🎉 Завершить симуляцию' : '🎉 Complete Simulation'}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SimulationBlock() {
  const { lang } = useLang();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [completed, setCompleted] = useState(false);

  const TOTAL = 8; // steps 1–8 shown in progress (step 0 is intro)

  // Auto-clear wrong feedback after 2.5s so user can retry
  useEffect(() => {
    if (feedback && !feedback.correct) {
      const timer = setTimeout(() => setFeedback(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  function transition(next: number) {
    setFeedback(null);
    setVisible(false);
    setTimeout(() => {
      setStep(next);
      setVisible(true);
    }, 220);
  }

  function handleNext() {
    if (step >= 8) { setCompleted(true); return; }
    transition(step + 1);
  }

  function handleOption(idx: number, correct: boolean, en: string, ru: string) {
    setFeedback({ correct, en, ru, selectedIdx: idx });
  }

  function handleContinue() {
    transition(step + 1);
  }

  if (completed) {
    return (
      <div className="mt-10 rounded-2xl bg-green-50 border border-green-200 p-8 text-center space-y-4">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
        <h3 className="text-lg font-bold text-green-800">
          {lang === 'ru' ? 'Симуляция пройдена!' : 'Simulation Completed!'}
        </h3>
        <p className="text-sm text-green-700">
          {lang === 'ru'
            ? 'Ты успешно прошёл симуляцию рабочего дня диспетчера.'
            : 'You successfully completed the dispatcher workday simulation.'}
        </p>
        <button
          onClick={() => { setStep(0); setCompleted(false); setFeedback(null); setVisible(true); }}
          className="inline-flex items-center gap-2 text-sm text-green-700 font-medium underline underline-offset-2"
        >
          <RotateCcw className="w-4 h-4" />
          {lang === 'ru' ? 'Пройти снова' : 'Restart simulation'}
        </button>
      </div>
    );
  }

  // Inject onContinue into FeedbackBanner for choice screens
  const choiceScreens = [2, 3, 6];
  const isChoiceScreen = choiceScreens.includes(step);

  return (
    <div className="mt-10 bg-white dark:bg-[#2c2c2e] rounded-3xl border border-gray-100 dark:border-[rgba(255,255,255,0.06)] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-5">
        <p className="text-white font-bold text-base">
          {lang === 'ru' ? '🎮 Интерактивная симуляция' : '🎮 Interactive Simulation'}
        </p>
        <p className="text-brand-100 text-xs mt-0.5">
          {lang === 'ru' ? 'Симуляция рабочего дня диспетчера' : 'Dispatcher Workday Simulation'}
        </p>
      </div>

      {/* Progress (hidden on intro screen) */}
      {step > 0 && (
        <div className="px-6 pt-5">
          <ProgressBar step={step} total={TOTAL} lang={lang} />
        </div>
      )}

      {/* Screen content with fade + slide animation */}
      <div
        className={cn(
          'px-6 pb-8 transition-all duration-200',
          step === 0 && 'pt-6',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
        )}
      >
        {step === 0 && <IntroScreen lang={lang} onNext={handleNext} />}
        {step === 1 && <ContextScreen lang={lang} onNext={handleNext} />}
        {step === 2 && (
          <LoadBoardScreen
            lang={lang}
            onOption={handleOption}
            feedback={feedback}
          />
        )}
        {step === 3 && (
          <BrokerCallScreen
            lang={lang}
            onOption={handleOption}
            feedback={feedback}
          />
        )}
        {step === 4 && <ConfirmationScreen lang={lang} onNext={handleNext} />}
        {step === 5 && <EnRouteScreen lang={lang} onNext={handleNext} />}
        {step === 6 && (
          <ProblemScreen
            lang={lang}
            onOption={handleOption}
            feedback={feedback}
          />
        )}
        {step === 7 && <DeliveryScreen lang={lang} onNext={handleNext} />}
        {step === 8 && <SummaryScreen lang={lang} onComplete={handleNext} />}

        {/* For choice screens, override the FeedbackBanner's onContinue */}
        {isChoiceScreen && feedback?.correct && (
          <button
            onClick={handleContinue}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white text-sm font-semibold active:opacity-90 transition-opacity"
          >
            {lang === 'ru' ? 'Продолжить' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
