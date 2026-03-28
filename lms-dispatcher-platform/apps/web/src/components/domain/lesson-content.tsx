'use client';
import type { TextContent, VideoContent, DialogueContent, CaseContent } from '@/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type Content = TextContent | VideoContent | DialogueContent | CaseContent | undefined;

export function LessonContent({ content }: { content: Content }) {
  if (!content) return <p className="text-gray-400 italic">No content yet.</p>;

  switch (content.type) {
    case 'text':     return <TextRenderer c={content} />;
    case 'video':    return <VideoRenderer c={content} />;
    case 'dialogue': return <DialogueRenderer c={content} />;
    case 'case':     return <CaseRenderer c={content} />;
    default:         return null;
  }
}

function TextRenderer({ c }: { c: TextContent }) {
  return (
    <div
      className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: c.body }}
    />
  );
}

function VideoRenderer({ c }: { c: VideoContent }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-black aspect-video">
      <video
        className="w-full h-full object-contain"
        controls
        playsInline
        poster={c.posterUrl}
        preload="metadata"
      >
        <source src={c.hlsUrl} type="application/vnd.apple.mpegurl" />
      </video>
    </div>
  );
}

function DialogueRenderer({ c }: { c: DialogueContent }) {
  return (
    <div className="space-y-3">
      {c.messages.map((m, i) => {
        const isDispatcher = m.role === 'dispatcher';
        return (
          <div key={i} className={cn('flex', isDispatcher ? 'justify-end' : 'justify-start')}>
            {!isDispatcher && (
              <span className="text-xs text-gray-400 uppercase font-medium self-end mb-1 mr-2">
                {m.role}
              </span>
            )}
            <div className={cn(
              'max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
              isDispatcher
                ? 'bg-brand-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm',
            )}>
              {m.text}
            </div>
            {isDispatcher && (
              <span className="text-xs text-gray-400 uppercase font-medium self-end mb-1 ml-2">
                you
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CaseRenderer({ c }: { c: CaseContent }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm font-medium text-amber-800 mb-1">📋 Scenario</p>
        <p className="text-gray-800 leading-relaxed">{c.scenario}</p>
      </div>

      <p className="font-semibold text-gray-700">What would you do?</p>
      <div className="space-y-2">
        {c.options.map((opt, i) => {
          const isChosen  = selected === i;
          const isCorrect = i === c.correctIndex;
          const showResult = selected !== null;

          return (
            <button
              key={i}
              onClick={() => selected === null && setSelected(i)}
              disabled={selected !== null}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all',
                !showResult && 'border-gray-200 active:border-brand-400',
                showResult && isCorrect && 'border-green-500 bg-green-50',
                showResult && isChosen && !isCorrect && 'border-red-400 bg-red-50',
                showResult && !isChosen && !isCorrect && 'border-gray-100 opacity-60',
              )}
            >
              <p className="font-medium text-gray-800">{opt.label}</p>
              {showResult && (isChosen || isCorrect) && (
                <p className="text-sm mt-1 text-gray-600">{opt.explanation}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
