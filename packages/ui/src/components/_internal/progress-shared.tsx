'use client';

// Shared, INTERNAL-only progress chrome for ProgressPill / ProgressButton.
// Not a published subpath (no index.ts in this folder), so tsup folds it into
// a shared chunk instead of duplicating the spinner + wave-dots logic.

import { useEffect, useState } from 'react';
import './progress-shared.css';

export const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const FRAME_MS = 80;

/** Tracks prefers-reduced-motion, false during SSR. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Braille spinner that only animates client-side (SSR renders the first
 * frame) and falls back to a static ellipsis under prefers-reduced-motion.
 */
export function useSpinnerGlyph(active: boolean): string {
  const [frame, setFrame] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced) return;
    const id = window.setInterval(
      () => setFrame((f) => (f + 1) % SPINNER_FRAMES.length),
      FRAME_MS,
    );
    return () => window.clearInterval(id);
  }, [active, reduced]);

  return reduced ? '…' : (SPINNER_FRAMES[frame] ?? '⠋');
}

/**
 * Splits a trailing "…" or "..." off a label so it can be rendered as
 * animated wave dots. Returns the base text and whether dots were found.
 */
export function splitTrailingEllipsis(label: string): { base: string; dots: boolean } {
  if (label.endsWith('...')) return { base: label.slice(0, -3), dots: true };
  if (label.endsWith('…')) return { base: label.slice(0, -1), dots: true };
  return { base: label, dots: false };
}

/**
 * Three dots bobbing in a staggered wave — one up while the others are down.
 * Static under prefers-reduced-motion or when `animate` is false.
 */
export function WaveDots({ animate = true }: { animate?: boolean }) {
  return (
    <span
      className={
        animate ? 'royui-wavedots royui-wavedots--live' : 'royui-wavedots'
      }
      aria-hidden="true"
    >
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </span>
  );
}
