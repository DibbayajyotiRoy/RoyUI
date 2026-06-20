'use client';

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import './Input.css';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  /** The label that rests over the field and lifts on focus / when filled. (required) */
  label: string;
  /** Leading glyph in a fixed 20px box, e.g. an "@". Greyed at rest, tints to the accent on focus. */
  icon?: ReactNode;
  /** Quiet line beneath the field. An error / success *string* replaces it; a boolean only recolours it. */
  helperText?: ReactNode;
  /** Faint hint revealed only once the label has floated up (on focus) — never doubled up with the label. */
  placeholder?: string;
  /** Error state. A string also becomes the helper line; the field shakes once on entry and turns red. */
  error?: boolean | string;
  /** Success state (outranked by error). A string becomes the helper line; a check draws in at the trailing edge. */
  success?: boolean | string;
  /** Async-pending state for live checks (e.g. username availability). Spins a glyph at the trailing edge. */
  loading?: boolean;
  /** Colour scheme. 'auto' (default) follows the system; 'light' / 'dark' force one. */
  theme?: 'light' | 'dark' | 'auto';
  /** Extra classes on the root wrapper. Every other native <input> attribute spreads onto the input itself. */
  className?: string;
}

/** Info "i" for the resting helper line. aria-hidden — the text carries the meaning. */
const InfoIcon = () => (
  <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 7.2v3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="5" r="0.95" fill="currentColor" />
  </svg>
);

/** Warning triangle for the error line. */
const WarnIcon = () => (
  <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" aria-hidden="true">
    <path
      d="M8 2.2l6 10.4H2L8 2.2z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M8 6.4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11" r="0.9" fill="currentColor" />
  </svg>
);

/** Check mark. Reused by the helper line (static) and the trailing badge, where
 *  CSS draws this same path in via a stroke-dash sweep. */
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
    <path
      d="M4.5 12.5l4.6 4.6L19.5 6.8"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Trailing spinner for the pending/checking state. CSS spins the whole svg. */
const SpinnerIcon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.4" />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon,
      helperText,
      placeholder,
      error = false,
      success = false,
      loading = false,
      theme = 'auto',
      className = '',
      id,
      disabled,
      ...rest
    },
    ref,
  ) => {
    // A stable id ties the <label> to the <input> (and the input to its message).
    // A caller-supplied id always wins so it stays controllable from outside.
    const reactId = useId();
    const inputId = id ?? `royui-input-${reactId}`;
    const messageId = `${inputId}-message`;

    const isError = Boolean(error);
    // Error outranks success — a field can't be both wrong and right at once.
    const isSuccess = Boolean(success) && !isError;
    // The trailing slot shows a spinner while checking, otherwise the success check.
    const showSpinner = loading && !isError;
    const showCheck = isSuccess && !loading;
    const hasTrailing = showSpinner || showCheck;

    // Shake once each time the field *enters* the error state — not on every
    // render while it stays errored, and never when it mounts already valid.
    const [shake, setShake] = useState(false);
    const wasError = useRef(false);
    useEffect(() => {
      if (!isError) {
        wasError.current = false;
        return;
      }
      if (wasError.current) return;
      wasError.current = true;
      setShake(true);
      const t = setTimeout(() => setShake(false), 420);
      return () => clearTimeout(t);
    }, [isError]);

    // The message line: an explicit error / success *string* wins over helperText;
    // a boolean error / success keeps the helper text and only recolours the row.
    const message =
      (typeof error === 'string' && error) ||
      (typeof success === 'string' && success) ||
      helperText ||
      null;

    const classes = [
      'royui-input',
      icon != null ? 'royui-input--with-icon' : '',
      isError ? 'royui-input--error' : '',
      isSuccess ? 'royui-input--success' : '',
      hasTrailing ? 'royui-input--trailing' : '',
      disabled ? 'royui-input--disabled' : '',
      shake ? 'royui-input--shake' : '',
      theme === 'dark' ? 'royui-input--dark' : '',
      theme === 'auto' ? 'royui-input--auto' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={classes}>
        <div className="royui-input__field">
          {icon != null && (
            <span className="royui-input__icon" aria-hidden="true">
              {icon}
            </span>
          )}
          {/* Order matters: the label is a *following* sibling of the input so the
              pure-CSS float keys off `:focus` / `:not(:placeholder-shown)` via `~`. */}
          <input
            {...rest}
            ref={ref}
            id={inputId}
            disabled={disabled}
            // :placeholder-shown needs a non-empty placeholder to key off; a lone
            // space stays invisible, while any real placeholder is held transparent
            // by CSS until the label floats up on focus (so the two never overlap).
            placeholder={placeholder ?? ' '}
            className="royui-input__input"
            aria-invalid={isError || undefined}
            aria-busy={showSpinner || undefined}
            aria-describedby={message ? messageId : undefined}
          />
          <label className="royui-input__label" htmlFor={inputId}>
            {label}
          </label>
          {showSpinner && (
            <span className="royui-input__spinner" aria-hidden="true">
              <SpinnerIcon />
            </span>
          )}
          {showCheck && (
            <span className="royui-input__check" aria-hidden="true">
              <CheckIcon />
            </span>
          )}
        </div>

        {message && (
          <p className="royui-input__helper" id={messageId} aria-live="polite">
            <span className="royui-input__helper-icon" aria-hidden="true">
              {isError ? <WarnIcon /> : isSuccess ? <CheckIcon /> : <InfoIcon />}
            </span>
            {/* Keying on the text re-mounts the span so it fades when the copy changes. */}
            <span
              className="royui-input__helper-text"
              key={typeof message === 'string' ? message : 'helper'}
            >
              {message}
            </span>
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
