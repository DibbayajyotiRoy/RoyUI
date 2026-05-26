'use client';

import type { CSSProperties } from 'react';

export interface SpinnerProps {
  size?: number;
  strokeWidth?: number;
  label?: string;
  style?: CSSProperties;
  className?: string;
}

export function Spinner({
  size = 16,
  strokeWidth = 2,
  label = 'Loading',
  style,
  className = '',
}: SpinnerProps) {
  const r = (size - strokeWidth) / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <span
      role="status"
      aria-label={label}
      className={['royui-spinner', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size, ...style }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.18}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.72}
          transform={`rotate(-90 ${c} ${c})`}
        />
      </svg>
    </span>
  );
}
