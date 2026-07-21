'use client';

import {
  forwardRef,
  useEffect,
  useState,
  type HTMLAttributes,
} from 'react';
import './ProgressPill.css';

export type ProgressPillTone = 'danger' | 'warning' | 'neutral' | 'success' | 'info';

export interface ProgressPillProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Pill text, e.g. "Deleting…", "Deploying…", "Synced". */
  label: string;
  /** Color tone of the pill. Defaults to "neutral". */
  tone?: ProgressPillTone;
  /** Drives the spinner glyph + shimmer sweep. false renders a settled, calm pill. Defaults to true. */
  active?: boolean;
  /** Secondary muted line under the pill describing the current step. */
  caption?: string | null;
  /** Native tooltip. Defaults to caption ?? label. */
  title?: string;
}

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const FRAME_MS = 80;

/**
 * Braille spinner that only animates client-side (SSR renders the first
 * frame) and falls back to a static ellipsis under prefers-reduced-motion.
 */
function useSpinnerGlyph(active: boolean): string {
  const [frame, setFrame] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

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

export const ProgressPill = forwardRef<HTMLDivElement, ProgressPillProps>(
  (
    {
      label,
      tone = 'neutral',
      active = true,
      caption = null,
      title,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const glyph = useSpinnerGlyph(active);

    const classes = ['royui-progresspill', className].filter(Boolean).join(' ');
    const pillClasses = [
      'royui-progresspill__pill',
      `royui-progresspill__pill--${tone}`,
      active ? 'royui-progresspill__pill--active' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        title={title ?? caption ?? label}
        role="status"
        aria-live={active ? 'polite' : 'off'}
        {...rest}
      >
        <span className={pillClasses}>
          {active && (
            <span className="royui-progresspill__glyph" aria-hidden="true">
              {glyph}
            </span>
          )}
          <span className="royui-progresspill__label">{label}</span>
        </span>
        {caption != null && caption !== '' && (
          <span className="royui-progresspill__caption" key={caption}>
            {caption}
          </span>
        )}
      </div>
    );
  },
);

ProgressPill.displayName = 'ProgressPill';
