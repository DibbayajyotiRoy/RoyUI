'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import {
  WaveDots,
  splitTrailingEllipsis,
  useSpinnerGlyph,
} from '../_internal/progress-shared';
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
    const { base, dots } = splitTrailingEllipsis(label);

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
          <span className="royui-progresspill__label">
            {dots ? (
              <>
                {base}
                <WaveDots animate={active} />
                {/* Announce the full label; the wave dots are decorative. */}
                <span className="royui-progresspill__sr">…</span>
              </>
            ) : (
              label
            )}
          </span>
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
