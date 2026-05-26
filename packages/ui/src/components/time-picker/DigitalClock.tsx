'use client';

import { useRef, type KeyboardEvent, type WheelEvent } from 'react';
import type { TimeValue } from './AnalogClock';

export interface DigitalClockProps {
  value: TimeValue;
  onChange: (next: TimeValue) => void;
  hourCycle?: 12 | 24;
  minuteStep?: number;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function wrap(n: number, max: number): number {
  return ((n % max) + max) % max;
}

export function DigitalClock({
  value,
  onChange,
  hourCycle = 24,
  minuteStep = 1,
}: DigitalClockProps) {
  const hourBoundary = hourCycle === 12 ? 12 : 24;

  const displayHour =
    hourCycle === 12
      ? value.hours % 12 === 0
        ? 12
        : value.hours % 12
      : value.hours;

  const isAm = value.hours < 12;

  const setDisplayHour = (next: number) => {
    if (hourCycle === 24) {
      onChange({ ...value, hours: wrap(next, 24) });
      return;
    }
    let h = next;
    if (h <= 0) h = 12;
    if (h > 12) h = 1;
    const h24 = isAm ? (h === 12 ? 0 : h) : h === 12 ? 12 : h + 12;
    onChange({ ...value, hours: h24 });
  };

  const setMinutes = (next: number) => {
    const stepped = Math.round(next / minuteStep) * minuteStep;
    onChange({ ...value, minutes: wrap(stepped, 60) });
  };

  const setAm = () => {
    if (isAm) return;
    onChange({ ...value, hours: value.hours - 12 });
  };
  const setPm = () => {
    if (!isAm) return;
    onChange({ ...value, hours: value.hours + 12 });
  };

  return (
    <div className="royui-tp-digital">
      <div className="royui-tp-digital__row">
        <Segment
          label="Hours"
          value={pad(displayHour)}
          onWheelStep={(d) => setDisplayHour(displayHour + d)}
          onArrow={(d) => setDisplayHour(displayHour + d)}
          max={hourBoundary}
        />
        <span className="royui-tp-digital__sep" aria-hidden>
          :
        </span>
        <Segment
          label="Minutes"
          value={pad(value.minutes)}
          onWheelStep={(d) => setMinutes(value.minutes + d * minuteStep)}
          onArrow={(d) => setMinutes(value.minutes + d * minuteStep)}
          max={60}
        />
      </div>
      <div className="royui-tp-digital__period" role="group" aria-label="Day half">
        <button
          type="button"
          className={[
            'royui-tp-digital__period-btn',
            isAm && 'royui-tp-digital__period-btn--on',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={setAm}
          aria-pressed={isAm}
        >
          AM
        </button>
        <button
          type="button"
          className={[
            'royui-tp-digital__period-btn',
            !isAm && 'royui-tp-digital__period-btn--on',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={setPm}
          aria-pressed={!isAm}
        >
          PM
        </button>
      </div>
      <div className="royui-tp-digital__hint">
        Scroll or use arrow keys
      </div>
    </div>
  );
}

function Segment({
  label,
  value,
  onWheelStep,
  onArrow,
  max,
}: {
  label: string;
  value: string;
  onWheelStep: (delta: 1 | -1) => void;
  onArrow: (delta: 1 | -1) => void;
  max: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    onWheelStep(e.deltaY > 0 ? 1 : -1);
  };

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      onArrow(1);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onArrow(-1);
    }
  };

  return (
    <div
      ref={ref}
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuetext={value}
      aria-valuemax={max}
      className="royui-tp-digital__seg"
      onWheel={handleWheel}
      onKeyDown={handleKey}
    >
      {value}
    </div>
  );
}
