'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Reveals its children once they cross the viewport threshold.
 * - IntersectionObserver (off the main thread), not a scroll listener.
 * - Fires exactly once per section — observer disconnects after reveal.
 * - Animation kicks in at 15% visible with a 40px bottom offset, so
 *   content has already begun revealing by the time the user looks at it.
 * - `prefers-reduced-motion` short-circuits straight to the revealed state.
 */
export function ScrollReveal({
  children,
  className = '',
  as: Tag = 'div',
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  delayMs?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.classList.add('is-revealed');
      hasAnimated.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          if (delayMs > 0) {
            setTimeout(() => el.classList.add('is-revealed'), delayMs);
          } else {
            el.classList.add('is-revealed');
          }
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Tag as any;
  return (
    <Component ref={ref} className={`reveal-pre ${className}`}>
      {children}
    </Component>
  );
}
