'use client';

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import './Switch.css';
import { FieldMessage, resolveMessage, useShake } from '../_internal/field-shared';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role' | 'size'> {
  label?: ReactNode;
  helperText?: ReactNode;
  /** Error state. A string becomes the helper line; the control shakes once. */
  error?: boolean | string;
  /** Label side relative to the track. Default 'end'. */
  labelPosition?: 'start' | 'end';
  size?: 'sm' | 'md';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      helperText,
      error = false,
      labelPosition = 'end',
      size = 'md',
      theme = 'auto',
      className = '',
      id,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const reactId = useId();
    const fieldId = id ?? `royui-switch-${reactId}`;
    const messageId = `${fieldId}-message`;

    const isError = Boolean(error);
    const message = resolveMessage(error, false, helperText);
    const shake = useShake(isError);

    const classes = [
      'royui-switch',
      `royui-switch--${size}`,
      `royui-switch--label-${labelPosition}`,
      isError ? 'royui-switch--error' : '',
      disabled ? 'royui-switch--disabled' : '',
      shake ? 'royui-switch--shake' : '',
      theme === 'dark' ? 'royui-switch--dark' : '',
      theme === 'auto' ? 'royui-switch--auto' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const labelEl = label != null && <span className="royui-switch__label">{label}</span>;

    return (
      <div className={classes}>
        <label className="royui-switch__row">
          {labelPosition === 'start' && labelEl}
          {/* Input precedes the track so :checked / :focus-visible drive it via `~`. */}
          <input
            {...rest}
            ref={ref}
            id={fieldId}
            type="checkbox"
            role="switch"
            disabled={disabled}
            className="royui-switch__input"
            aria-invalid={isError || undefined}
            aria-describedby={message ? messageId : undefined}
          />
          <span className="royui-switch__track" aria-hidden="true">
            <span className="royui-switch__thumb" />
          </span>
          {labelPosition === 'end' && labelEl}
        </label>

        {message && (
          <FieldMessage block="royui-switch" id={messageId} state={isError ? 'error' : 'idle'}>
            {message}
          </FieldMessage>
        )}
      </div>
    );
  },
);

Switch.displayName = 'Switch';
