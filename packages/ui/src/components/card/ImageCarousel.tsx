'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import './ImageCarousel.css';

export interface CarouselImage {
  src: string;
  alt?: string;
}

export interface ImageCarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Slides, in order. A single image renders without dots or drag. */
  images: CarouselImage[];
  /** Controlled active index. Leave undefined for uncontrolled. */
  index?: number;
  /** Starting index when uncontrolled. Default 0. */
  defaultIndex?: number;
  /** Fires with the new index on every change (drag, dot, or keyboard). */
  onIndexChange?: (index: number) => void;
  /** Show the pagination dots. Auto-hidden for a single image. Default true. */
  showDots?: boolean;
  /** Allow pointer drag / swipe between slides. Default true. */
  draggable?: boolean;
  /** Aspect ratio of the media box, e.g. "4 / 3" or "1 / 1". Default "4 / 3". */
  ratio?: string;
  /** Overlay slot painted on top of the image — a badge, a gradient, anything. */
  overlay?: ReactNode;
  /** Advance to the next slide on a timer, looping back to the first. Default false. */
  autoplay?: boolean;
  /** Milliseconds between auto-advances. Default 2500. */
  autoplayInterval?: number;
  /** Pause autoplay while the pointer is over the gallery. Default true. */
  pauseOnHover?: boolean;
}

/** How far you have to drag, as a fraction of the width, before it commits. */
const COMMIT_THRESHOLD = 0.18;
/** Resistance applied when dragging past the first or last slide. */
const RUBBER_BAND = 0.35;

export const ImageCarousel = forwardRef<HTMLDivElement, ImageCarouselProps>(
  (
    {
      images,
      index,
      defaultIndex = 0,
      onIndexChange,
      showDots = true,
      draggable = true,
      ratio = '4 / 3',
      overlay,
      autoplay = false,
      autoplayInterval = 2500,
      pauseOnHover = true,
      className = '',
      style,
      ...rest
    },
    ref,
  ) => {
    const count = images.length;
    const multiple = count > 1;
    const labelId = useId();

    const [internal, setInternal] = useState(() =>
      Math.max(0, Math.min(count - 1, defaultIndex)),
    );
    const active = index ?? internal;

    const commit = useCallback(
      (next: number) => {
        const clamped = Math.max(0, Math.min(count - 1, next));
        if (clamped === active) return;
        if (index === undefined) setInternal(clamped);
        onIndexChange?.(clamped);
      },
      [active, count, index, onIndexChange],
    );

    // Drag state. `drag` is the live pixel offset of the current gesture.
    const viewportRef = useRef<HTMLDivElement>(null);
    const startX = useRef(0);
    const widthRef = useRef(0);
    const [drag, setDrag] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [hovered, setHovered] = useState(false);

    // Autoplay — one timeout, re-armed whenever `active` changes (so a manual
    // dot tap or swipe also restarts the clock). Paused on hover and drag, and
    // skipped entirely under reduced-motion.
    useEffect(() => {
      if (!autoplay || !multiple || dragging) return;
      if (pauseOnHover && hovered) return;
      if (
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }
      const id = window.setTimeout(
        () => commit(active + 1 >= count ? 0 : active + 1),
        autoplayInterval,
      );
      return () => window.clearTimeout(id);
    }, [
      autoplay,
      autoplayInterval,
      pauseOnHover,
      hovered,
      dragging,
      multiple,
      active,
      count,
      commit,
    ]);

    const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggable || !multiple || e.button !== 0) return;
      widthRef.current = viewportRef.current?.offsetWidth ?? 0;
      startX.current = e.clientX;
      setDragging(true);
      viewportRef.current?.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      let dx = e.clientX - startX.current;
      const atStart = active === 0 && dx > 0;
      const atEnd = active === count - 1 && dx < 0;
      if (atStart || atEnd) dx *= RUBBER_BAND;
      setDrag(dx);
    };

    const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      setDragging(false);
      viewportRef.current?.releasePointerCapture?.(e.pointerId);
      const threshold = (widthRef.current || 1) * COMMIT_THRESHOLD;
      if (drag <= -threshold) commit(active + 1);
      else if (drag >= threshold) commit(active - 1);
      setDrag(0);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!multiple) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        commit(active + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        commit(active - 1);
      }
    };

    // Slide the track by whole slides, then add the in-flight drag offset.
    const trackStyle: CSSProperties = {
      transform: `translate3d(calc(${-active * 100}% + ${drag}px), 0, 0)`,
    };

    const classes = [
      'royui-carousel',
      showDots && multiple ? 'royui-carousel--has-dots' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        style={{ ['--royui-carousel-ratio' as string]: ratio, ...style }}
        role="group"
        aria-roledescription="carousel"
        aria-label="Property images"
        {...rest}
      >
        <div
          ref={viewportRef}
          className="royui-carousel__viewport"
          tabIndex={multiple ? 0 : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          onMouseEnter={
            autoplay && pauseOnHover ? () => setHovered(true) : undefined
          }
          onMouseLeave={
            autoplay && pauseOnHover ? () => setHovered(false) : undefined
          }
        >
          <div
            className={[
              'royui-carousel__track',
              dragging ? 'royui-carousel__track--dragging' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={trackStyle}
          >
            {images.map((img, i) => (
              <div className="royui-carousel__slide" key={`${img.src}-${i}`}>
                <img
                  className="royui-carousel__img"
                  src={img.src}
                  alt={img.alt ?? ''}
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  aria-hidden={i !== active}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="royui-carousel__scrim" aria-hidden="true" />

        {overlay != null && (
          <div className="royui-carousel__overlay">{overlay}</div>
        )}

        {showDots && multiple && (
          <div
            className="royui-carousel__dots"
            role="tablist"
            aria-label="Choose image"
          >
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Image ${i + 1} of ${count}`}
                className={[
                  'royui-carousel__dot',
                  i === active ? 'royui-carousel__dot--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => commit(i)}
              />
            ))}
          </div>
        )}

        <span
          id={labelId}
          className="royui-carousel__status"
          role="status"
          aria-live="polite"
        >
          {multiple ? `Image ${active + 1} of ${count}` : ''}
        </span>
      </div>
    );
  },
);

ImageCarousel.displayName = 'ImageCarousel';
