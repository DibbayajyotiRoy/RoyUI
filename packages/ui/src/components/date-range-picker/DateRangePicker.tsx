'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  addDays,
  addMonths,
  clampToBounds,
  DateRange,
  formatMonthYear,
  formatRange,
  getMonthGrid,
  getWeekdayLabels,
  isAfter,
  isBefore,
  isBetween,
  isSameDay,
  isSameMonth,
  startOfDay,
} from './dateUtils';
import './DateRangePicker.css';

export type DatePreset = {
  label: string;
  range: () => DateRange;
};

export interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  monthsVisible?: number;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minDate?: Date | null;
  maxDate?: Date | null;
  placeholder?: string;
  presets?: DatePreset[];
  /** Render below the trigger when open. Default 'left'. */
  align?: 'left' | 'right';
  className?: string;
  style?: CSSProperties;
  triggerLabel?: ReactNode;
  disabled?: boolean;
}

const today = () => startOfDay(new Date());

export const DEFAULT_PRESETS: DatePreset[] = [
  { label: 'Today', range: () => ({ from: today(), to: today() }) },
  {
    label: 'Last 7 days',
    range: () => ({ from: addDays(today(), -6), to: today() }),
  },
  {
    label: 'Last 30 days',
    range: () => ({ from: addDays(today(), -29), to: today() }),
  },
  {
    label: 'This month',
    range: () => {
      const t = today();
      return {
        from: new Date(t.getFullYear(), t.getMonth(), 1),
        to: t,
      };
    },
  },
  {
    label: 'Last month',
    range: () => {
      const t = today();
      const first = new Date(t.getFullYear(), t.getMonth() - 1, 1);
      const last = new Date(t.getFullYear(), t.getMonth(), 0);
      return { from: first, to: last };
    },
  },
];

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  monthsVisible = 2,
  weekStartsOn = 0,
  minDate,
  maxDate,
  placeholder = 'Pick a range',
  presets = DEFAULT_PRESETS,
  align = 'left',
  className = '',
  style,
  triggerLabel,
  disabled,
}: DateRangePickerProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<DateRange>(
    defaultValue ?? { from: null, to: null },
  );
  const current = controlled ? value! : internal;

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>(current);
  const [hover, setHover] = useState<Date | null>(null);
  const [anchorMonth, setAnchorMonth] = useState<Date>(() =>
    startOfDay(current.from ?? today()),
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

  useEffect(() => {
    if (open) {
      setDraft(current);
      setHover(null);
      setAnchorMonth(startOfDay(current.from ?? today()));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const months = useMemo(() => {
    return Array.from({ length: monthsVisible }, (_, i) => addMonths(anchorMonth, i));
  }, [anchorMonth, monthsVisible]);

  const commit = (next: DateRange) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
  };

  const apply = () => {
    commit(draft);
    setOpen(false);
  };

  const clear = () => {
    setDraft({ from: null, to: null });
    setHover(null);
  };

  const selectDay = (d: Date) => {
    const day = startOfDay(d);
    const { from, to } = draft;
    if (!from || (from && to)) {
      setDraft({ from: day, to: null });
      setHover(day);
      return;
    }
    // from is set, to is null
    if (isBefore(day, from)) {
      setDraft({ from: day, to: from });
    } else {
      setDraft({ from, to: day });
    }
  };

  const isDisabled = (d: Date) => {
    if (minDate && isBefore(d, startOfDay(minDate))) return true;
    if (maxDate && isAfter(d, startOfDay(maxDate))) return true;
    return false;
  };

  const previewTo = !draft.to && draft.from && hover ? hover : draft.to;
  const previewRange: DateRange = { from: draft.from, to: previewTo };

  return (
    <div
      ref={wrap}
      className={['royui-drp', className].filter(Boolean).join(' ')}
      style={style}
    >
      <button
        type="button"
        className="royui-drp__trigger"
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className="royui-drp__trigger-dot" aria-hidden />
        <span className="royui-drp__trigger-label">
          {triggerLabel ?? (formatRange(current) || placeholder)}
        </span>
      </button>

      {open && (
        <div
          className={`royui-drp__panel royui-drp__panel--${align}`}
          role="dialog"
          aria-label="Choose date range"
        >
          {presets.length > 0 && (
            <div className="royui-drp__presets">
              {presets.map((p) => {
                const r = p.range();
                const isActive =
                  isSameDay(draft.from, r.from) && isSameDay(draft.to, r.to);
                return (
                  <button
                    key={p.label}
                    type="button"
                    className={[
                      'royui-drp__preset',
                      isActive && 'royui-drp__preset--active',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      const next = {
                        from: r.from ? startOfDay(clampToBounds(r.from, minDate, maxDate)) : null,
                        to: r.to ? startOfDay(clampToBounds(r.to, minDate, maxDate)) : null,
                      };
                      setDraft(next);
                      if (next.from) setAnchorMonth(next.from);
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="royui-drp__main">
            <div className="royui-drp__nav">
              <button
                type="button"
                className="royui-drp__nav-btn"
                onClick={() => setAnchorMonth(addMonths(anchorMonth, -1))}
                aria-label="Previous month"
              >
                Prev
              </button>
              <button
                type="button"
                className="royui-drp__nav-btn"
                onClick={() => setAnchorMonth(addMonths(anchorMonth, 1))}
                aria-label="Next month"
              >
                Next
              </button>
            </div>

            <div className="royui-drp__months">
              {months.map((m) => (
                <MonthGrid
                  key={`${m.getFullYear()}-${m.getMonth()}`}
                  month={m}
                  range={previewRange}
                  hover={hover}
                  weekStartsOn={weekStartsOn}
                  isDisabled={isDisabled}
                  onSelect={selectDay}
                  onHover={(d) => setHover(d)}
                />
              ))}
            </div>

            <div className="royui-drp__foot">
              <div className="royui-drp__readout">
                {formatRange(draft) || 'Select start and end'}
              </div>
              <div className="royui-drp__foot-actions">
                <button
                  type="button"
                  className="royui-drp__ghost"
                  onClick={clear}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="royui-drp__primary"
                  onClick={apply}
                  disabled={!draft.from}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MonthGrid({
  month,
  range,
  hover,
  weekStartsOn,
  isDisabled,
  onSelect,
  onHover,
}: {
  month: Date;
  range: DateRange;
  hover: Date | null;
  weekStartsOn: number;
  isDisabled: (d: Date) => boolean;
  onSelect: (d: Date) => void;
  onHover: (d: Date | null) => void;
}) {
  const grid = useMemo(
    () => getMonthGrid(month.getFullYear(), month.getMonth(), weekStartsOn),
    [month, weekStartsOn],
  );
  const labels = useMemo(() => getWeekdayLabels(weekStartsOn), [weekStartsOn]);
  const todayD = today();

  return (
    <div className="royui-drp__month">
      <div className="royui-drp__month-title">{formatMonthYear(month)}</div>
      <div className="royui-drp__weekdays">
        {labels.map((l, i) => (
          <span key={i} className="royui-drp__weekday">
            {l}
          </span>
        ))}
      </div>
      <div className="royui-drp__grid" onMouseLeave={() => onHover(null)}>
        {grid.map((c) => {
          const inMonth = isSameMonth(c.date, month);
          const disabled = isDisabled(c.date);
          const isStart = isSameDay(c.date, range.from);
          const isEnd = isSameDay(c.date, range.to);
          const isInRange =
            range.from && range.to && isBetween(c.date, range.from, range.to);
          const isPreview =
            range.from && !range.to && hover && isBetween(c.date, range.from, hover);

          const isTodayCell = isSameDay(c.date, todayD);

          const classes = [
            'royui-drp__day',
            !inMonth && 'royui-drp__day--out',
            disabled && 'royui-drp__day--disabled',
            (isStart || isEnd) && 'royui-drp__day--edge',
            isStart && 'royui-drp__day--start',
            isEnd && 'royui-drp__day--end',
            (isInRange || isPreview) && 'royui-drp__day--in',
            isTodayCell && 'royui-drp__day--today',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={c.iso}
              type="button"
              className={classes}
              disabled={disabled}
              tabIndex={inMonth ? 0 : -1}
              onClick={() => inMonth && onSelect(c.date)}
              onMouseEnter={() => inMonth && onHover(c.date)}
              aria-label={c.date.toDateString()}
            >
              <span>{c.date.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
