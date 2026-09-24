'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import './SectionNav.css';
import { prefersReducedMotion, revealX } from '../_internal/sliding-indicator';

export interface SectionNavItem {
  /** The `id` of the section element this item links to. */
  id: string;
  label: ReactNode;
}

export interface SectionNavProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  items: readonly SectionNavItem[];
  /** Small heading above the list, e.g. "On this page". */
  title?: ReactNode;
  /** Vertical list with a reading rail, or a scrollable pill row with a progress bar. */
  orientation?: 'vertical' | 'horizontal';
  /** Show the reading-progress rail / bar. */
  showProgress?: boolean;
  /** Where a section counts as "being read": fraction down from the top of the scroll root. */
  readingLine?: number;
  /** Fires when the active section changes. */
  onActiveChange?: (id: string) => void;
  /** Any value; a change forces a rescan of the section elements. */
  deps?: unknown;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** `[data-scroll-root]`, else the nearest scrollable ancestor, else null (viewport). */
function findScrollRoot(el: HTMLElement): HTMLElement | null {
  const marked = el.closest<HTMLElement>('[data-scroll-root]');
  if (marked) return marked;
  for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
  }
  return null;
}

export const SectionNav = forwardRef<HTMLElement, SectionNavProps>(function SectionNav(
  {
    items,
    title,
    orientation = 'vertical',
    showProgress = true,
    readingLine = 0.3,
    onActiveChange,
    deps,
    theme = 'auto',
    className,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const navRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  /** Set by a click or #hash: that item stays active until real user input. */
  const pinnedRef = useRef<string | null>(null);
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  const vertical = orientation === 'vertical';

  const onChangeRef = useRef(onActiveChange);
  onChangeRef.current = onActiveChange;
  const lastEmitted = useRef<string | null>(null);
  useEffect(() => {
    if (active && active !== lastEmitted.current) {
      lastEmitted.current = active;
      onChangeRef.current?.(active);
    }
  }, [active]);

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      navRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const idsKey = items.map((i) => i.id).join('\n');
  const line = clamp01(readingLine);

  // Scroll-spy + progress.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !idsKey) return;
    const ids = idsKey.split('\n');
    const root = findScrollRoot(nav);
    const scroller: HTMLElement | Window = root ?? window;
    const scrollEl = root ?? document.scrollingElement ?? document.documentElement;

    let sections: (HTMLElement | null)[] = [];
    let frame = 0;
    let scanFrame = 0;

    const atBottom = () => {
      const max = scrollEl.scrollHeight - scrollEl.clientHeight;
      return max > 1 && scrollEl.scrollTop >= max - 2;
    };

    const paintProgress = (activeId: string | null, frac: number, bottom: boolean) => {
      const list = listRef.current;
      if (!list) return;
      const fill = fillRef.current;
      const dot = dotRef.current;
      const link = activeId
        ? list.querySelector<HTMLElement>(`a[data-section-id="${CSS.escape(activeId)}"]`)
        : null;
      if (vertical) {
        const total = list.offsetHeight || 1;
        let end = link ? link.offsetTop + frac * link.offsetHeight : 0;
        if (bottom) end = total;
        if (fill) fill.style.transform = `scaleY(${clamp01(end / total)})`;
        if (dot) {
          dot.style.transform = `translateY(${end}px)`;
          dot.style.opacity = end > 0.5 ? '1' : '0';
        }
      } else if (fill) {
        const idx = activeId ? ids.indexOf(activeId) : -1;
        const p = bottom ? 1 : idx < 0 ? 0 : (idx + frac) / ids.length;
        fill.style.transform = `scaleX(${clamp01(p)})`;
      }
    };

    // Geometry decides; observers and scroll only say when to look. One update per frame.
    const compute = () => {
      frame = 0;
      const top = root ? root.getBoundingClientRect().top : 0;
      const height = root ? root.clientHeight : window.innerHeight;
      const readY = top + height * line;
      let geoIdx = -1;
      let firstIdx = -1;
      let lastIdx = -1;
      const tops: number[] = [];
      sections.forEach((el, i) => {
        if (!el) return;
        const t = el.getBoundingClientRect().top;
        tops[i] = t;
        if (firstIdx < 0) firstIdx = i;
        lastIdx = i;
        if (t <= readY) geoIdx = i;
      });
      const bottom = atBottom();
      if (bottom && lastIdx >= 0) geoIdx = lastIdx;
      let frac = 0;
      if (geoIdx >= 0 && !bottom) {
        const el = sections[geoIdx]!;
        let end: number | undefined;
        for (let j = geoIdx + 1; j < sections.length; j++) {
          if (tops[j] !== undefined) {
            end = tops[j];
            break;
          }
        }
        if (end === undefined) end = el.getBoundingClientRect().bottom;
        const start = tops[geoIdx] ?? 0;
        const span = end - start;
        frac = span > 0 ? clamp01((readY - start) / span) : 1;
      }
      const geoId = (geoIdx >= 0 ? ids[geoIdx] : firstIdx >= 0 ? ids[firstIdx] : null) ?? null;
      const next = pinnedRef.current ?? geoId;
      if (next) setActive(next);
      if (showProgress) {
        // While pinned the rail still tracks real geometry, so a smooth jump glides.
        paintProgress((geoIdx >= 0 ? ids[geoIdx] : null) ?? null, frac, bottom);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };

    // A band from the top of the root down to the reading line.
    const io = new IntersectionObserver(schedule, {
      root,
      rootMargin: `0px 0px -${(1 - line) * 100}% 0px`,
      threshold: [0, 1],
    });

    const scan = () => {
      scanFrame = 0;
      const found = ids.map((id) => document.getElementById(id));
      if (found.length === sections.length && found.every((el, i) => el === sections[i])) return;
      io.disconnect();
      sections = found;
      found.forEach((el) => el && io.observe(el));
      schedule();
    };
    const mo = new MutationObserver(() => {
      if (!scanFrame) scanFrame = requestAnimationFrame(scan);
    });
    mo.observe(root ?? document.body, { childList: true, subtree: true });

    // Only real user input releases a pin; programmatic scrolls don't.
    const release = () => {
      if (!pinnedRef.current) return;
      pinnedRef.current = null;
      schedule();
    };
    const fromHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!ids.includes(hash)) return;
      pinnedRef.current = hash;
      schedule();
    };

    const resize = new ResizeObserver(schedule);
    if (listRef.current) resize.observe(listRef.current);
    if (root) resize.observe(root);

    fromHash();
    scan();
    scroller.addEventListener('scroll', schedule, { passive: true });
    const inputEvents = ['wheel', 'touchmove', 'keydown', 'pointerdown'] as const;
    inputEvents.forEach((type) => scroller.addEventListener(type, release, { passive: true }));
    window.addEventListener('hashchange', fromHash);
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scanFrame);
      io.disconnect();
      mo.disconnect();
      resize.disconnect();
      scroller.removeEventListener('scroll', schedule);
      inputEvents.forEach((type) => scroller.removeEventListener(type, release));
      window.removeEventListener('hashchange', fromHash);
      window.removeEventListener('resize', schedule);
    };
  }, [idsKey, deps, line, vertical, showProgress]);

  // Horizontal: keep the active pill in view.
  const revealed = useRef(false);
  useLayoutEffect(() => {
    if (vertical) return;
    const list = listRef.current;
    if (!list || !active) return;
    const link = list.querySelector<HTMLElement>(`a[data-section-id="${CSS.escape(active)}"]`);
    if (link) revealX(list, link, revealed.current && !prefersReducedMotion());
    revealed.current = true;
  }, [active, vertical]);

  const onItemClick = (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();

    pinnedRef.current = id;
    setActive(id);
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
    const root = navRef.current ? findScrollRoot(navRef.current) : null;
    if (root) {
      const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
      const top =
        root.scrollTop + section.getBoundingClientRect().top - root.getBoundingClientRect().top - margin;
      root.scrollTo({ top: Math.max(0, top), behavior });
    } else {
      section.scrollIntoView({ behavior, block: 'start', inline: 'nearest' });
    }
    if (window.location.hash !== `#${id}`) window.history.replaceState(null, '', `#${id}`);

    const heading =
      section.querySelector<HTMLElement>('[data-section-heading]') ??
      section.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6') ??
      section;
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  };

  const activeIndex = active ? items.findIndex((i) => i.id === active) : -1;
  const classes = [
    'royui-section-nav',
    `royui-section-nav--${orientation}`,
    `royui-section-nav--${theme}`,
    showProgress && 'royui-section-nav--progress',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav
      {...rest}
      ref={setRefs}
      aria-label={ariaLabel ?? (typeof title === 'string' ? title : 'On this page')}
      className={classes}
    >
      {title != null && <p className="royui-section-nav__title">{title}</p>}
      <div className="royui-section-nav__body">
        {showProgress && vertical && (
          <span className="royui-section-nav__rail" aria-hidden="true">
            <span ref={fillRef} className="royui-section-nav__fill" />
            <span ref={dotRef} className="royui-section-nav__dot" />
          </span>
        )}
        <ul ref={listRef} className="royui-section-nav__list">
          {items.map((item, i) => {
            const isActive = item.id === active;
            const state = isActive ? 'active' : activeIndex > i ? 'read' : 'unread';
            return (
              <li key={item.id} className="royui-section-nav__li">
                <a
                  href={`#${item.id}`}
                  data-section-id={item.id}
                  data-state={state}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(e) => onItemClick(e, item.id)}
                  className={`royui-section-nav__item royui-section-nav__item--${state}`}
                >
                  {/* Hidden medium-weight copy reserves width so weight changes never shift layout. */}
                  <span className="royui-section-nav__label">
                    <span className="royui-section-nav__text">{item.label}</span>
                    <span className="royui-section-nav__ghost" aria-hidden="true">
                      {item.label}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        {showProgress && !vertical && (
          <span className="royui-section-nav__bar" aria-hidden="true">
            <span ref={fillRef} className="royui-section-nav__fill" />
          </span>
        )}
      </div>
    </nav>
  );
});
