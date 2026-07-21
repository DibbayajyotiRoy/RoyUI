'use client';

import { useEffect, useRef, useState } from 'react';
import { ProgressPill, type ProgressPillTone } from '@roy-ui/ui';

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: 16,
};

/** All five tones, active, side by side. */
export function ProgressPillTonesDemo() {
  const tones: { tone: ProgressPillTone; label: string }[] = [
    { tone: 'danger', label: 'Deleting…' },
    { tone: 'warning', label: 'Retrying…' },
    { tone: 'neutral', label: 'Queued…' },
    { tone: 'success', label: 'Finishing…' },
    { tone: 'info', label: 'Syncing…' },
  ];
  return (
    <div style={row}>
      {tones.map((t) => (
        <ProgressPill key={t.tone} label={t.label} tone={t.tone} />
      ))}
    </div>
  );
}

/** Settled pills — active={false}, no spinner, no shimmer. */
export function ProgressPillSettledDemo() {
  return (
    <div style={row}>
      <ProgressPill label="Completed" tone="success" active={false} />
      <ProgressPill label="Failed" tone="danger" active={false} />
      <ProgressPill label="Partially failed — retry" tone="warning" active={false} />
      <ProgressPill label="Deleted — purge in 29d" tone="neutral" active={false} />
    </div>
  );
}

const DEPLOY_STEPS = [
  'Building application',
  'Running checks',
  'Uploading assets',
  'Assigning domains',
];

/** A simulated deploy: caption walks through steps, then the pill settles. */
export function ProgressPillLiveDemo() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(true);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = window.setInterval(() => {
      setStep((s) => {
        if (s >= DEPLOY_STEPS.length - 1) {
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, 1600);
    return () => {
      if (timer.current != null) window.clearInterval(timer.current);
    };
  }, [running]);

  const restart = () => {
    setStep(0);
    setRunning(true);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
      {running ? (
        <ProgressPill label="Deploying…" tone="info" caption={DEPLOY_STEPS[step]} />
      ) : (
        <ProgressPill label="Deployed" tone="success" active={false} caption="Live at royui.dibbayajyoti.com" />
      )}
      <button
        type="button"
        onClick={restart}
        disabled={running}
        style={{
          padding: '4px 12px',
          borderRadius: 6,
          border: '1px solid rgba(128,128,128,0.35)',
          background: 'transparent',
          color: 'inherit',
          fontSize: 12,
          cursor: running ? 'default' : 'pointer',
          opacity: running ? 0.5 : 1,
        }}
      >
        Run again
      </button>
    </div>
  );
}
