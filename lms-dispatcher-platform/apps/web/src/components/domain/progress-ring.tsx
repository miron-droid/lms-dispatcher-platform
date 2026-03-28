interface Props { percent: number; size?: number }

export function ProgressRing({ percent, size = 56 }: Props) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={6} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke="#2563eb" strokeWidth={6}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
        {percent}%
      </span>
    </div>
  );
}
