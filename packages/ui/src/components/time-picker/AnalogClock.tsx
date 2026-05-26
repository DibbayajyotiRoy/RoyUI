'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

export type TimeValue = { hours: number; minutes: number };

export interface AnalogClockProps {
  value: TimeValue;
  onChange: (next: TimeValue) => void;
  hourCycle?: 12 | 24;
  minuteStep?: number;
  /** SVG size in px. Default 220. */
  size?: number;
}

type Mode = 'hours' | 'minutes';

function angleFromCenter(cx: number, cy: number, px: number, py: number): number {
  const dx = px - cx;
  const dy = py - cy;
  const a = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
  return (a + 360) % 360;
}

export function AnalogClock({
  value,
  onChange,
  hourCycle = 24,
  minuteStep = 1,
  size = 220,
}: AnalogClockProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [mode, setMode] = useState<Mode>('hours');
  const [dragging, setDragging] = useState(false);

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number, currentMode: Mode) => {
      const svg = ref.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const a = angleFromCenter(cx, cy, clientX, clientY);

      if (currentMode === 'hours') {
        // hours12 is the position on the face (0..11, where 0 = the "12" position).
        // Combine with the current AM/PM half so the underlying 24h value preserves
        // whichever half the user is editing.
        const hours12 = Math.round(a / 30) % 12;
        const isAm = value.hours < 12;
        const h24 = isAm ? hours12 : hours12 + 12;
        onChange({ ...value, hours: h24 });
      } else {
        let m = Math.round(a / 6) % 60;
        if (minuteStep > 1) m = Math.round(m / minuteStep) * minuteStep;
        if (m === 60) m = 0;
        onChange({ ...value, minutes: m });
      }
    },
    [minuteStep, onChange, value],
  );

  const togglePeriod = () => {
    const next = value.hours < 12 ? value.hours + 12 : value.hours - 12;
    onChange({ ...value, hours: next });
  };

  const isAm = value.hours < 12;

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => updateFromPointer(e.clientX, e.clientY, mode);
    const onUp = () => setDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging, mode, updateFromPointer]);

  const handlePointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    e.preventDefault();
    setDragging(true);
    updateFromPointer(e.clientX, e.clientY, mode);
  };

  // visible hour value
  const hours12 =
    hourCycle === 12
      ? value.hours === 0
        ? 12
        : value.hours > 12
          ? value.hours - 12
          : value.hours
      : value.hours % 12 === 0
        ? 12
        : value.hours % 12;

  const hourAngle = ((hours12 % 12) + value.minutes / 60) * 30 - 90;
  const minuteAngle = (value.minutes / 60) * 360 - 90;

  const r = size / 2;
  const cx = r;
  const cy = r;

  // hand lengths
  const hourLen = r * 0.45;
  const minuteLen = r * 0.7;
  const tickOuter = r * 0.92;
  const tickInner = r * 0.86;
  const majorInner = r * 0.82;

  const handX = (len: number, deg: number) => cx + len * Math.cos((deg * Math.PI) / 180);
  const handY = (len: number, deg: number) => cy + len * Math.sin((deg * Math.PI) / 180);

  return (
    <div className="royui-tp-analog">
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        onPointerDown={handlePointerDown}
        className="royui-tp-analog__face"
        role="application"
        aria-label="Analog clock"
      >
        <circle
          cx={cx}
          cy={cy}
          r={r - 1}
          className="royui-tp-analog__bezel"
        />

        {/* minute ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const isMajor = i % 5 === 0;
          const inner = isMajor ? majorInner : tickInner;
          return (
            <line
              key={i}
              x1={cx + inner * Math.cos(angle)}
              y1={cy + inner * Math.sin(angle)}
              x2={cx + tickOuter * Math.cos(angle)}
              y2={cy + tickOuter * Math.sin(angle)}
              className={isMajor ? 'royui-tp-analog__tick--major' : 'royui-tp-analog__tick'}
            />
          );
        })}

        {/* hour numbers at 12, 3, 6, 9 */}
        {[12, 3, 6, 9].map((n) => {
          const idx = n % 12;
          const angle = (idx * 30 - 90) * (Math.PI / 180);
          const rr = r * 0.72;
          return (
            <text
              key={n}
              x={cx + rr * Math.cos(angle)}
              y={cy + rr * Math.sin(angle)}
              dy="0.34em"
              textAnchor="middle"
              className="royui-tp-analog__numeral"
            >
              {n}
            </text>
          );
        })}

        {/* hour hand */}
        <line
          x1={cx}
          y1={cy}
          x2={handX(hourLen, hourAngle)}
          y2={handY(hourLen, hourAngle)}
          className={`royui-tp-analog__hand royui-tp-analog__hand--hour ${
            mode === 'hours' ? 'royui-tp-analog__hand--active' : ''
          }`}
          onPointerDown={(e) => {
            e.stopPropagation();
            setMode('hours');
            setDragging(true);
          }}
        />

        {/* minute hand */}
        <line
          x1={cx}
          y1={cy}
          x2={handX(minuteLen, minuteAngle)}
          y2={handY(minuteLen, minuteAngle)}
          className={`royui-tp-analog__hand royui-tp-analog__hand--minute ${
            mode === 'minutes' ? 'royui-tp-analog__hand--active' : ''
          }`}
          onPointerDown={(e) => {
            e.stopPropagation();
            setMode('minutes');
            setDragging(true);
          }}
        />

        <circle cx={cx} cy={cy} r={3.5} className="royui-tp-analog__pin" />
      </svg>

      <div className="royui-tp-analog__modes">
        <button
          type="button"
          className={[
            'royui-tp-analog__mode',
            mode === 'hours' && 'royui-tp-analog__mode--on',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setMode('hours')}
        >
          Hours
        </button>
        <button
          type="button"
          className={[
            'royui-tp-analog__mode',
            mode === 'minutes' && 'royui-tp-analog__mode--on',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setMode('minutes')}
        >
          Minutes
        </button>
        <div className="royui-tp-analog__period" role="group" aria-label="Day half">
          <button
            type="button"
            className={[
              'royui-tp-analog__period-btn',
              isAm && 'royui-tp-analog__period-btn--on',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              if (!isAm) togglePeriod();
            }}
            aria-pressed={isAm}
          >
            AM
          </button>
          <button
            type="button"
            className={[
              'royui-tp-analog__period-btn',
              !isAm && 'royui-tp-analog__period-btn--on',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              if (isAm) togglePeriod();
            }}
            aria-pressed={!isAm}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
}
