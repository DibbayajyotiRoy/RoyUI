'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import './StatCard.css';

export type StatCardTrend = 'up' | 'down' | 'flat';

export interface StatCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** KPI title, e.g. "Revenue". Renders in the header row; truncates. (required) */
  label: ReactNode;
  /** The hero metric, e.g. "$125.4K". An empty value (null, undefined, '', or NaN) renders `emptyValue`. (required) */
  value: ReactNode;
  /** Secondary muted line under the value, e.g. "+$42.1K 30d". Truncates. */
  sub?: ReactNode;
  /** Explicit chip direction (arrow + sentiment color). If omitted, derived from the sign of `delta`. */
  trend?: StatCardTrend;
  /** Signed percentage for the chip, e.g. 12.4 renders "12.4%" (the absolute value is shown). */
  delta?: number;
  /** Which direction counts as "good" (green); the opposite reads as "bad" (red). Default 'up'. For churn/error/latency KPIs pass 'down'. */
  goodDirection?: 'up' | 'down';
  /** Sparkline series. REAL data only - never fabricate it. Filtered to finite numbers; the chart draws only when >= 2 valid points remain. */
  data?: number[];
  /** Accent for the icon tint and sparkline stroke. Any CSS color string. Defaults to the built-in gold accent token. */
  color?: string;
  /** Leading glyph (bring-your-own icon). Tinted with `color`. */
  icon?: ReactNode;
  /** When set, the whole card renders as an <a> link. */
  href?: string;
  /** Replaces the value + sparkline with a shimmer skeleton and marks the card aria-busy. */
  loading?: boolean;
  /** Placeholder shown when `value` is empty. Default '—'. */
  emptyValue?: ReactNode;
  /** Denser variant - tighter padding, smaller value, shorter sparkline. */
  compact?: boolean;
  /** Colour scheme. 'auto' (default) follows the system; 'light'/'dark' force one. */
  theme?: 'light' | 'dark' | 'auto';
  /** Milliseconds for the sparkline's draw-in animation on hover. Default 1200.
   *  Lower is snappier; 0 (or prefers-reduced-motion) disables the draw. */
  drawDuration?: number;
}

/** Inset (px) so the round line cap never clips at the chart edges and the
 *  peaks/troughs keep a little breathing room. */
const SPARK_INSET_X = 2;
const SPARK_INSET_Y = 3;

const round2 = (n: number) => Math.round(n * 100) / 100;

/** A value is "empty" when it carries no figure: null, undefined, '', or NaN.
 *  This is stricter than `value ?? fallback`, which lets '' and NaN through. */
function isEmptyValue(v: ReactNode): boolean {
  return (
    v == null ||
    v === '' ||
    (typeof v === 'number' && Number.isNaN(v))
  );
}

/** Pull a plain text fragment out of a ReactNode for the aria-label. Only
 *  strings and numbers are speakable here; anything richer returns '' so we
 *  don't try to verbalise arbitrary markup. */
function textOf(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number' && Number.isFinite(node)) return String(node);
  return '';
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** A smooth, non-overshooting curve through the points — monotone cubic
 *  interpolation (Fritsch–Carlson). This is what recharts draws as
 *  type="monotone": rounded like a real trend line, never bulging past the
 *  data the way a naive Catmull-Rom spline would, so the line stays inside the
 *  padded box. A straight polyline reads as jagged "edges"; this reads as ink. */
function sparkPath(series: number[], w: number, h: number): string {
  const n = series.length;
  if (n < 2 || w <= 0 || h <= 0) return '';

  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const innerW = w - 2 * SPARK_INSET_X;
  const innerH = h - 2 * SPARK_INSET_Y;
  const xs = series.map((_, i) => SPARK_INSET_X + (i / (n - 1)) * innerW);
  const ys = series.map((v) => SPARK_INSET_Y + (1 - (v - min) / range) * innerH);

  if (n === 2) {
    return `M ${round2(xs[0]!)},${round2(ys[0]!)} L ${round2(xs[1]!)},${round2(ys[1]!)}`;
  }

  // Secant slopes between consecutive points.
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = xs[i + 1]! - xs[i]!;
    slope.push(dx === 0 ? 0 : (ys[i + 1]! - ys[i]!) / dx);
  }
  // Tangents, then the Fritsch–Carlson clamp that guarantees monotonicity.
  const m: number[] = new Array(n);
  m[0] = slope[0]!;
  m[n - 1] = slope[n - 2]!;
  for (let i = 1; i < n - 1; i++) {
    m[i] = slope[i - 1]! * slope[i]! <= 0 ? 0 : (slope[i - 1]! + slope[i]!) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i]! / slope[i]!;
    const b = m[i + 1]! / slope[i]!;
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * slope[i]!;
      m[i + 1] = t * b * slope[i]!;
    }
  }

  let d = `M ${round2(xs[0]!)},${round2(ys[0]!)}`;
  for (let i = 0; i < n - 1; i++) {
    const dx = xs[i + 1]! - xs[i]!;
    const c1x = xs[i]! + dx / 3;
    const c1y = ys[i]! + (m[i]! * dx) / 3;
    const c2x = xs[i + 1]! - dx / 3;
    const c2y = ys[i + 1]! - (m[i + 1]! * dx) / 3;
    d += ` C ${round2(c1x)},${round2(c1y)} ${round2(c2x)},${round2(c2y)} ${round2(xs[i + 1]!)},${round2(ys[i + 1]!)}`;
  }
  return d;
}

