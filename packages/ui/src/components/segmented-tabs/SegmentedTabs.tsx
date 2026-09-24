'use client';

import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { useSlidingIndicator } from '../_internal/sliding-indicator';
import './SegmentedTabs.css';

export interface SegmentedTabsItem<V extends string = string> {
  value: V;
  label: ReactNode;
  /** Optional leading icon (sized to 16px). */
  icon?: ReactNode;
  disabled?: boolean;
}

export type SegmentedTabsVariant = 'segmented' | 'underline';

export interface SegmentedTabsProps<V extends string = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  items: readonly SegmentedTabsItem<V>[];
  /** Controlled selected value. */
  value?: V;
  /** Initial value when uncontrolled. Defaults to the first enabled item. */
  defaultValue?: V;
  /** Called with the newly selected value. */
  onValueChange?: (value: V) => void;
  /** "segmented": a boxed toggle. "underline": a tab strip with a soft pill over an underline. Defaults to "segmented". */
  variant?: SegmentedTabsVariant;
  /** Defaults to "md". */
  size?: 'sm' | 'md';
  /** Stretch items to fill the container width. Defaults to false. */
  fullWidth?: boolean;
  /** Defaults to "auto" (follows prefers-color-scheme). */
  theme?: 'light' | 'dark' | 'auto';
  /**
   * id prefix of the panels these tabs control. When set, each tab gets
   * aria-controls="{panelIdPrefix}-{value}".
   */
  panelIdPrefix?: string;
}

function SegmentedTabsInner<V extends string = string>(
  {
    items,
    value,
    defaultValue,
    onValueChange,
    variant = 'segmented',
    size = 'md',
    fullWidth = false,
    theme = 'auto',
    panelIdPrefix,
    className = '',
    onKeyDown,
    ...rest
  }: SegmentedTabsProps<V>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const firstEnabled = items.find((i) => !i.disabled)?.value;
  const [inner, setInner] = useState<V | undefined>(defaultValue ?? firstEnabled);
  const selected = value !== undefined ? value : inner;
  const listRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const uid = useId();

  // Re-measure (snap, no glide) when anything that changes tab geometry changes.
  const layoutKey = `${variant}|${size}|${fullWidth}|${items.map((i) => i.value).join('\u0000')}`;
  useSlidingIndicator(listRef, indicatorRef, '[aria-selected="true"]', selected, 'x', layoutKey);

  const select = (v: V) => {
    if (value === undefined) setInner(v);
    if (v !== selected) onValueChange?.(v);
  };

  // Roving focus with automatic activation (WAI-ARIA tabs pattern).
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const enabled = items.filter((i) => !i.disabled);
    if (!enabled.length) return;
    const at = enabled.findIndex((i) => i.value === selected);
    let next: SegmentedTabsItem<V> | undefined;
    if (e.key === 'ArrowRight') next = enabled[(at + 1) % enabled.length];
    else if (e.key === 'ArrowLeft') next = enabled[(at - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') next = enabled[0];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    if (!next) return;
    e.preventDefault();
    select(next.value);
    listRef.current
      ?.querySelector<HTMLElement>(`[data-value="${CSS.escape(next.value)}"]`)
      ?.focus();
  };

  const classes = [
    'royui-segtabs',
    `royui-segtabs--${variant}`,
    `royui-segtabs--${size}`,
    fullWidth ? 'royui-segtabs--full' : '',
    theme === 'dark' ? 'royui-segtabs--dark' : '',
    theme === 'auto' ? 'royui-segtabs--auto' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const setRefs = (el: HTMLDivElement | null) => {
    listRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  return (
    <div
      ref={setRefs}
      role="tablist"
      aria-orientation="horizontal"
      className={classes}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {/* One shared indicator; first in the DOM so the positioned tabs paint over it. */}
      <span ref={indicatorRef} aria-hidden className="royui-segtabs__indicator" />
      {items.map((item) => {
        const isSel = item.value === selected;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            id={`${uid}-tab-${item.value}`}
            data-royui-item=""
            data-value={item.value}
            aria-selected={isSel}
            aria-controls={panelIdPrefix ? `${panelIdPrefix}-${item.value}` : undefined}
            tabIndex={isSel ? 0 : -1}
            disabled={item.disabled}
            className="royui-segtabs__tab"
            onClick={() => select(item.value)}
          >
            {item.icon ? (
              <span className="royui-segtabs__icon" aria-hidden>
                {item.icon}
              </span>
            ) : null}
            {/* A hidden medium-weight copy reserves the widest width, so weight changes never shift layout. */}
            <span className="royui-segtabs__label">
              <span>{item.label}</span>
              <span aria-hidden className="royui-segtabs__ghost">
                {item.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * A tab strip / segmented toggle with one shared indicator that glides between
 * options (translate + width, 250ms). WAI-ARIA tabs keyboard support:
 * ←/→ move and select, Home/End jump. Scrolls sideways when it overflows and
 * keeps the selected tab in view.
 */
export const SegmentedTabs = forwardRef(SegmentedTabsInner) as <V extends string = string>(
  props: SegmentedTabsProps<V> & { ref?: Ref<HTMLDivElement> },
) => ReactElement;
