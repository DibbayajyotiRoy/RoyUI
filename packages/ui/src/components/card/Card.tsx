'use client';

import {
  Fragment,
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Button, type ButtonProps } from '../button';
import { ImageCarousel, type CarouselImage } from './ImageCarousel';
import './Card.css';

export interface CardStat {
  /** Small leading glyph. Inherits the muted stat color via currentColor. */
  icon?: ReactNode;
  /** The figure, full-strength — e.g. "264 m²" or "4". */
  value: ReactNode;
  /** Dimmed descriptor after the figure — e.g. "Living" or "Bedrooms". */
  label?: ReactNode;
}

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onChange'> {
  /** Gallery shown at the top, with swipe + dot pagination. */
  images: CarouselImage[];
  /** Pill label over the image, e.g. "Prime Pick". Hidden when omitted. */
  badge?: ReactNode;
  /** Glyph inside the badge. Defaults to a gold star. */
  badgeIcon?: ReactNode;
  /** Headline figure, e.g. "$250,000". */
  price: ReactNode;
  /** Muted qualifier next to the price, e.g. "List price". */
  priceLabel?: ReactNode;
  /** Secondary line under the price — owner, address, etc. */
  subtitle?: ReactNode;
  /** Inline figures separated by hairline dividers, e.g. living area and rooms. */
  stats?: CardStat[];
  /** Footer attribution. Becomes a link when authorHref is set. */
  author?: ReactNode;
  /** Makes the author name a link. */
  authorHref?: string;
  /** Extra attributes for the author link — target, rel, onClick, etc. */
  authorProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
  /** Right-aligned footer note, e.g. "2 days ago". */
  meta?: ReactNode;
  /** Label for the action button. Pass null to drop the button entirely. */
  actionLabel?: ReactNode;
  /** Click handler for the action button. */
  onAction?: () => void;
  /** Escape hatch onto the underlying Button (variant, color, loading, …). */
  actionProps?: Partial<ButtonProps>;
  /** Aspect ratio of the gallery. Default "4 / 3". */
  ratio?: string;
  /** Auto-advance the gallery on a timer, looping. Default false. */
  autoplay?: boolean;
  /** Milliseconds between auto-advances. Default 2500. */
  autoplayInterval?: number;
  /** Starting gallery index. */
  defaultIndex?: number;
  /** Fires when the gallery moves. */
  onIndexChange?: (index: number) => void;
  /** Lift + image-zoom on hover. Default true. */
  hoverEffect?: boolean;
  /**
   * Colour scheme. "auto" (default) follows the system via prefers-color-scheme;
   * "light" is a premium off-white surface, "dark" a near-black one.
   */
  theme?: 'light' | 'dark' | 'auto';
}

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2.5l2.7 5.9 6.4.7-4.8 4.3 1.3 6.3L12 16.9 6.4 19.7l1.3-6.3L2.9 9.1l6.4-.7L12 2.5z" />
  </svg>
);

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      images,
      badge,
      badgeIcon,
      price,
      priceLabel,
      subtitle,
      stats,
      author,
      authorHref,
      authorProps,
      meta,
      actionLabel = 'View Details',
      onAction,
      actionProps,
      ratio = '4 / 3',
      autoplay = false,
      autoplayInterval = 2500,
      defaultIndex,
      onIndexChange,
      hoverEffect = true,
      theme = 'auto',
      className = '',
      ...rest
    },
    ref,
  ) => {
    const classes = [
      'royui-card',
      hoverEffect ? 'royui-card--interactive' : '',
      theme === 'dark' ? 'royui-card--dark' : '',
      theme === 'auto' ? 'royui-card--auto' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const overlay =
      badge != null ? (
        <span className="royui-card__badge">
          <span className="royui-card__badge-icon">
            {badgeIcon ?? <StarIcon />}
          </span>
          {badge}
        </span>
      ) : undefined;

    return (
      <div ref={ref} className={classes} {...rest}>
        <ImageCarousel
          images={images}
          ratio={ratio}
          autoplay={autoplay}
          autoplayInterval={autoplayInterval}
          defaultIndex={defaultIndex}
          onIndexChange={onIndexChange}
          overlay={overlay}
        />

        <div className="royui-card__body">
          <div className="royui-card__price-row">
            <span className="royui-card__price">{price}</span>
            {priceLabel != null && (
              <span className="royui-card__price-label">{priceLabel}</span>
            )}
          </div>

          {subtitle != null && (
            <p className="royui-card__subtitle">{subtitle}</p>
          )}

          {stats && stats.length > 0 && (
            <>
              <div className="royui-card__divider" />
              <div className="royui-card__stats">
                {stats.map((stat, i) => (
                  <Fragment key={i}>
                    {i > 0 && (
                      <span
                        className="royui-card__stat-sep"
                        aria-hidden="true"
                      />
                    )}
                    <span className="royui-card__stat">
                      {stat.icon && (
                        <span
                          className="royui-card__stat-icon"
                          aria-hidden="true"
                        >
                          {stat.icon}
                        </span>
                      )}
                      <span className="royui-card__stat-value">{stat.value}</span>
                      {stat.label != null && (
                        <span className="royui-card__stat-label">
                          {stat.label}
                        </span>
                      )}
                    </span>
                  </Fragment>
                ))}
              </div>
            </>
          )}

          {(author != null || meta != null) && (
            <div className="royui-card__footer">
              {author != null && (
                <span className="royui-card__author">
                  By{' '}
                  {authorHref ? (
                    <a
                      href={authorHref}
                      className="royui-card__author-link"
                      {...authorProps}
                    >
                      {author}
                    </a>
                  ) : (
                    <span className="royui-card__author-link">{author}</span>
                  )}
                </span>
              )}
              {meta != null && (
                <span className="royui-card__meta">{meta}</span>
              )}
            </div>
          )}
        </div>

        {actionLabel != null && (
          <div className="royui-card__action">
            <Button fullWidth onClick={onAction} {...actionProps}>
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    );
  },
);

Card.displayName = 'Card';
