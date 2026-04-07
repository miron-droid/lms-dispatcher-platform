'use client';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textSize?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ size = 40, className = '', showText = true, textSize = 'md' }: LogoProps) {
  const textSizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl', xl: 'text-4xl' };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoIcon size={size} />
      {showText && (
        <span className={`font-extrabold tracking-tight ${textSizes[textSize]}`}>
          <span className="text-[#1a3a5c]">Dispatch</span>
          <span className="text-[#22c55e]">GO</span>
        </span>
      )}
    </div>
  );
}

export function LogoIcon({ size = 40 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="DispatchGO"
      width={size}
      height={size}
      className="shrink-0 object-contain"
      priority
    />
  );
}
