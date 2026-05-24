'use client';

import { useState } from 'react';
import { TextMorph } from '@royui/ui';

const lines = {
  casual: "Hey, glad you're here.",
  formal: "Welcome, we're delighted to see you.",
} as const;

export function TextMorphToneDemo() {
  const [tone, setTone] = useState<'casual' | 'formal'>('casual');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
      <div className="morph-demo-toggle" role="tablist">
        {(['casual', 'formal'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tone === t}
            onClick={() => setTone(t)}
            className={`morph-demo-toggle__btn ${tone === t ? 'is-active' : ''}`}
          >
            {t}
          </button>
        ))}
      </div>
      <span style={{ fontSize: 19, fontWeight: 500, color: 'rgba(255,255,255,0.95)' }}>
        <TextMorph value={lines[tone]} />
      </span>
    </div>
  );
}
