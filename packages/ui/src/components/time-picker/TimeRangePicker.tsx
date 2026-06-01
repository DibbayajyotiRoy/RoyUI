'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { type TimeValue } from './AnalogClock';
import { ClockSwitch } from './ClockSwitch';
import { formatTime, type TimePickerVariant } from './TimePicker';
import './TimePicker.css';

export type TimeRangeValue = { from: TimeValue | null; to: TimeValue | null };

export interface TimeRangePickerProps {
  value?: TimeRangeValue | null;
  defaultValue?: TimeRangeValue | null;
  onChange?: (next: TimeRangeValue) => void;
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

type Leg = 'from' | 'to';

const EMPTY: TimeRangeValue = { from: null, to: null };

export function formatTimeRange(
  range: TimeRangeValue | null | undefined,
  hourCycle: 12 | 24 = 24,
): string {
  if (!range || (!range.from && !range.to)) return '';
  if (range.from && !range.to) return formatTime(range.from, hourCycle);
  if (!range.from && range.to) return formatTime(range.to, hourCycle);
  return `${formatTime(range.from, hourCycle)} – ${formatTime(range.to, hourCycle)}`;
}

export function TimeRangePicker({
  value,
  defaultValue,
  onChange,
  variant = 'analog',
  switchable = true,
  hourCycle = 24,
  minuteStep = 1,
  placeholder = 'Time range',
  align = 'left',
  className = '',
  style,
  triggerLabel,
  disabled,
}: TimeRangePickerProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<TimeRangeValue>(
    defaultValue ?? EMPTY,
  );
  const current = controlled ? value ?? EMPTY : internal;

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<TimePickerVariant>(variant);
  const [leg, setLeg] = useState<Leg>('from');
  const [draftFrom, setDraftFrom] = useState<TimeValue>(
    current.from ?? { hours: 9, minutes: 0 },
  );
  const [draftTo, setDraftTo] = useState<TimeValue>(
    current.to ?? { hours: 17, minutes: 0 },
  );

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

  // Seed both drafts from the committed value each time the panel opens.
  useEffect(() => {
    if (!open) return;
    const now = new Date();
    setLeg('from');
    setDraftFrom(current.from ?? { hours: now.getHours(), minutes: 0 });
    setDraftTo(
      current.to ?? { hours: (now.getHours() + 1) % 24, minutes: 0 },
    );
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setMode(variant);
  }, [variant]);

  const commit = (next: TimeRangeValue) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
  };

  const draft = leg === 'from' ? draftFrom : draftTo;
  const setDraft = leg === 'from' ? setDraftFrom : setDraftTo;

  const apply = () => {
    commit({ from: draftFrom, to: draftTo });
    setOpen(false);
  };

  const clear = () => {
    commit(EMPTY);
    setOpen(false);
  };

  return (
    <div
      ref={wrap}
      className={['royui-tp', 'royui-trp', className].filter(Boolean).join(' ')}
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
          {triggerLabel ??
            (formatTimeRange(current, hourCycle) || placeholder)}
        </span>
      </button>

      {open && (
        <div
          className={`royui-tp__panel royui-tp__panel--${align}`}
          role="dialog"
          aria-label="Choose time range"
        >
          <div className="royui-tp__head">
            <div className="royui-tp__readout">{formatTime(draft, hourCycle)}</div>
            {switchable && (
              <div
                className="royui-tp__variants"
                role="tablist"
                data-active={mode}
              >
                <span className="royui-tp__variant-thumb" aria-hidden />
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

          <div className="royui-trp__legs" role="tablist" data-active={leg}>
            <span className="royui-trp__leg-thumb" aria-hidden />
            <button
              type="button"
              role="tab"
              aria-selected={leg === 'from'}
              className="royui-trp__leg"
              onClick={() => setLeg('from')}
            >
              <span className="royui-trp__leg-label">Start</span>
              <span className="royui-trp__leg-time">
                {formatTime(draftFrom, hourCycle)}
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={leg === 'to'}
              className="royui-trp__leg"
              onClick={() => setLeg('to')}
            >
              <span className="royui-trp__leg-label">End</span>
              <span className="royui-trp__leg-time">
                {formatTime(draftTo, hourCycle)}
              </span>
            </button>
          </div>

          <div className="royui-tp__body">
            <ClockSwitch
              mode={mode}
              value={draft}
              onChange={setDraft}
              hourCycle={hourCycle}
              minuteStep={minuteStep}
            />
          </div>

          <div className="royui-tp__foot">
            <button type="button" className="royui-tp__ghost" onClick={clear}>
              Clear
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
