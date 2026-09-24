import { useLayoutEffect, useRef, type RefObject } from 'react';

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Positions ONE shared indicator behind the item matching `activeSelector`
 * inside `containerRef`. A change of `activeKey` glides (CSS transition);
 * first paint, resize, `layoutKey` changes and web-font swaps snap without
 * gliding. Styles are written straight to the DOM, so moving it never
 * re-renders React.
 *
 * `axis: 'x'` sets translateX + width; `axis: 'both'` sets translate + width +
 * height (vertical lists whose rows can differ in size).
 */
export function useSlidingIndicator(
  containerRef: RefObject<HTMLElement | null>,
  indicatorRef: RefObject<HTMLElement | null>,
  activeSelector: string,
  activeKey: unknown,
  axis: 'x' | 'both' = 'x',
  layoutKey?: unknown,
) {
  const placeRef = useRef<((animate: boolean) => void) | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;

    let placed = false;
    const place = (animate: boolean) => {
      const active = container.querySelector<HTMLElement>(activeSelector);
      if (!active) {
        indicator.style.opacity = '0';
        return;
      }
      const apply = () => {
        indicator.style.width = `${active.offsetWidth}px`;
        if (axis === 'x') {
          indicator.style.transform = `translateX(${active.offsetLeft}px)`;
        } else {
          indicator.style.height = `${active.offsetHeight}px`;
          indicator.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
        }
      };
      const glide = animate && placed && indicator.style.opacity === '1';
      if (glide) {
        apply();
      } else {
        // Snap: never glide in from a stale spot.
        indicator.style.transition = 'none';
        apply();
        void indicator.offsetWidth;
        indicator.style.transition = '';
      }
      indicator.style.opacity = '1';
      if (animate || !placed) revealX(container, active, glide);
      if (!placed) {
        placed = true;
        // From here on items stop painting their own active fill.
        container.dataset.indicator = 'ready';
      }
    };
    placeRef.current = place;
    place(false);

    // Observe every item too: a web-font swap resizes labels while the list keeps its size.
    const resize = new ResizeObserver(() => place(false));
    resize.observe(container);
    container
      .querySelectorAll<HTMLElement>('[data-royui-item]')
      .forEach((el) => resize.observe(el));
    let alive = true;
    document.fonts?.ready.then(() => alive && place(false)).catch(() => {});
    return () => {
      alive = false;
      resize.disconnect();
      placeRef.current = null;
      delete container.dataset.indicator;
    };
  }, [containerRef, indicatorRef, activeSelector, axis]);

  useLayoutEffect(() => {
    placeRef.current?.(true);
  }, [activeKey]);

  useLayoutEffect(() => {
    placeRef.current?.(false);
  }, [layoutKey]);
}

/** Scrolls a sideways-scrolling container just enough to show `active` (16px margin). */
export function revealX(container: HTMLElement, active: HTMLElement, animate: boolean) {
  if (container.scrollWidth <= container.clientWidth + 1) return;
  const pad = 16;
  const left = active.offsetLeft;
  const right = left + active.offsetWidth;
  let target = container.scrollLeft;
  if (left - pad < container.scrollLeft) target = left - pad;
  else if (right + pad > container.scrollLeft + container.clientWidth) {
    target = right + pad - container.clientWidth;
  }
  target = Math.max(0, target);
  if (target === container.scrollLeft) return;
  container.scrollTo({
    left: target,
    behavior: animate && !prefersReducedMotion() ? 'smooth' : 'auto',
  });
}
