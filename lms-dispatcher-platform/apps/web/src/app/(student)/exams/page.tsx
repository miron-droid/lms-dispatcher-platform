'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dailyExamsApi, type ExamQuestion } from '@/lib/api/daily-exams';
import { useLang } from '@/lib/i18n/lang-context';
import { useState } from 'react';
import { Lock, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExamsPage() {
  const { lang } = useLang();
  const { data, isLoading } = useQuery({ queryKey: ['daily-exams'], queryFn: dailyExamsApi.getExams });
  const [activeExam, setActiveExam] = useState<number | null>(null);

  if (isLoading) return <div className="px-4 pt-14 lg:pt-6 pb-24 max-w-lg mx-auto animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-[#2c2c2e] rounded-2xl" />)}</div>;

  if (!data?.unlocked) {
    return (
      <div className="px-4 pt-14 lg:pt-6 pb-24 max-w-lg mx-auto text-center">
        <div className="card p-8">
          <Lock className="w-12 h-12 text-gray-300 dark:text-[#636366] mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#f5f5f7]">{lang === 'ru' ? 'Экзамены закрыты' : 'Exams Locked'}</h2>
          <p className="text-sm text-gray-500 dark:text-[#a1a1a6] mt-2">
            {lang === 'ru'
              ? `Пройдите все 9 глав чтобы открыть экзамены. Пройдено: ${data?.completedChapters ?? 0}/9`
              : `Complete all 9 chapters to unlock exams. Progress: ${data?.completedChapters ?? 0}/9`}
          </p>
        </div>
      </div>
    );
  }

  if (activeExam) {
    return <ExamSession examNumber={activeExam} onBack={() => setActiveExam(null)} />;
  }

  return (
    <div className="px-4 pt-14 lg:pt-6 pb-24 max-w-lg lg:max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7] mb-1">{lang === 'ru' ? 'Ежедневные экзамены' : 'Daily Exams'}</h1>
      <p className="text-sm text-gray-400 dark:text-[#636366] mb-5">
        {data.passed}/{data.total} {lang === 'ru' ? 'сдано' : 'passed'} · {data.available} {lang === 'ru' ? 'доступно' : 'available'}
      </p>

      <div className="h-2 bg-gray-100 dark:bg-[#2c2c2e] rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${((data.passed ?? 0) / (data.total ?? 20)) * 100}%` }} />
      </div>

      <div className="space-y-2">
        {Array.from({ length: data.total ?? 20 }, (_, i) => {
          const num = i + 1;
          const exam = data.exams.find(e => e.examNumber === num);
          const available = exam != null;
          const completed = exam?.completedAt != null;
          const passed = exam?.passed === true;
          const locked = !available;

          return (
            <button
              key={num}
              onClick={() => available && !completed && setActiveExam(num)}
              disabled={locked || completed}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left',
                completed && passed && 'bg-emerald-50/50 border-emerald-200',
                completed && !passed && 'bg-red-50/50 border-red-200',
                available && !completed && 'bg-white dark:bg-[#2c2c2e] border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-300 hover:shadow-sm cursor-pointer',
                locked && 'bg-gray-50 dark:bg-[#1c1c1e] border-gray-100 dark:border-[rgba(255,255,255,0.06)] opacity-50 cursor-default',
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                completed && passed && 'bg-emerald-100',
                completed && !passed && 'bg-red-100',
                available && !completed && 'bg-blue-100',
                locked && 'bg-gray-100 dark:bg-[#2c2c2e]',
              )}>
                {completed ? (
                  passed ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Circle className="w-5 h-5 text-red-500" />
                ) : locked ? (
                  <Lock className="w-4 h-4 text-gray-400 dark:text-[#636366]" />
                ) : (
                  <span className="text-sm font-bold text-blue-600 font-mono">{num}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-[#f5f5f7]">{lang === 'ru' ? 'Экзамен' : 'Exam'} #{num}</p>
                <p className="text-xs text-gray-400 dark:text-[#636366]">
                  {completed ? `${lang === 'ru' ? 'Результат' : 'Score'}: ${exam?.score}%` : locked ? (lang === 'ru' ? 'Откроется скоро' : 'Unlocks soon') : `15 ${lang === 'ru' ? 'вопросов' : 'questions'}`}
                </p>
              </div>
              {available && !completed && <ChevronRight className="w-4 h-4 text-gray-300 dark:text-[#636366]" />}
              {completed && <span className={cn('text-sm font-bold font-mono', passed ? 'text-emerald-600' : 'text-red-500')}>{exam?.score}%</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExamSession({ examNumber, onBack }: { examNumber: number; onBack: () => void }) {
  const { lang } = useLang();
  const qc = useQueryClient();
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['exam-questions', examNumber],
    queryFn: () => dailyExamsApi.getQuestions(examNumber),
  });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  const submitExam = useMutation({
    mutationFn: () => {
      const formatted = questions.map(q => ({ questionId: q.id, selectedOptionIds: answers[q.id] ?? [] }));
      return dailyExamsApi.submit(examNumber, formatted);
    },
    onSuccess: (data) => { setResult(data); qc.invalidateQueries({ queryKey: ['daily-exams'] }); },
  });

  if (isLoading) return <div className="p-8 text-center animate-pulse"><div className="h-8 bg-gray-100 dark:bg-[#2c2c2e] rounded-xl w-48 mx-auto" /></div>;

  if (result) {
    return (
      <div className="px-4 pt-14 lg:pt-6 pb-24 max-w-lg mx-auto text-center">
        <div className="card p-8">
          <p className="text-5xl mb-4">{result.passed ? '🎉' : '📚'}</p>
          <p className="text-3xl font-bold font-mono text-gray-900 dark:text-[#f5f5f7]">{result.score}%</p>
          <p className={cn('text-sm font-semibold mt-2', result.passed ? 'text-emerald-600' : 'text-red-500')}>
            {result.passed ? (lang === 'ru' ? 'Сдано!' : 'Passed!') : (lang === 'ru' ? 'Не сдано' : 'Not passed')}
          </p>
          <button onClick={onBack} className="btn-primary mt-6">{lang === 'ru' ? 'К экзаменам' : 'Back to Exams'}</button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  if (!q) return null;
  const selected = answers[q.id] ?? [];
  const isLast = current === questions.length - 1;

  return (
    <div className="px-4 pt-14 lg:pt-6 pb-24 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-sm text-gray-500 dark:text-[#a1a1a6] cursor-pointer">{lang === 'ru' ? '← Назад' : '← Back'}</button>
        <span className="text-xs font-mono text-gray-400 dark:text-[#636366]">{current + 1}/{questions.length}</span>
      </div>
      <div className="h-1 bg-gray-100 dark:bg-[#2c2c2e] rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>
      <p className="text-gray-900 dark:text-[#f5f5f7] font-semibold mb-4">{q.text}</p>
      <div className="space-y-2 mb-6">
        {q.options.map(opt => {
          const isSelected = selected.includes(opt.id);
          return (
            <button key={opt.id} onClick={() => {
              if (q.isMultiple) setAnswers(a => ({ ...a, [q.id]: isSelected ? selected.filter(x => x !== opt.id) : [...selected, opt.id] }));
              else setAnswers(a => ({ ...a, [q.id]: [opt.id] }));
            }} className={cn('w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm cursor-pointer', isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-gray-300 dark:hover:border-[#636366]')}>
              {opt.text}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        {current > 0 && <button onClick={() => setCurrent(c => c - 1)} className="btn-ghost border border-gray-200 dark:border-[rgba(255,255,255,0.08)] flex-1 cursor-pointer">{lang === 'ru' ? 'Назад' : 'Back'}</button>}
        {isLast ? (
          <button onClick={() => submitExam.mutate()} disabled={submitExam.isPending} className="btn-primary flex-1">{submitExam.isPending ? '...' : (lang === 'ru' ? 'Завершить' : 'Submit')}</button>
        ) : (
          <button onClick={() => setCurrent(c => c + 1)} className="btn-primary flex-1 cursor-pointer">{lang === 'ru' ? 'Далее' : 'Next'}</button>
        )}
      </div>
    </div>
  );
}
