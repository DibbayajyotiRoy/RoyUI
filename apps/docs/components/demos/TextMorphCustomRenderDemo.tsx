'use client';

import { useState } from 'react';
import { TextMorph } from '@roy-ui/ui';

const cmds = {
  pnpm: 'pnpm add @roy-ui/ui',
  npm: 'npm install @roy-ui/ui',
  yarn: 'yarn add @roy-ui/ui',
  bun: 'bun add @roy-ui/ui',
} as const;

type Pm = keyof typeof cmds;

export function TextMorphCustomRenderDemo() {
  const [pm, setPm] = useState<Pm>('pnpm');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
      <div className="morph-demo-toggle" role="tablist">
        {(Object.keys(cmds) as Pm[]).map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={pm === p}
            onClick={() => setPm(p)}
            className={`morph-demo-toggle__btn ${pm === p ? 'is-active' : ''}`}
          >
            {p}
          </button>
        ))}
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15 }}>
        <TextMorph
          value={cmds[pm]}
          renderText={(text) => {
            const parts = text.split(' ');
            return (
              <>
                {parts.map((part, i, arr) => {
                  const color =
                    i === 0
                      ? '#d2a8ff'
                      : i === 1
                        ? 'rgba(255,255,255,0.55)'
                        : '#79c0ff';
                  return (
                    <span key={i} style={{ color }}>
                      {part}
                      {i < arr.length - 1 ? ' ' : ''}
                    </span>
                  );
                })}
              </>
            );
          }}
        />
      </span>
    </div>
  );
}
