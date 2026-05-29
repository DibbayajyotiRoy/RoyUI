'use client';

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import './Button.css';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual scale. Defaults to "md". */
  size?: ButtonSize;
  /** Visual weight. "primary" is the solid depth button; "secondary" is a
   *  quieter raised surface; "ghost" is text-only until hovered. Defaults to "primary". */
  variant?: ButtonVariant;
  /**
   * Render the single child element instead of a <button>, merging the
   * button's classes, styles, and props onto it. Use this for a
   * button-styled link with real anchor semantics:
   * `<Button asChild><Link href="/x">Go</Link></Button>`.
   */
  asChild?: boolean;
  /**
   * Base color (hex or rgb()). The whole depth treatment derives from it —
   * a lighter top and darker base for the gradient, a hairline ring that
   * adapts to the tone, and a readable label color picked by luminance.
   * Defaults to the near-black surface. Override individual CSS variables
   * (--royui-btn-top etc.) for finer control.
   */
  color?: string;
  /** Stretch the button to fill its container. Defaults to false. */
  fullWidth?: boolean;
  /** Replaces children with a spinner and disables the button. */
  loading?: boolean;
  /** Optional override for the loading visual. Defaults to a spinner. */
  loadingLabel?: ReactNode;
  children: ReactNode;
}

type RGB = { r: number; g: number; b: number };

/** Parse hex (#rgb/#rrggbb/#rrggbbaa) or rgb()/rgba(). Returns null otherwise. */
function parseColor(input: string): RGB | null {
  const s = input.trim();
  const hex = s.replace(/^#/, '');
  if (/^[0-9a-f]{3,4}$/i.test(hex)) {
    return {
      r: parseInt(hex[0]! + hex[0]!, 16),
      g: parseInt(hex[1]! + hex[1]!, 16),
      b: parseInt(hex[2]! + hex[2]!, 16),
    };
  }
  if (/^[0-9a-f]{6}$/i.test(hex) || /^[0-9a-f]{8}$/i.test(hex)) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }
  const m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const p = m[1]!.split(/[,\s/]+/).filter(Boolean).map(Number);
    if (p.length >= 3 && p.slice(0, 3).every((n) => !Number.isNaN(n))) {
      return { r: p[0]!, g: p[1]!, b: p[2]! };
    }
  }
  return null;
}

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
/** Mix a channel toward a target (255 = white, 0 = black) by amount 0..1. */
const mix = (c: RGB, target: number, amt: number): RGB => ({
  r: clamp(c.r + (target - c.r) * amt),
  g: clamp(c.g + (target - c.g) * amt),
  b: clamp(c.b + (target - c.b) * amt),
});
const rgb = (c: RGB) => `rgb(${c.r}, ${c.g}, ${c.b})`;

/** Derive the full set of depth variables from one base color. */
function tintVars(color: string): CSSProperties {
  const base = parseColor(color);
  // Unparseable (named color, hsl, etc.) — let the raw value drive the
  // surface and keep the default overlays. Depth still reads via the shade.
  if (!base) {
    return {
      ['--royui-btn-top']: color,
      ['--royui-btn-bottom']: color,
    } as CSSProperties;
  }
  const lum = (0.2126 * base.r + 0.7152 * base.g + 0.0722 * base.b) / 255;
  const light = lum > 0.62;
  const shade = mix(base, 0, 0.6);
  return {
    ['--royui-btn-top']: rgb(mix(base, 255, 0.1)),
    ['--royui-btn-bottom']: rgb(mix(base, 0, 0.1)),
    // Light buttons need a darker edge to show on light backgrounds; dark
    // buttons need a lighter one. Either way the ring stays a hairline.
    ['--royui-btn-ring']: rgb(light ? mix(base, 0, 0.16) : mix(base, 255, 0.22)),
    ['--royui-btn-fg']: light ? '#0b0b0d' : '#ffffff',
    // Stronger top sheen on light surfaces (where a faint white is invisible),
    // an in-hue shade at the base so it never looks like grime.
    ['--royui-btn-highlight']: light
      ? 'rgba(255, 255, 255, 0.5)'
      : 'rgba(255, 255, 255, 0.15)',
    ['--royui-btn-shade']: `rgba(${shade.r}, ${shade.g}, ${shade.b}, 0.5)`,
    ['--royui-btn-focus']: light ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.7)',
    // Press darkens less on light buttons so the dip doesn't look like a smudge.
    ['--royui-btn-active-bright']: light ? '0.93' : '0.86',
  } as CSSProperties;
}

/** Combine the forwarded ref with the child's own ref (asChild path). */
function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref && typeof ref === 'object') {
        (ref as { current: T | null }).current = node;
      }
    }
  };
}

const DefaultSpinner = () => (
  <span className="royui-btn__spinner" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="2.5"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </span>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = 'md',
      variant = 'primary',
      asChild = false,
      color,
      fullWidth = false,
      loading = false,
      loadingLabel,
      disabled,
      className = '',
      style,
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const classes = [
      'royui-btn',
      `royui-btn--${size}`,
      `royui-btn--${variant}`,
      fullWidth ? 'royui-btn--full' : '',
      loading ? 'royui-btn--loading' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Derived vars first so an explicit `style` (or CSS-var override) still wins.
    const mergedStyle = color ? { ...tintVars(color), ...style } : style;
    const spinner = loadingLabel ?? <DefaultSpinner />;
    const isDisabled = disabled || loading;

    // Polymorphic path: paint the styles onto the child element (e.g. a link)
    // instead of a <button>, so native anchor semantics survive.
    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{
        className?: string;
        style?: CSSProperties;
        children?: ReactNode;
      }>;
      const childRef = (child as unknown as { ref?: Ref<unknown> }).ref;
      return cloneElement(
        child,
        {
          ...rest,
          className: [classes, child.props.className].filter(Boolean).join(' '),
          style: { ...mergedStyle, ...child.props.style },
          'aria-busy': loading || undefined,
          'aria-disabled': isDisabled || undefined,
          ref: mergeRefs(ref as Ref<unknown>, childRef),
        } as Record<string, unknown>,
        loading ? spinner : child.props.children,
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={classes}
        style={mergedStyle}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading ? spinner : children}
      </button>
    );
  },
);

Button.displayName = 'Button';