/** Up-arrow. aria-hidden — the chip's own aria-label carries the direction. */
const ArrowUp = () => (
  <svg
    className="royui-statcard__arrow"
    width="8"
    height="8"
    viewBox="0 0 10 10"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5 8.5V1.5M5 1.5L2 4.5M5 1.5L8 4.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Down-arrow. Mirror of ArrowUp. */
const ArrowDown = () => (
  <svg
    className="royui-statcard__arrow"
    width="8"
    height="8"
    viewBox="0 0 10 10"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5 1.5V8.5M5 8.5L2 5.5M5 8.5L8 5.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StatCard = forwardRef<HTMLElement, StatCardProps>(
  (
    {
      label,
      value,
      sub,
      trend,
      delta,
      goodDirection,
      data,
      color,
      icon,
      href,
      loading = false,
      emptyValue = '—',
      compact = false,
      theme = 'auto',
      drawDuration = 1200,
      className = '',
      onClick,
      onMouseEnter,
      ...rest
    },
    ref,
  ) => {
    // Root semantics drive both behaviour and a11y: a link when there's an
    // href, a real <button> when there's a click handler (so Enter/Space and
    // focus come for free), otherwise an inert <div> with no affordance.
    const isLink = href != null;
    const isButton = !isLink && onClick != null;
    const interactive = isLink || isButton;

    // Real data only — drop anything non-finite, then draw only with >= 2 points.
    const series = (data ?? []).filter(
      (n): n is number => typeof n === 'number' && Number.isFinite(n),
    );
    const showChart = series.length > 1 && !loading;
    // A card with no sparkline (and not loading) would otherwise top-load and
    // leave the bottom empty when a grid stretches it to match charted
    // neighbours; --no-chart centers the figure in that free space instead.
    const noChart = !showChart && !loading;

    const classes = [
      'royui-statcard',
      compact ? 'royui-statcard--compact' : '',
      interactive ? 'royui-statcard--interactive' : '',
      noChart ? 'royui-statcard--no-chart' : '',
      theme === 'dark' ? 'royui-statcard--dark' : '',
      theme === 'auto' ? 'royui-statcard--auto' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Direction: explicit `trend` wins; otherwise read it off the sign of delta.
    const dir: StatCardTrend | undefined =
      trend ??
      (delta == null ? undefined : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat');

    // The chip is meaningful only when there's a number to show, or a non-flat
    // direction. A bare trend="flat" with no delta says nothing, so it's hidden.
    const showChip = delta != null || (trend != null && trend !== 'flat');

    // Sentiment is good/bad relative to which way is "good", not the raw arrow:
    // a down-arrow on a churn KPI (goodDirection="down") still reads green.
    const good = goodDirection ?? 'up';
    const sentiment =
      dir == null || dir === 'flat' ? 'flat' : dir === good ? 'good' : 'bad';

    const deltaText = delta != null ? `${Math.abs(delta)}%` : '';
    // The on-screen chip is just the number; the aria-label adds the direction.
    const chipAria = dir != null && dir !== 'flat'
      ? `${dir} ${deltaText}`.trim()
      : deltaText;

    const empty = isEmptyValue(value);
    const shownValue = empty ? emptyValue : value;

    // The sparkline is drawn in real pixel space, not a stretched viewBox, so
    // the stroke is a uniform 1.75px on any card width and getTotalLength()
    // (used by the draw animation) reports a length that matches the dash units.
    const wrapRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const animRef = useRef<Animation | null>(null);
    const [size, setSize] = useState<{ w: number; h: number } | null>(null);

    useEffect(() => {
      const el = wrapRef.current;
      if (!el || !showChart) return;
      const measure = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (w > 0 && h > 0) {
          setSize((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
        }
      };
      measure();
      let ro: ResizeObserver | undefined;
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(measure);
        ro.observe(el);
      }
      return () => ro?.disconnect();
    }, [showChart, compact]);

    // Cancel any in-flight draw when the card unmounts.
    useEffect(() => () => animRef.current?.cancel(), []);

    // Draw the line from nothing to its current shape. The animation is detached
    // from :hover, so it always runs to completion even if the pointer leaves
    // mid-draw; a fresh mouseenter cancels it and starts over from empty.
    const drawSpark = useCallback(() => {
      const path = pathRef.current;
      if (!path || drawDuration <= 0 || prefersReducedMotion()) return;
      let len = 0;
      try {
        len = path.getTotalLength();
      } catch {
        return;
      }
      if (!len) return;
      animRef.current?.cancel();
      animRef.current = path.animate(
        [
          { strokeDasharray: `${len} ${len}`, strokeDashoffset: len },
          { strokeDasharray: `${len} ${len}`, strokeDashoffset: 0 },
        ],
        { duration: drawDuration, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', fill: 'forwards' },
      );
    }, [drawDuration]);

    const handleMouseEnter = (e: ReactMouseEvent<HTMLElement>) => {
      drawSpark();
      onMouseEnter?.(e);
    };

    // `color` tints the icon and the sparkline stroke; fall back to the token.
    const stroke = color ?? 'var(--royui-statcard-accent)';
    const iconStyle: CSSProperties | undefined = color ? { color } : undefined;
    const d = size ? sparkPath(series, size.w, size.h) : '';

    // Default aria-label for interactive roots, built only from speakable parts.
    // A consumer-supplied aria-label in `...rest` overrides this (spread after).
    let ariaLabel: string | undefined;
    if (interactive) {
      const parts: string[] = [];
      const labelText = textOf(label);
      const valueText = textOf(shownValue);
      if (labelText) parts.push(valueText ? `${labelText}: ${valueText}` : labelText);
      else if (valueText) parts.push(valueText);
      if (showChip && chipAria) parts.push(chipAria);
      ariaLabel = parts.length > 0 ? parts.join(', ') : undefined;
    }

    const header = (
      <div className="royui-statcard__header">
        {icon != null && (
          <span className="royui-statcard__icon" style={iconStyle} aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="royui-statcard__label">{label}</span>
        {showChip && (
          <span
            className={`royui-statcard__chip royui-statcard__chip--${sentiment}`}
            aria-label={chipAria || undefined}
          >
            {dir === 'up' && <ArrowUp />}
            {dir === 'down' && <ArrowDown />}
            {deltaText && (
              <span className="royui-statcard__chip-text">{deltaText}</span>
            )}
          </span>
        )}
      </div>
    );

    const body = loading ? (
      <>
        <div
          className="royui-statcard__skeleton royui-statcard__skeleton--value"
          aria-hidden="true"
        />
        {sub != null && (
          <div
            className="royui-statcard__skeleton royui-statcard__skeleton--sub"
            aria-hidden="true"
          />
        )}
        {/* Always reserve the chart strip so the card holds its shape while busy. */}
        <div
          className="royui-statcard__skeleton royui-statcard__skeleton--chart"
          aria-hidden="true"
        />
      </>
    ) : (
      <>
        <div className="royui-statcard__value">{shownValue}</div>
        {sub != null && <div className="royui-statcard__sub">{sub}</div>}
        {showChart && (
          <div className="royui-statcard__chart">
            <div className="royui-statcard__spark-wrap" ref={wrapRef}>
              {size && d && (
                <svg
                  className="royui-statcard__spark"
                  width={size.w}
                  height={size.h}
                  viewBox={`0 0 ${size.w} ${size.h}`}
                  aria-hidden="true"
                >
                  <path
                    ref={pathRef}
                    className="royui-statcard__spark-path"
                    d={d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
        )}
      </>
    );

    const content = (
      <>
        {header}
        {body}
      </>
    );

    if (isLink) {
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          aria-label={ariaLabel}
          aria-busy={loading || undefined}
          onClick={onClick}
          onMouseEnter={handleMouseEnter}
          {...rest}
        >
          {content}
        </a>
      );
    }

    if (isButton) {
      return (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type="button"
          className={classes}
          aria-label={ariaLabel}
          aria-busy={loading || undefined}
          onClick={onClick}
          onMouseEnter={handleMouseEnter}
          {...rest}
        >
          {content}
        </button>
      );
    }

    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        className={classes}
        aria-busy={loading || undefined}
        onMouseEnter={handleMouseEnter}
        {...rest}
      >
        {content}
      </div>
    );
  },
);

StatCard.displayName = 'StatCard';
