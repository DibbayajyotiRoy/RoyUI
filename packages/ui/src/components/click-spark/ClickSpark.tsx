'use client';

import { useEffect, useRef, type RefObject } from 'react';

export interface ClickSparkProps {
  /**
   * Element to listen on. Omit to spark on every click in the document
   * (mount once, e.g. in your root layout).
   */
  target?: RefObject<HTMLElement | null>;
  /** Ray colour. Any CSS colour. Defaults to a soft tint of the clicked element's text colour. */
  color?: string;
  /** Number of rays in each burst. Defaults to 5. */
  rays?: number;
  /** Length of each ray in px. Defaults to 6. */
  size?: number;
  /** How far each ray travels outward while it fades, in px. Defaults to 8. */
  spread?: number;
  /** Ray thickness in px. Defaults to 1.25. */
  thickness?: number;
  /** Burst duration in ms. Defaults to 520. */
  duration?: number;
  /** Randomly rotate each burst, so rapid clicks don't stamp the same star. Defaults to true. */
  jitter?: boolean;
  /** Turn the effect off without unmounting. Defaults to false. */
  disabled?: boolean;
}

const START_OFFSET = 3;
const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

/**
 * A small star of rays that bursts from every pointer click and clears from
 * the centre outward. Renders nothing itself: bursts are fixed-position nodes
 * appended to <body> and removed when their animation ends.
 *
 * Pointer clicks only: keyboard activation (detail === 0) never sparks, and
 * neither does anything under prefers-reduced-motion.
 */
export function ClickSpark({
  target,
  color,
  rays = 5,
  size = 6,
  spread = 8,
  thickness = 1.25,
  duration = 520,
  jitter = true,
  disabled = false,
}: ClickSparkProps) {
  // Latest options without re-binding the listener on every render.
  const opts = useRef({ color, rays, size, spread, thickness, duration, jitter });
  opts.current = { color, rays, size, spread, thickness, duration, jitter };

  useEffect(() => {
    if (disabled) return;
    // A target ref that hasn't attached yet must not silently widen to the whole document.
    if (target && !target.current) return;
    const host: HTMLElement | Document = target?.current ?? document;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    function onClick(e: Event) {
      const ev = e as MouseEvent;
      if (reduced.matches || ev.detail === 0 || ev.button !== 0) return;
      const o = opts.current;
      const count = Math.max(1, Math.round(o.rays));

      // Tint from the clicked element's text colour so it reads on any surface.
      const source = ev.target instanceof Element ? ev.target : document.body;
      const fill =
        o.color ?? `color-mix(in oklab, ${getComputedStyle(source).color} 70%, transparent)`;

      const burst = document.createElement('div');
      burst.setAttribute('aria-hidden', 'true');
      const turn = o.jitter ? Math.random() * (360 / count) : 0;
      burst.style.cssText =
        `position:fixed;left:${ev.clientX}px;top:${ev.clientY}px;width:0;height:0;` +
        `pointer-events:none;z-index:2147483647;transform:rotate(${turn}deg);`;

      const animations: Animation[] = [];
      for (let i = 0; i < count; i++) {
        // A zero-size arm pivots on the click point; its ray points "up" in the
        // arm's frame, so rotation never moves the burst's centre.
        const arm = document.createElement('div');
        arm.style.cssText = `position:absolute;left:0;top:0;width:0;height:0;transform:rotate(${(360 / count) * i}deg);`;
        const ray = document.createElement('div');
        ray.style.cssText =
          `position:absolute;left:${-o.thickness / 2}px;top:${-(START_OFFSET + o.size)}px;` +
          `width:${o.thickness}px;height:${o.size}px;border-radius:${o.thickness}px;` +
          `background:${fill};transform-origin:50% 0%;`;
        arm.appendChild(ray);
        burst.appendChild(arm);
        animations.push(
          ray.animate(
            [
              { transform: 'translateY(0) scaleY(1)', opacity: 1 },
              { transform: `translateY(${-o.spread}px) scaleY(0)`, opacity: 0.35 },
            ],
            { duration: o.duration, easing: EASE, fill: 'forwards' },
          ),
        );
      }

      document.body.appendChild(burst);
      Promise.all(animations.map((a) => a.finished))
        .catch(() => {})
        .finally(() => burst.remove());
    }

    host.addEventListener('click', onClick, { capture: true, passive: true });
    return () => host.removeEventListener('click', onClick, { capture: true });
  }, [target, disabled]);

  return null;
}
