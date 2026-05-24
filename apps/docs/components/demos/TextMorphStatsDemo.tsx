'use client';

import { useState } from 'react';
import { TextMorph } from '@royui/ui';

const counts = {
  today: '1,287 signups',
  week: '12,431 signups',
  month: '50,892 signups',
} as const;

type Period = keyof typeof counts;

export function TextMorphStatsDemo() {
  const [period, setPeriod] = useState<Period>('today');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div className="morph-demo-toggle" role="tablist">
        {(Object.keys(counts) as Period[]).map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={period === p}
            onClick={() => setPeriod(p)}
            className={`morph-demo-toggle__btn ${period === p ? 'is-active' : ''}`}
          >
            {p}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            marginBottom: 6,
            fontFamily: 'var(--font-mono)',
          }}
        >
          new signups
        </div>
        <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.96)' }}>
          <TextMorph value={counts[period]} />
        </span>
      </div>
    </div>
  );
}
