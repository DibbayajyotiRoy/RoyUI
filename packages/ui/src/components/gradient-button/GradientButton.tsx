'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import './GradientButton.css';

export interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingLabel?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

const DefaultSpinner = () => (
  <span className="gradient-btn__spinner" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
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

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    {
      loading = false,
      loadingLabel,
      fullWidth = true,
      disabled,
      className = '',
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const classes = [
      'gradient-btn',
      fullWidth ? 'gradient-btn--full' : '',
      loading ? 'gradient-btn--loading' : '',
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

GradientButton.displayName = 'GradientButton';
