'use client';

import {
  forwardRef,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';
import './MadeBy.css';

export type MadeByPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left';

export interface MadeByProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'prefix'> {
  /** Display name shown after the prefix. */
  name: string;
  /** URL opened when the badge is clicked. */
  href: string;
  /** Prefix copy. Defaults to "Made by". */
  prefix?: ReactNode;
  /** Viewport anchor. Defaults to "bottom-right". */
  position?: MadeByPosition;
  /** Optional leading slot — avatar, mark, emoji, dot. */
  icon?: ReactNode;
  /** Custom font-family for the author name. */
  nameFont?: string;
  /** Font style for the author name. Defaults to "italic". */
  nameStyle?: CSSProperties['fontStyle'];
}

export const MadeBy = forwardRef<HTMLAnchorElement, MadeByProps>(
  (
    {
      name,
      href,
      prefix = 'Made by',
      position = 'bottom-right',
      icon,
      nameFont,
      nameStyle,
      className = '',
      target = '_blank',
      rel = 'noopener noreferrer',
      ...rest
    },
    ref,
  ) => {
    const classes = [
      'royui-madeby',
      `royui-madeby--${position}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const nameStyles: CSSProperties = {};
    if (nameFont) nameStyles.fontFamily = nameFont;
    if (nameStyle) nameStyles.fontStyle = nameStyle;

    return (
      <a
        ref={ref}
        href={href}
        target={target}
        rel={rel}
        className={classes}
        {...rest}
      >
        {icon && (
          <span className="royui-madeby__icon" aria-hidden>
            {icon}
          </span>
        )}
        <span className="royui-madeby__prefix">{prefix}</span>
        <span
          className="royui-madeby__name"
          style={Object.keys(nameStyles).length ? nameStyles : undefined}
        >
          {name}
        </span>
      </a>
    );
  },
);

MadeBy.displayName = 'MadeBy';
