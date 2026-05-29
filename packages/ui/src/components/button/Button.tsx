'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import './Button.css';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual scale. Defaults to "md". */
  size?: ButtonSize;
  /** Stretch the button to fill its container. Defaults to false. */
  fullWidth?: boolean;
  /** Replaces children with a spinner and disables the button. */
  loading?: boolean;
  /** Optional override for the loading visual. Defaults to a spinner. */
  loadingLabel?: ReactNode;
  children: ReactNode;
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
      fullWidth = false,
      loading = false,
      loadingLabel,
      disabled,
      className = '',
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const classes = [
      'royui-btn',
      `royui-btn--${size}`,
      fullWidth ? 'royui-btn--full' : '',
      loading ? 'royui-btn--loading' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={classes}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading ? (loadingLabel ?? <DefaultSpinner />) : children}
      </button>
    );
  },
);

Button.displayName = 'Button';
