'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { AnalogClock, type TimeValue } from './AnalogClock';
import { DigitalClock } from './DigitalClock';
import './TimePicker.css';

export type TimePickerVariant = 'analog' | 'digital';

export interface TimePickerProps {
  value?: TimeValue | null;
  defaultValue?: TimeValue | null;
  onChange?: (next: TimeValue) => void;
  /** Picker style. Default 'analog'. */
  variant?: TimePickerVariant;
  /** Allow the user to switch between variants. Default true. */
  switchable?: boolean;
  hourCycle?: 12 | 24;
  minuteStep?: number;
  placeholder?: string;
  align?: 'left' | 'right';
  className?: string;
  style?: CSSProperties;
  triggerLabel?: ReactNode;
  disabled?: boolean;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatTime(t: TimeValue | null | undefined, hourCycle: 12 | 24 = 24): string {
  if (!t) return '';
  if (hourCycle === 24) return `${pad(t.hours)}:${pad(t.minutes)}`;
  const h = t.hours % 12 === 0 ? 12 : t.hours % 12;
  const ampm = t.hours < 12 ? 'AM' : 'PM';
  return `${pad(h)}:${pad(t.minutes)} ${ampm}`;
}

export function TimePicker({
  value,
  defaultValue,
  onChange,
  variant = 'analog',
  switchable = true,
  hourCycle = 24,
  minuteStep = 1,
  placeholder = 'Pick a time',
  align = 'left',
  className = '',
  style,
  triggerLabel,
  disabled,
}: TimePickerProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<TimeValue | null>(defaultValue ?? null);
  const current = controlled ? value : internal;

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<TimePickerVariant>(variant);
  const [draft, setDraft] = useState<TimeValue>(current ?? { hours: 12, minutes: 0 });

  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) setDraft(current ?? { hours: new Date().getHours(), minutes: 0 });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setMode(variant);
  }, [variant]);

  const commit = (next: TimeValue) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
  };

  const setNow = () => {
    const now = new Date();
    setDraft({ hours: now.getHours(), minutes: now.getMinutes() });
  };

  const apply = () => {
    commit(draft);
    setOpen(false);
  };

  return (
    <div
      ref={wrap}
      className={['royui-tp', className].filter(Boolean).join(' ')}
      style={style}
    >
      <button
        type="button"
        className="royui-tp__trigger"
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className="royui-tp__trigger-dot" aria-hidden />
        <span className="royui-tp__trigger-label">
          {triggerLabel ?? (formatTime(current ?? null, hourCycle) || placeholder)}
        </span>
      </button>

      {open && (
        <div
          className={`royui-tp__panel royui-tp__panel--${align}`}
          role="dialog"
          aria-label="Choose time"
        >
          <div className="royui-tp__head">
            <div className="royui-tp__readout">
              {formatTime(draft, hourCycle)}
            </div>
            {switchable && (
              <div className="royui-tp__variants" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'analog'}
                  className={[
                    'royui-tp__variant',
                    mode === 'analog' && 'royui-tp__variant--on',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setMode('analog')}
                >
                  Analog
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'digital'}
                  className={[
                    'royui-tp__variant',
                    mode === 'digital' && 'royui-tp__variant--on',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setMode('digital')}
                >
                  Digital
                </button>
              </div>
            )}
          </div>

          <div className="royui-tp__body">
            {mode === 'analog' ? (
              <AnalogClock
                value={draft}
                onChange={setDraft}
                hourCycle={hourCycle}
                minuteStep={minuteStep}
              />
            ) : (
              <DigitalClock
                value={draft}
                onChange={setDraft}
                hourCycle={hourCycle}
                minuteStep={minuteStep}
              />
            )}
          </div>

          <div className="royui-tp__foot">
            <button type="button" className="royui-tp__ghost" onClick={setNow}>
              Now
            </button>
            <button type="button" className="royui-tp__primary" onClick={apply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export type { TimeValue };
