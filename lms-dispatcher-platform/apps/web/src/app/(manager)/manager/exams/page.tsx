'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi } from '@/lib/api/exams';
import { useState } from 'react';
import type { ExamDecision } from '@/types';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n/lang-context';
import { CheckCircle2, RotateCcw, XCircle, MessageSquare } from 'lucide-react';

export default function ManagerExamsPage() {
  const qc = useQueryClient();
  const { t, lang, translateTitle } = useLang();
  const { data: exams = [], isLoading } = useQuery({
    queryKey: ['pending-exams'],
    queryFn: examsApi.pending,
  });

  const [reviewing, setReviewing] = useState<string | null>(null);
  const [decision, setDecision] = useState<ExamDecision>('PASS');
  const [comment, setComment] = useState('');

  const review = useMutation({
    mutationFn: () => examsApi.review(reviewing!, decision, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pending-exams'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setReviewing(null);
      setComment('');
    },
  });

  const DECISIONS: { value: ExamDecision; label: string; desc: string; color: string; icon: any }[] = [
    { value: 'PASS',    label: lang === 'ru' ? 'Сдал' : 'Pass',       desc: lang === 'ru' ? 'Открыть следующую главу' : 'Unlock next chapter', color: 'border-emerald-500 bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
    { value: 'RETRY',   label: lang === 'ru' ? 'Повтор' : 'Retry',     desc: lang === 'ru' ? 'Пересдать экзамен' : 'Retake exam',              color: 'border-amber-500 bg-amber-50 text-amber-700', icon: RotateCcw },
    { value: 'DISBAND', label: lang === 'ru' ? 'Отчислить' : 'Disband', desc: lang === 'ru' ? 'Деактивировать аккаунт' : 'Deactivate account',  color: 'border-red-500 bg-red-50 text-red-700', icon: XCircle },
  ];

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-3 animate-pulse">
        {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-100 dark:bg-[#2c2c2e] rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-6 pb-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-[#f5f5f7]">
          {lang === 'ru' ? 'Экзамены' : 'Exams'}
        </h1>
        <p className="text-sm text-gray-400 dark:text-[#636366]">
          {exams.length} {lang === 'ru' ? 'ожидают проверки' : 'pending review'}
        </p>
      </div>

      <div className="space-y-3">
        {exams.map((exam) => (
          <div key={exam.id} className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center text-sm font-bold text-blue-700">
                {exam.student?.firstName?.charAt(0)}{exam.student?.lastName?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-[#f5f5f7]">
                  {exam.student?.firstName} {exam.student?.lastName}
                </p>
                <p className="text-xs text-gray-400 dark:text-[#636366]">{translateTitle(exam.chapter?.title ?? '')}</p>
              </div>
              <span className="text-[10px] font-mono text-gray-400 dark:text-[#636366]">
                {new Date(exam.createdAt).toLocaleDateString()}
              </span>
            </div>

            {reviewing === exam.id ? (
              <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
                {/* Decision buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {DECISIONS.map(d => {
                    const Icon = d.icon;
                    return (
                      <button
                        key={d.value}
                        onClick={() => setDecision(d.value)}
                        className={cn(
                          'py-3 rounded-xl border-2 text-center transition-all cursor-pointer',
                          decision === d.value ? d.color : 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] text-gray-400 dark:text-[#636366] hover:border-gray-300 dark:hover:border-[#636366]',
                        )}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <p className="text-xs font-semibold">{d.label}</p>
                        <p className="text-[9px] opacity-60 mt-0.5">{d.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Comment */}
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-300 dark:text-[#636366]" />
                  <textarea
                    className="input pl-10 resize-none"
                    rows={3}
                    placeholder={lang === 'ru' ? 'Комментарий (мин. 10 символов)...' : 'Comment (min 10 chars)...'}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    className="btn-primary flex-1"
                    onClick={() => review.mutate()}
                    disabled={comment.length < 10 || review.isPending}
                  >
                    {review.isPending ? '...' : (lang === 'ru' ? 'Отправить' : 'Submit')}
                  </button>
                  <button className="btn-ghost border border-gray-200 dark:border-[rgba(255,255,255,0.08)] px-4" onClick={() => { setReviewing(null); setComment(''); }}>
                    {lang === 'ru' ? 'Отмена' : 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="btn-secondary text-sm"
                onClick={() => { setReviewing(exam.id); setDecision('PASS'); }}
              >
                {lang === 'ru' ? 'Проверить' : 'Review'}
              </button>
            )}
          </div>
        ))}

        {exams.length === 0 && (
          <div className="text-center py-16">
            <GradCap />
            <p className="text-gray-400 dark:text-[#636366] mt-3 text-sm">
              {lang === 'ru' ? 'Нет экзаменов на проверке' : 'No pending exams'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function GradCap() {
  return (
    <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-[#2c2c2e] rounded-2xl flex items-center justify-center">
      <span className="text-3xl">🎓</span>
    </div>
  );
}
