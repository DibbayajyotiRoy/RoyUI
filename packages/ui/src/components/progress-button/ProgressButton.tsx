'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import {
  WaveDots,
  splitTrailingEllipsis,
  useSpinnerGlyph,
} from '../_internal/progress-shared';
import { useShake } from '../_internal/field-shared';
import './ProgressButton.css';

export type ProgressButtonStatus = 'idle' | 'progress' | 'success' | 'error';
export type ProgressButtonTone = 'danger' | 'warning' | 'neutral' | 'success' | 'info';

export interface ProgressButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'> {
  /** Idle button content, e.g. "Deploy". */
  children: ReactNode;
  /** Async work started on click. Resolve → success flag, reject → error flag. */
  onAction?: () => void | Promise<unknown>;
  /** Text shown while the action runs. A trailing "…" becomes wave dots. Defaults to "Working…". */
  progressLabel?: string;
  /** Text shown with the check when the action resolves. Defaults to "Done". */
  successLabel?: string;
  /** Text shown with the cross when the action rejects. Defaults to "Failed". */
  errorLabel?: string;
  /** How long the success/error flag stays before reverting to idle, in ms. Defaults to 2000. */
  resultDuration?: number;
  /** Tone of the in-progress state. Defaults to "info". */
  tone?: ProgressButtonTone;
  /** Controlled status. When set, clicks only call onAction — you drive the states. */
  status?: ProgressButtonStatus;
  /**
   * After the flag reverts to idle, keep a subtle tint of the last outcome
   * (green edge after success, red after failure) so a button that has run
   * looks different from one that hasn't. Defaults to true.
   */
  rememberOutcome?: boolean;
}

/** Actions that finish instantly still show progress this long, so the state never flashes. */
const MIN_PROGRESS_MS = 400;

/* Success badge: the circle draws first, then the tick draws inside it with
   a small pop. Both are dash-drawn strokes sequenced in CSS. */
const CheckIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    fill="none"
    aria-hidden="true"
    className="royui-progressbtn__checkicon"
  >
    <circle
      cx="8"
      cy="8"
      r="6.6"
      stroke="currentColor"
      strokeWidth="1.4"
      className="royui-progressbtn__checkcircle"
    />
    <path
      d="M5.1 8.4l2.1 2.1 3.8-4.6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="royui-progressbtn__checkpath"
    />
  </svg>
);

/* Error badge: circle + dash-drawn cross; the button itself shakes once. */
const CrossIcon = () => (
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    fill="none"
    aria-hidden="true"
    className="royui-progressbtn__crossicon"
  >
    <circle
      cx="8"
      cy="8"
      r="6.6"
      stroke="currentColor"
      strokeWidth="1.4"
      className="royui-progressbtn__crosscircle"
    />
    <path
      d="M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className="royui-progressbtn__crosspath"
    />
  </svg>
);

export const ProgressButton = forwardRef<HTMLButtonElement, ProgressButtonProps>(
  (
    {
      children,
      onAction,
      progressLabel = 'Working…',
      successLabel = 'Done',
      errorLabel = 'Failed',
      resultDuration = 2000,
      tone = 'info',
      status: controlledStatus,
      rememberOutcome = true,
      className = '',
      disabled,
      ...rest
    },
    ref,
  ) => {
    const [internalStatus, setInternalStatus] = useState<ProgressButtonStatus>('idle');
    const [lastOutcome, setLastOutcome] = useState<'success' | 'error' | null>(null);
    const status = controlledStatus ?? internalStatus;
    const busy = status !== 'idle';

    const glyph = useSpinnerGlyph(status === 'progress');
    const { base, dots } = splitTrailingEllipsis(progressLabel);
    // Same one-shot vibration the form fields use when they enter an error.
    const shake = useShake(status === 'error');

    const revertTimer = useRef<number | null>(null);
    const mounted = useRef(true);
    useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
        if (revertTimer.current != null) window.clearTimeout(revertTimer.current);
      };
    }, []);

    const settle = useCallback(
      (outcome: 'success' | 'error') => {
        if (!mounted.current) return;
        setInternalStatus(outcome);
        setLastOutcome(outcome);
        revertTimer.current = window.setTimeout(() => {
          if (mounted.current) setInternalStatus('idle');
        }, resultDuration);
      },
      [resultDuration],
    );

    const handleClick = useCallback(async () => {
      if (busy) return;
      if (controlledStatus !== undefined) {
        void onAction?.();
        return;
      }
      setInternalStatus('progress');
      const started = performance.now();
      let outcome: 'success' | 'error' = 'success';
      try {
        await onAction?.();
      } catch {
        outcome = 'error';
      }
      const wait = Math.max(0, MIN_PROGRESS_MS - (performance.now() - started));
      window.setTimeout(() => settle(outcome), wait);
    }, [busy, controlledStatus, onAction, settle]);

    const classes = [
      'royui-progressbtn',
      `royui-progressbtn--${status}`,
      status === 'progress' ? `royui-progressbtn--tone-${tone}` : '',
      status === 'idle' && rememberOutcome && lastOutcome
        ? `royui-progressbtn--ran-${lastOutcome}`
        : '',
      shake ? 'royui-progressbtn--shake' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        className={classes}
        onClick={handleClick}
        disabled={disabled || busy}
        aria-live="polite"
        aria-busy={status === 'progress'}
        {...rest}
      >
        {/* All states stacked on one grid cell: constant width, no layout jump,
            and pure opacity/blur/transform crossfades between them. */}
        <span className="royui-progressbtn__stack">
          <span
            className="royui-progressbtn__layer"
            data-current={status === 'idle' || undefined}
            aria-hidden={status !== 'idle'}
          >
            {children}
          </span>
          <span
            className="royui-progressbtn__layer"
            data-current={status === 'progress' || undefined}
            aria-hidden={status !== 'progress'}
          >
            <span className="royui-progressbtn__glyph" aria-hidden="true">
              {glyph}
            </span>
            {dots ? (
              <>
                {base}
                <WaveDots animate={status === 'progress'} />
              </>
            ) : (
              progressLabel
            )}
          </span>
          <span
            className="royui-progressbtn__layer"
            data-current={status === 'success' || undefined}
            aria-hidden={status !== 'success'}
          >
            <CheckIcon />
            {successLabel}
          </span>
          <span
            className="royui-progressbtn__layer"
            data-current={status === 'error' || undefined}
            aria-hidden={status !== 'error'}
          >
            <CrossIcon />
            {errorLabel}
          </span>
        </span>
      </button>
    );
  },
);

ProgressButton.displayName = 'ProgressButton';
