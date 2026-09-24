'use client';

import { useRef } from 'react';
import { ClickSpark } from '@roy-ui/ui';

const area: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  padding: 24,
  borderRadius: 12,
  border: '1px dashed rgba(140, 146, 158, 0.35)',
  minHeight: 120,
};

const btn: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 8,
  border: '1px solid rgba(140, 146, 158, 0.35)',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  cursor: 'pointer',
};

/** Sparks scoped to one area via `target`. */
export function ClickSparkScopedDemo() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} style={area}>
      <ClickSpark target={ref} />
      <button type="button" style={btn}>Save</button>
      <button type="button" style={btn}>Share</button>
      <button type="button" style={btn}>Archive</button>
      <span style={{ opacity: 0.6, fontSize: 13 }}>Click anywhere in this box</span>
    </div>
  );
}

/** Colour, ray count and spread variations side by side. */
export function ClickSparkVariantsDemo() {
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const c = useRef<HTMLDivElement>(null);
  const cell: React.CSSProperties = { ...area, flex: '1 1 160px', minHeight: 100 };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, width: '100%' }}>
      <div ref={a} style={cell}>
        <ClickSpark target={a} color="#f59e0b" rays={8} />
        <span style={{ fontSize: 13 }}>Amber, 8 rays</span>
      </div>
      <div ref={b} style={cell}>
        <ClickSpark target={b} color="#60a5fa" rays={12} size={10} spread={14} thickness={1.5} />
        <span style={{ fontSize: 13 }}>Blue, 12 long rays</span>
      </div>
      <div ref={c} style={cell}>
        <ClickSpark target={c} color="#f472b6" rays={4} duration={900} jitter={false} />
        <span style={{ fontSize: 13 }}>Pink, slow, no jitter</span>
      </div>
    </div>
  );
}

/** Catalog card preview. */
export function ClickSparkPreview({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      style={{
        ...area,
        border: 'none',
        padding: compact ? 12 : 24,
        minHeight: compact ? 80 : 120,
        width: '100%',
      }}
    >
      <ClickSpark target={ref} rays={compact ? 6 : 8} />
      <button type="button" style={btn}>Click me</button>
    </div>
  );
}
