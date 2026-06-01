'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { AnalogClock, type TimeValue } from './AnalogClock';
import { DigitalClock } from './DigitalClock';
import type { TimePickerVariant } from './TimePicker';

export interface ClockSwitchProps {
  mode: TimePickerVariant;
  value: TimeValue;
  onChange: (next: TimeValue) => void;
  hourCycle?: 12 | 24;
  minuteStep?: number;
}

/**
 * Cross-fades the analog and digital faces and morphs the panel height between
 * them so switching modes feels continuous rather than a hard swap. Both faces
 * stay mounted: the active one drives layout (position: relative), the other
 * sits absolutely on top and fades out. The container height tracks whichever
 * face is active, animated via CSS.
 */
export function ClockSwitch({
  mode,
  value,
  onChange,
  hourCycle,
  minuteStep,
}: ClockSwitchProps) {
  const analogRef = useRef<HTMLDivElement>(null);
  const digitalRef = useRef<HTMLDivElement>(null);
  const [heights, setHeights] = useState<{ analog?: number; digital?: number }>(
    {},
  );

  // Measure both faces' natural heights so the container can animate between
  // them. The inactive face is absolutely positioned without a bottom anchor,
  // so offsetHeight stays its intrinsic content height.
  useLayoutEffect(() => {
    const a = analogRef.current;
    const d = digitalRef.current;
    const measure = () =>
      setHeights({ analog: a?.offsetHeight, digital: d?.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    if (a) ro.observe(a);
    if (d) ro.observe(d);
    return () => ro.disconnect();
  }, []);

  const analogActive = mode === 'analog';

  // Pull the inactive face out of the focus order and a11y tree.
  useLayoutEffect(() => {
    if (analogRef.current) analogRef.current.inert = !analogActive;
    if (digitalRef.current) digitalRef.current.inert = analogActive;
  }, [analogActive]);

  const height = analogActive ? heights.analog : heights.digital;

  return (
    <div
      className="royui-tp__switch"
      style={height != null ? { height } : undefined}
    >
      <div
        ref={analogRef}
        className={[
          'royui-tp__layer',
          analogActive && 'royui-tp__layer--active',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <AnalogClock
          value={value}
          onChange={onChange}
          hourCycle={hourCycle}
          minuteStep={minuteStep}
        />
      </div>
      <div
        ref={digitalRef}
        className={[
          'royui-tp__layer',
          !analogActive && 'royui-tp__layer--active',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <DigitalClock
          value={value}
          onChange={onChange}
          hourCycle={hourCycle}
          minuteStep={minuteStep}
        />
      </div>
    </div>
  );
}
