'use client';

import { useState } from 'react';
import { TextMorph } from '@royui/ui';

const prices = {
  USD: '$99/mo',
  EUR: '€89/mo',
  GBP: '£69/mo',
} as const;

type Currency = keyof typeof prices;

export function TextMorphCurrencyDemo() {
  const [cur, setCur] = useState<Currency>('USD');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div className="morph-demo-toggle" role="tablist">
        {(Object.keys(prices) as Currency[]).map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cur === c}
            onClick={() => setCur(c)}
            className={`morph-demo-toggle__btn ${cur === c ? 'is-active' : ''}`}
          >
            {c}
          </button>
        ))}
      </div>
      <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.96)' }}>
        <TextMorph value={prices[cur]} />
      </span>
    </div>
  );
}
