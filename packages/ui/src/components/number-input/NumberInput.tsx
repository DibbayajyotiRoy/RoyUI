'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import './NumberInput.css';
import { FieldMessage, resolveMessage, useShake } from '../_internal/field-shared';

export interface NumberInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange'
  > {
  label: string;
  /** Controlled value. `null` (or empty input) means "no value". */
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Decimal places to clamp/format to on blur and step. */
  precision?: number;
  /** Show +/- stepper buttons. Default true. */
  steppers?: boolean;
  helperText?: ReactNode;
  placeholder?: string;
  error?: boolean | string;
  success?: boolean | string;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

const ChevronUp = () => (
  <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" aria-hidden="true">
    <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronDown = () => (
  <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function firstFinite(...candidates: unknown[]): number | null {
  for (const c of candidates) {
    if (typeof c === 'number' && Number.isFinite(c)) return c;
  }
  return null;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      label,
      value,
      defaultValue,
      onChange,
      min,
      max,
      step = 1,
      precision,
      steppers = true,
      helperText,
      placeholder,
      error = false,
      success = false,
      theme = 'auto',
      className = '',
      id,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const reactId = useId();
    const fieldId = id ?? `royui-number-${reactId}`;
    const messageId = `${fieldId}-message`;

    const isError = Boolean(error);
    const isSuccess = Boolean(success) && !isError;
    const message = resolveMessage(error, success, helperText);
    const shake = useShake(isError);

    const fmt = useCallback((n: number | null | undefined): string => {
      if (n == null || !Number.isFinite(n)) return '';
      return String(precision != null ? Number(n.toFixed(precision)) : n);
    }, [precision]);

    // Raw text buffer so partial entries ("-", "1.") survive while typing.
    const [text, setText] = useState(() => fmt(value ?? defaultValue ?? null));

    // Reconcile when a controlled value changes from the outside.
    useEffect(() => {
      if (value === undefined) return;
      const parsed = text.trim() === '' ? null : Number(text);
      const incoming = value ?? null;
      if (!Object.is(Number.isNaN(parsed) ? null : parsed, incoming)) {
        setText(fmt(value));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const clampRound = useCallback(
      (n: number): number => {
        let r = n;
        if (min != null && r < min) r = min;
        if (max != null && r > max) r = max;
        if (precision != null) r = Number(r.toFixed(precision));
        return r;
      },
      [min, max, precision],
    );

    const emit = useCallback(
      (next: number | null, asText?: string) => {
        setText(asText ?? fmt(next));
        onChange?.(next);
      },
      [fmt, onChange],
    );

    const handleText = (raw: string) => {
      setText(raw);
      const trimmed = raw.trim();
      if (trimmed === '') {
        onChange?.(null);
        return;
      }
      const n = Number(trimmed);
      onChange?.(Number.isFinite(n) ? n : null);
    };

    const handleBlur = () => {
      const trimmed = text.trim();
      if (trimmed === '') {
        emit(null, '');
        return;
      }
      const n = Number(trimmed);
      if (!Number.isFinite(n)) {
        emit(null, '');
        return;
      }
      emit(clampRound(n));
    };

    const stepBy = (delta: number) => {
      const base = firstFinite(Number(text), value, min, 0) ?? 0;
      emit(clampRound(base + delta));
    };

    const atMin = min != null && firstFinite(Number(text), value) != null && Number(text) <= min;
    const atMax = max != null && firstFinite(Number(text), value) != null && Number(text) >= max;

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        stepBy(step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        stepBy(-step);
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        stepBy(step * 10);
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        stepBy(-step * 10);
      }
    };

    const classes = [
      'royui-number',
      isError ? 'royui-number--error' : '',
      isSuccess ? 'royui-number--success' : '',
      steppers ? 'royui-number--trailing' : '',
      disabled ? 'royui-number--disabled' : '',
      shake ? 'royui-number--shake' : '',
      theme === 'dark' ? 'royui-number--dark' : '',
      theme === 'auto' ? 'royui-number--auto' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={classes}>
        <div className="royui-number__field">
          <input
            {...rest}
            ref={ref}
            id={fieldId}
            type="text"
            inputMode="decimal"
            disabled={disabled}
            value={text}
            placeholder={placeholder ?? ' '}
            className="royui-number__input"
            aria-invalid={isError || undefined}
            aria-describedby={message ? messageId : undefined}
            onChange={(e) => handleText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
          />
          <label className="royui-number__label" htmlFor={fieldId}>
            {label}
          </label>
          {steppers && (
            <span className="royui-number__steppers">
              <button
                type="button"
                tabIndex={-1}
                className="royui-number__step royui-number__step--up"
                aria-label="Increase"
                disabled={disabled || atMax}
                onClick={() => stepBy(step)}
              >
                <ChevronUp />
              </button>
              <button
                type="button"
                tabIndex={-1}
                className="royui-number__step royui-number__step--down"
                aria-label="Decrease"
                disabled={disabled || atMin}
                onClick={() => stepBy(-step)}
              >
                <ChevronDown />
              </button>
            </span>
          )}
        </div>

        {message && (
          <FieldMessage
            block="royui-number"
            id={messageId}
            state={isError ? 'error' : isSuccess ? 'success' : 'idle'}
          >
            {message}
          </FieldMessage>
        )}
      </div>
    );
  },
);

NumberInput.displayName = 'NumberInput';
